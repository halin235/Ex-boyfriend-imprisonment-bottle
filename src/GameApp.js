import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { getCriticalIntensity } from './utils/criticalShake'
import { GAME_PHASE } from './constants/gamePhases'
import { SAFE_AREA_ACTION_MARGIN, SAFE_AREA_PAGE } from './constants/safeArea'
import { getExpressionForGauge } from './constants/expressionStages'
import DestroySequence from './components/DestroySequence'
import ExitConfirmModal from './components/ExitConfirmModal'
import GaugeBar from './components/GaugeBar'
import JarComponent from './components/JarComponent'
import MicFallbackBanner from './components/MicFallbackBanner'
import MicPermissionGate from './components/MicPermissionGate'
import WhisperStatusBar from './components/WhisperStatusBar'
import { PULSE_DURATION_MS, useGaugeMilestoneHaptic } from './hooks/useGaugeMilestoneHaptic'
import { useMicPermissionGate } from './hooks/useMicPermissionGate'
import { useTossBackGuard } from './hooks/useTossBackGuard'
import { useWhisperMic } from './hooks/useWhisperMic'
import { AUDIO_MODES, getGaugeDelta } from './utils/audioLevels'
import {
  debugAudioFrame,
  debugAutoDestroy,
  debugGaugeState,
  debugLog,
  isGameDebugEnabled,
} from './utils/gameDebug'
import { getStageFromGauge } from './constants/expressionStages'
import { BG_DEEP_MYSTERY, BG_DESTROY_GLOW } from './constants/backgrounds'

export default function GameApp() {
  const [gauge, setGauge] = useState(0)
  const [gamePhase, setGamePhase] = useState(GAME_PHASE.SEAL)
  const [micSessionActive, setMicSessionActive] = useState(false)
  const [showExitModal, setShowExitModal] = useState(false)
  const [milestonePulse, setMilestonePulse] = useState(null)
  const autoBurstStartedRef = useRef(false)
  const endingVideoRef = useRef(null)

  const isGaugeFull = gauge >= 100

  const {
    showPermissionGate,
    browseWithoutMic,
    permissionChecked,
    onDismiss,
    onMicSuccess,
    onOpenGate,
    onFirstGateShown,
  } = useMicPermissionGate()

  const isDestroying = gamePhase === GAME_PHASE.DESTROYING
  const isDeleted = gamePhase === GAME_PHASE.DELETED
  const isSealed = gamePhase === GAME_PHASE.SEAL
  const showJar = isSealed

  useEffect(() => {
    if (showPermissionGate) {
      onFirstGateShown()
    }
  }, [showPermissionGate, onFirstGateShown])

  const handleAudioFrame = useCallback(({ mode, deltaMs, rms, displayLevel }) => {
    if (gamePhase !== GAME_PHASE.SEAL) return
    setGauge((prev) => {
      const next = prev + getGaugeDelta(mode, rms, deltaMs)
      const clamped = Math.max(0, Math.min(100, next))
      debugAudioFrame({ rms, mode, displayLevel, gauge: clamped })
      return clamped
    })
  }, [gamePhase])

  const {
    audioMode,
    volumeLevel,
    errorMessage,
    startListening,
    stopListening,
    pauseAnalysis,
    isListening,
    isRequesting,
    isDenied,
    isUnsupported,
  } = useWhisperMic({
    enabled: micSessionActive && isSealed && !isDestroying,
    onFrame: handleAudioFrame,
  })

  const expression = useMemo(() => getExpressionForGauge(gauge), [gauge])
  const isResisting = audioMode === AUDIO_MODES.LOUD && isListening && isSealed

  const handleMilestonePulse = useCallback((mark) => {
    setMilestonePulse(mark)
  }, [])

  useGaugeMilestoneHaptic(gauge, isSealed && !showExitModal, handleMilestonePulse)

  useEffect(() => {
    if (milestonePulse == null) return undefined
    const timer = setTimeout(() => setMilestonePulse(null), PULSE_DURATION_MS)
    return () => clearTimeout(timer)
  }, [milestonePulse])

  /** 감정 정리 100% → 마무리 영상 자동 재생 */
  useEffect(() => {
    if (gamePhase !== GAME_PHASE.SEAL) return
    if (!isGaugeFull) return
    if (autoBurstStartedRef.current) return

    autoBurstStartedRef.current = true
    debugAutoDestroy()
    setMicSessionActive(false)
    pauseAnalysis()
    setGamePhase(GAME_PHASE.DESTROYING)
  }, [gauge, gamePhase, isGaugeFull, pauseAnalysis])

  useTossBackGuard({
    enabled: !isDeleted && !isDestroying,
    onBackPress: () => {
      if (showExitModal) {
        setShowExitModal(false)
      } else {
        setShowExitModal(true)
      }
    },
  })

  const micFallbackVariant = useMemo(() => {
    if (isUnsupported) return 'unsupported'
    if (isDenied && !micSessionActive) return 'denied'
    if (browseWithoutMic) return 'browse'
    return null
  }, [isUnsupported, isDenied, micSessionActive, browseWithoutMic])

  const handleRequestMic = async () => {
    debugLog('마이크', '게이트 — 음성 테라피 버튼 탭')
    const ok = await startListening()
    if (ok) {
      setMicSessionActive(true)
      onMicSuccess()
      debugLog('마이크', '세션 활성화 (감정 정리 진행 가능)')
    }
  }

  useEffect(() => {
    if (isGameDebugEnabled()) {
      debugLog('환경', '개발 서버 — Toss 브릿지 Mock 사용 (vite alias)')
    }
  }, [])

  const handleDismissPermission = () => {
    onDismiss()
    setMicSessionActive(false)
    void stopListening()
  }

  const handleEndSession = () => {
    setMicSessionActive(false)
    void stopListening()
  }

  const handleRestartMic = () => {
    onOpenGate()
  }

  const handleDestroyComplete = useCallback(async () => {
    await stopListening()
    setMicSessionActive(false)
    setGamePhase(GAME_PHASE.DELETED)
  }, [stopListening])

  const handleConfirmExit = useCallback(() => {
    setShowExitModal(false)
    setMicSessionActive(false)
    void stopListening()
  }, [stopListening])

  const showStatusBar = micSessionActive && isListening && isSealed
  const showGate =
    permissionChecked && showPermissionGate && !browseWithoutMic && isSealed

  const mainBackground = useMemo(() => {
    if (isDestroying) return BG_DESTROY_GLOW
    return BG_DEEP_MYSTERY
  }, [isDestroying])

  const criticalIntensity = getCriticalIntensity(gauge, false)

  useEffect(() => {
    if (!isGameDebugEnabled() || !isSealed) return
    debugGaugeState({
      gauge,
      stageId: getStageFromGauge(gauge),
      stageLabel: expression.label,
      criticalIntensity,
    })
  }, [gauge, expression.label, criticalIntensity, isSealed])

  const statusMessage = isDeleted
    ? '감정 비우기를 마쳤어요'
    : isDestroying
      ? '감정을 비워내는 중이에요...'
      : criticalIntensity > 0 && gauge < 100
        ? '감정이 많이 올라왔어요'
        : browseWithoutMic
          ? '마이크 없이 둘러보는 중이에요'
          : '차분히 말하며 감정을 비워내세요'

  return (
    <>
      <motion.main
        className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden"
        style={{ ...SAFE_AREA_PAGE, backgroundColor: BG_DEEP_MYSTERY }}
        animate={{ backgroundColor: mainBackground }}
        transition={{
          duration: isDestroying ? 2.2 : 0,
          ease: 'easeInOut',
        }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: isDeleted
              ? 'radial-gradient(ellipse at 50% 40%, rgba(128,0,128,0.12) 0%, transparent 65%)'
              : isDestroying
                ? 'radial-gradient(ellipse at 50% 42%, rgba(216,92,255,0.18) 0%, transparent 62%)'
                : 'radial-gradient(ellipse at 50% 38%, rgba(147,51,234,0.14) 0%, transparent 68%)',
          }}
          aria-hidden
        />

        {isSealed && micFallbackVariant && (
          <MicFallbackBanner variant={micFallbackVariant} />
        )}

        {isSealed && (
          <div className="relative z-10 mb-6 w-full max-w-xs shrink-0 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 backdrop-blur-sm">
            <p className="mb-3 text-center text-sm font-medium text-purple-200/80">
              {statusMessage}
            </p>
            <GaugeBar gauge={gauge} />
          </div>
        )}

        <div className="relative z-10 flex min-h-0 w-full flex-1 flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {showJar && (
              <motion.div
                key="jar"
                className="flex w-full justify-center"
                exit={{
                  opacity: 0,
                  scale: 1.04,
                  transition: { duration: 0.12, ease: 'easeIn' },
                }}
              >
                <JarComponent
                  gauge={gauge}
                  expression={expression}
                  isResisting={isResisting && criticalIntensity === 0}
                  isPreBurst={false}
                  milestonePulse={milestonePulse}
                />
              </motion.div>
            )}
            {(isDestroying || isDeleted) && (
              <motion.div
                key="ending-video"
                className="relative flex w-full justify-center"
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                <DestroySequence
                  ref={endingVideoRef}
                  autoPlayOnMount={isDestroying}
                  frozen={isDeleted}
                  onComplete={isDestroying ? handleDestroyComplete : undefined}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {isDestroying && (
          <div
            className="fixed inset-0 z-[100] touch-none"
            style={{ pointerEvents: 'all' }}
            aria-hidden
            data-destroy-blocker
          />
        )}

        <div
          className="relative z-10 mt-6 flex w-full max-w-xs shrink-0 flex-col items-center gap-3"
          style={SAFE_AREA_ACTION_MARGIN}
        >
          {isSealed && !micSessionActive && !showGate && (
            <button
              type="button"
              onClick={handleRestartMic}
              className="h-11 w-full max-w-xs rounded-xl bg-[#3182F6] px-6 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              {browseWithoutMic || isDenied
                ? '전남친한테 못한 말 다시 쏟아내기'
                : '전남친한테 못한 말 쏟아내기'}
            </button>
          )}

          {isSealed && micSessionActive && (
            <button
              type="button"
              onClick={handleEndSession}
              className="text-xs font-medium text-purple-300/80 underline-offset-2 hover:underline"
            >
              음성 테라피 멈추기
            </button>
          )}
        </div>

        {showGate && (
          <MicPermissionGate
            onRequestMic={handleRequestMic}
            onDismiss={handleDismissPermission}
            isRequesting={isRequesting}
            errorMessage={errorMessage}
            isDenied={isDenied}
          />
        )}

        <WhisperStatusBar
          visible={showStatusBar}
          audioMode={audioMode}
          volumeLevel={volumeLevel}
          micActive={isListening}
        />
      </motion.main>

      <ExitConfirmModal
        open={showExitModal}
        onCancel={() => setShowExitModal(false)}
        onConfirmExit={handleConfirmExit}
      />
    </>
  )
}
