import { useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BG_DEEP_MYSTERY } from '../constants/backgrounds'
import { getCriticalIntensity, getCriticalShakeMotion } from '../utils/criticalShake'

const JAR_FRAME = '/images/sealing-jar.png'

const MILESTONE_SHAKE = {
  x: [0, -2, 2, -1.5, 1.5, 0],
  y: [0, 1.5, -1.5, 1, -1, 0],
}

export default function JarComponent({
  gauge = 0,
  expression,
  isResisting,
  isPreBurst,
  milestonePulse,
}) {
  const { id, src, ariaLabel } = expression
  const intensity = isPreBurst ? 1 : getCriticalIntensity(gauge)
  const isCritical = intensity > 0
  const criticalMotion = useMemo(
    () => getCriticalShakeMotion(intensity),
    [intensity],
  )

  const isPulsing = milestonePulse != null && !isPreBurst && !isCritical

  const jarAnimate = useMemo(() => {
    if (isCritical && criticalMotion) {
      return criticalMotion.animate
    }
    if (isResisting) {
      return {
        opacity: 1,
        y: 0,
        x: [0, -4, 4, -3, 3, 0],
        scale: 1,
      }
    }
    return { opacity: 1, y: 0, x: 0, scale: 1 }
  }, [isCritical, criticalMotion, isResisting])

  const jarTransition = useMemo(() => {
    if (isCritical && criticalMotion) {
      return criticalMotion.transition
    }
    if (isResisting) {
      return {
        opacity: { duration: 0.7, ease: 'easeOut' },
        y: { duration: 0.7, ease: 'easeOut' },
        x: { duration: 0.45, ease: 'easeInOut' },
      }
    }
    return {
      opacity: { duration: 0.7, ease: 'easeOut' },
      y: { duration: 0.7, ease: 'easeOut' },
    }
  }, [isCritical, criticalMotion, isResisting])

  const rune = criticalMotion?.rune

  return (
    <motion.div
      className="relative mx-auto w-full max-w-[min(420px,90vw)] rounded-2xl"
      style={{ backgroundColor: BG_DEEP_MYSTERY }}
      initial={{ opacity: 0, y: 24 }}
      animate={jarAnimate}
      transition={jarTransition}
    >
      {isCritical && rune && (
        <>
          <motion.div
            className="pointer-events-none absolute inset-[4%] z-0 rounded-[36%]"
            animate={{
              boxShadow: [
                `0 0 ${rune.glowSpread}px rgba(168,85,247,${rune.peakOpacity * 0.4})`,
                `0 0 ${rune.glowSpread * 1.6}px rgba(236,72,255,${rune.peakOpacity})`,
                `0 0 ${rune.glowSpread}px rgba(192,132,252,${rune.peakOpacity * 0.35})`,
              ],
            }}
            transition={{
              duration: rune.pulseDuration,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            aria-hidden
          />
          <motion.div
            className="pointer-events-none absolute left-[12%] right-[12%] top-[6%] z-0 h-[14%] rounded-full bg-[radial-gradient(ellipse,rgba(236,72,255,0.5)_0%,transparent_72%)]"
            animate={{ opacity: [0.15, rune.peakOpacity, 0.2, rune.peakOpacity * 0.9, 0.15] }}
            transition={{
              duration: rune.pulseDuration * 0.85,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            aria-hidden
          />
          <motion.div
            className="pointer-events-none absolute bottom-[18%] left-[18%] right-[18%] z-0 h-[10%] rounded-full bg-[radial-gradient(ellipse,rgba(192,132,252,0.45)_0%,transparent_70%)]"
            animate={{ opacity: [0.1, rune.peakOpacity * 0.85, 0.15, rune.peakOpacity, 0.1] }}
            transition={{
              duration: rune.pulseDuration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: rune.pulseDuration * 0.15,
            }}
            aria-hidden
          />
          <motion.div
            className="pointer-events-none absolute left-1/2 top-[54%] z-0 h-[32%] w-[34%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(147,51,234,0.35)_0%,transparent_68%)]"
            animate={{ opacity: [0.2, rune.peakOpacity * 0.7, 0.25, rune.peakOpacity * 0.8, 0.2] }}
            transition={{
              duration: rune.pulseDuration * 1.1,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: rune.pulseDuration * 0.08,
            }}
            aria-hidden
          />
        </>
      )}

      <div
        className="pointer-events-none absolute bottom-[6%] left-1/2 z-0 h-[14%] w-[62%] -translate-x-1/2 rounded-[50%] bg-black/35 blur-2xl"
        aria-hidden
      />

      <div
        className="relative z-[1]"
        style={{
          filter:
            'drop-shadow(0 0 10px rgba(0,0,0,0.5)) drop-shadow(0 12px 24px rgba(0,0,0,0.4))',
        }}
      >
        <img
          src={JAR_FRAME}
          alt="전남친 봉인 항아리"
          className="block h-auto w-full select-none"
          draggable={false}
        />
      </div>

      <div className="pointer-events-none absolute left-1/2 top-[54%] z-[2] h-[26%] w-[30%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={id}
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.88 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          >
            <motion.img
              key={isPulsing ? `pulse-${milestonePulse}` : 'idle'}
              src={src}
              alt={ariaLabel}
              role="img"
              className="h-[340%] w-[340%] max-w-none object-contain object-center"
              animate={isPulsing ? MILESTONE_SHAKE : { x: 0, y: 0 }}
              transition={{ duration: 0.1, ease: 'easeOut' }}
              draggable={false}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
