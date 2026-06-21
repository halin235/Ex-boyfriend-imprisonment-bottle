import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { motion } from 'framer-motion'
import { BG_DEEP_MYSTERY } from '../constants/backgrounds'
import { ENDING_VIDEO_SRC } from '../constants/gameAssets'
import { debugLog } from '../utils/gameDebug'
import { triggerDestructionHaptic } from '../utils/haptics'

const STAGE_BG = { backgroundColor: BG_DEEP_MYSTERY }

const COMPLETE_AFTER_END_MS = 900

const DestroySequence = forwardRef(function DestroySequence(
  { onComplete, frozen = false, autoPlayOnMount = false },
  ref,
) {
  const videoRef = useRef(null)
  const [videoReady, setVideoReady] = useState(false)
  const [videoEnded, setVideoEnded] = useState(false)
  const endedRef = useRef(false)
  const playStartedRef = useRef(false)

  const seekToLastFrame = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    const duration = video.duration
    if (Number.isFinite(duration) && duration > 0) {
      video.currentTime = Math.max(0, duration - 0.04)
    }
    video.pause()
    setVideoReady(true)
  }, [])

  const holdLastFrame = useCallback(() => {
    if (endedRef.current) return
    endedRef.current = true
    seekToLastFrame()
    setVideoEnded(true)
  }, [seekToLastFrame])

  const playVideo = useCallback(async () => {
    const video = videoRef.current
    if (!video) {
      debugLog('영상', 'play 실패 — video ref 없음')
      return false
    }

    endedRef.current = false
    playStartedRef.current = true
    setVideoEnded(false)
    setVideoReady(false)

    video.muted = true
    video.playsInline = true
    video.currentTime = 0
    video.pause()

    try {
      await video.play()
      setVideoReady(true)
      triggerDestructionHaptic()
      debugLog('영상', 'play() 성공', { src: ENDING_VIDEO_SRC })
      return true
    } catch (err) {
      debugLog('영상', 'play() 거부', { message: err?.message, src: ENDING_VIDEO_SRC })
      return false
    }
  }, [])

  useImperativeHandle(
    ref,
    () => ({
      playFromUserGesture: playVideo,
      playVideo,
      getVideoElement: () => videoRef.current,
    }),
    [playVideo],
  )

  /** 감정 정리 100% 도달 후 마운트 시 자동 재생 (muted → 브라우저 허용) */
  useEffect(() => {
    if (!autoPlayOnMount || frozen) return undefined

    let cancelled = false
    const video = videoRef.current

    const attemptPlay = async () => {
      if (cancelled) return
      const ok = await playVideo()
      if (!ok && video && !cancelled) {
        video.addEventListener('canplay', () => void playVideo(), { once: true })
      }
    }

    attemptPlay()

    return () => {
      cancelled = true
    }
  }, [autoPlayOnMount, frozen, playVideo])

  /** frozen(DELETED): 마지막 프레임만 표시, 재생 없음 */
  useEffect(() => {
    if (!frozen) return undefined

    endedRef.current = true
    setVideoEnded(true)
    const video = videoRef.current
    if (!video) return undefined

    const applyLastFrame = () => {
      seekToLastFrame()
    }

    if (video.readyState >= 1) {
      applyLastFrame()
    } else {
      video.addEventListener('loadedmetadata', applyLastFrame, { once: true })
      return () => video.removeEventListener('loadedmetadata', applyLastFrame)
    }
    return undefined
  }, [frozen, seekToLastFrame])

  useEffect(() => {
    if (!videoEnded || !onComplete || frozen) return undefined

    const timer = setTimeout(() => {
      onComplete()
    }, COMPLETE_AFTER_END_MS)

    return () => clearTimeout(timer)
  }, [videoEnded, onComplete, frozen])

  const handleEnded = () => {
    holdLastFrame()
  }

  const handleError = () => {
    debugLog('영상', '로드 오류', { src: ENDING_VIDEO_SRC })
  }

  return (
    <motion.div
      className="pointer-events-none relative flex w-full max-w-[min(420px,90vw)] flex-col items-center justify-center rounded-2xl"
      style={STAGE_BG}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className="pointer-events-none relative aspect-[3/4] w-full overflow-hidden rounded-2xl"
        style={STAGE_BG}
      >
        <video
          ref={videoRef}
          src={ENDING_VIDEO_SRC}
          className="absolute inset-0 h-full w-full object-contain"
          style={{
            opacity: videoReady || frozen ? 1 : 0,
            transition: 'opacity 0.25s ease-out',
          }}
          autoPlay={false}
          playsInline
          muted
          preload={frozen ? 'auto' : 'metadata'}
          onEnded={handleEnded}
          onError={handleError}
          aria-label="감정 비우기 마무리 영상"
        />
      </div>
    </motion.div>
  )
})

export default DestroySequence
