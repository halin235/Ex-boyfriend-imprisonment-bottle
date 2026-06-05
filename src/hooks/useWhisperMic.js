import { useCallback, useEffect, useRef, useState } from 'react'
import { MIC_MESSAGES } from '../constants/micMessages'
import {
  AUDIO_MODES,
  classifyAudioLevel,
  computeRms,
  getDisplayLevel,
} from '../utils/audioLevels'
import { debugLog } from '../utils/gameDebug'

const MIC_CONSTRAINTS = {
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: false,
  },
  video: false,
}

/**
 * 토스 인앱 WebView용 마이크 훅
 * - 명시적 사용자 동의 후에만 getUserMedia 호출
 * - 거부/미지원 시 graceful degrade (앱 멈춤 없음)
 * - rAF 루프 + 백그라운드 시 분석 중단 / 리소스 점유 최소화
 * - stopListening 시 AudioContext.close()까지 await
 */
export function useWhisperMic({ enabled, onFrame }) {
  const [status, setStatus] = useState('idle')
  const [audioMode, setAudioMode] = useState(AUDIO_MODES.SILENT)
  const [volumeLevel, setVolumeLevel] = useState(0)
  const [errorMessage, setErrorMessage] = useState(null)

  const streamRef = useRef(null)
  const contextRef = useRef(null)
  const analyserRef = useRef(null)
  const dataRef = useRef(null)
  const rafRef = useRef(null)
  const lastTimeRef = useRef(null)
  const enabledRef = useRef(enabled)
  const onFrameRef = useRef(onFrame)
  const statusRef = useRef(status)

  useEffect(() => {
    enabledRef.current = enabled
  }, [enabled])

  useEffect(() => {
    onFrameRef.current = onFrame
  }, [onFrame])

  useEffect(() => {
    statusRef.current = status
  }, [status])

  const cancelAnalysisLoop = useCallback(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    lastTimeRef.current = null
  }, [])

  const releaseResources = useCallback(async () => {
    cancelAnalysisLoop()

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop()
        } catch {
          /* ignore */
        }
      })
      streamRef.current = null
    }

    const ctx = contextRef.current
    contextRef.current = null
    analyserRef.current = null
    dataRef.current = null

    if (ctx && ctx.state !== 'closed') {
      try {
        if (ctx.state === 'running') {
          await ctx.suspend()
        }
        await ctx.close()
      } catch {
        /* ignore */
      }
    }

    setVolumeLevel(0)
    setAudioMode(AUDIO_MODES.SILENT)
  }, [cancelAnalysisLoop])

  const analyzeFrame = useCallback((timestamp) => {
    if (!enabledRef.current || !analyserRef.current || !dataRef.current) {
      return
    }

    if (document.visibilityState === 'hidden') {
      return
    }

    const analyser = analyserRef.current
    const data = dataRef.current
    analyser.getByteTimeDomainData(data)

    const rms = computeRms(data)
    const { mode } = classifyAudioLevel(rms)
    const displayLevel = getDisplayLevel(rms, mode)

    setAudioMode(mode)
    setVolumeLevel(displayLevel)

    const deltaMs =
      lastTimeRef.current == null ? 16 : Math.min(50, timestamp - lastTimeRef.current)
    lastTimeRef.current = timestamp

    onFrameRef.current?.({ rms, mode, deltaMs, displayLevel })

    rafRef.current = requestAnimationFrame(analyzeFrame)
  }, [])

  const startAnalysisLoop = useCallback(() => {
    cancelAnalysisLoop()
    lastTimeRef.current = null
    rafRef.current = requestAnimationFrame(analyzeFrame)
  }, [analyzeFrame, cancelAnalysisLoop])

  const startListening = useCallback(async () => {
    if (!navigator?.mediaDevices?.getUserMedia) {
      setStatus('unsupported')
      setErrorMessage(MIC_MESSAGES.UNSUPPORTED)
      return false
    }

    setStatus('requesting')
    setErrorMessage(null)
    debugLog('마이크', '권한 요청 중 (getUserMedia)...')

    try {
      const stream = await navigator.mediaDevices.getUserMedia(MIC_CONSTRAINTS)
      streamRef.current = stream

      const AudioContextClass = window.AudioContext || window.webkitAudioContext
      const context = new AudioContextClass()
      contextRef.current = context

      if (context.state === 'suspended') {
        await context.resume().catch(() => {})
      }

      const source = context.createMediaStreamSource(stream)
      const analyser = context.createAnalyser()
      analyser.fftSize = 256
      analyser.smoothingTimeConstant = 0.82
      source.connect(analyser)
      analyserRef.current = analyser
      dataRef.current = new Uint8Array(analyser.fftSize)

      setStatus('listening')
      debugLog('마이크', '권한 허용 — 분석 루프 시작')
      if (enabledRef.current && document.visibilityState === 'visible') {
        startAnalysisLoop()
      }
      return true
    } catch (err) {
      await releaseResources()

      if (err?.name === 'NotAllowedError' || err?.name === 'PermissionDeniedError') {
        debugLog('마이크', '권한 거부', { name: err?.name })
        setStatus('denied')
        setErrorMessage(MIC_MESSAGES.DENIED)
      } else if (err?.name === 'NotFoundError') {
        setStatus('error')
        setErrorMessage(MIC_MESSAGES.NOT_FOUND)
      } else {
        setStatus('error')
        setErrorMessage(MIC_MESSAGES.GENERIC)
      }
      return false
    }
  }, [releaseResources, startAnalysisLoop])

  const stopListening = useCallback(async () => {
    await releaseResources()
    setStatus('idle')
    setErrorMessage(null)
  }, [releaseResources])

  const pauseAnalysis = useCallback(() => {
    cancelAnalysisLoop()
    const ctx = contextRef.current
    if (ctx?.state === 'running') {
      ctx.suspend().catch(() => {})
    }
    setVolumeLevel(0)
    setAudioMode(AUDIO_MODES.SILENT)
  }, [cancelAnalysisLoop])

  useEffect(() => {
    if (enabled && status === 'listening' && analyserRef.current && document.visibilityState === 'visible') {
      const ctx = contextRef.current
      if (ctx?.state === 'suspended') {
        ctx.resume().catch(() => {})
      }
      if (rafRef.current == null) {
        startAnalysisLoop()
      }
    }
    if (!enabled && status === 'listening') {
      pauseAnalysis()
    }
  }, [enabled, status, startAnalysisLoop, pauseAnalysis])

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        pauseAnalysis()
        return
      }
      if (
        enabledRef.current &&
        statusRef.current === 'listening' &&
        analyserRef.current
      ) {
        const ctx = contextRef.current
        if (ctx?.state === 'suspended') {
          ctx.resume().catch(() => {})
        }
        startAnalysisLoop()
      }
    }

    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => document.removeEventListener('visibilitychange', onVisibilityChange)
  }, [pauseAnalysis, startAnalysisLoop])

  useEffect(() => {
    return () => {
      releaseResources()
    }
  }, [releaseResources])

  return {
    status,
    audioMode,
    volumeLevel,
    errorMessage,
    startListening,
    stopListening,
    pauseAnalysis,
    isListening: status === 'listening',
    isRequesting: status === 'requesting',
    isDenied: status === 'denied',
    isUnsupported: status === 'unsupported',
  }
}
