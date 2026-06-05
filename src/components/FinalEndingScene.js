import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BG_DEEP_MYSTERY } from '../constants/backgrounds'
import { FINAL_BROKEN_JAR_SRC } from '../constants/gameAssets'
import { createEndingSmokeParticles } from '../utils/endingSmoke'

const STAGE_BG = { backgroundColor: BG_DEEP_MYSTERY }

const JAR_GLOW_FILTER = 'drop-shadow(0 0 15px rgba(128, 0, 128, 0.3))'

const SMOKE_GRADIENT =
  'radial-gradient(ellipse at center, rgba(168,85,247,0.55) 0%, rgba(107,33,168,0.28) 42%, transparent 72%)'

export default function FinalEndingScene() {
  const smokeParticles = useMemo(() => createEndingSmokeParticles(), [])
  const [showDeleteLabel, setShowDeleteLabel] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowDeleteLabel(true), 400)
    return () => clearTimeout(timer)
  }, [])

  return (
    <motion.div
      className="relative flex w-full max-w-[min(420px,90vw)] flex-col items-center justify-center rounded-2xl"
      style={STAGE_BG}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
    >
      <div
        className="relative aspect-[3/4] w-full overflow-visible rounded-2xl"
        style={STAGE_BG}
      >
        {/* 깨진 항아리 최종 일러스트 */}
        <motion.div
          className="relative z-[4] flex h-full w-full items-center justify-center"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <img
            src={FINAL_BROKEN_JAR_SRC}
            alt="깨진 항아리 잔해"
            className="mx-auto block h-auto w-full max-h-full select-none object-contain"
            style={{
              filter: JAR_GLOW_FILTER,
              mixBlendMode: 'multiply',
            }}
            draggable={false}
          />
        </motion.div>

        {/* 보라색 연기 — 항아리 중심에서 무한 상승 */}
        {smokeParticles.map((p) => (
          <motion.div
            key={p.id}
            className="pointer-events-none absolute left-1/2 z-[6] rounded-full blur-lg"
            style={{
              top: '44%',
              width: p.width,
              height: p.height,
              marginLeft: -p.width / 2 + p.x,
              background: SMOKE_GRADIENT,
            }}
            initial={{ opacity: 0, y: 12, scale: 0.6, x: 0 }}
            animate={{
              opacity: [0.12, 0.58, 0.42, 0],
              y: [12, p.risePeak * 0.55, p.risePeak],
              scale: [0.6, 1.15, 1.35],
              x: [0, p.driftX * 0.5, p.driftX],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            aria-hidden
          />
        ))}

        {/* 삭제 문구 — 이미지·연기 위 */}
        <AnimatePresence>
          {showDeleteLabel && (
            <motion.p
              className="pointer-events-none absolute inset-x-0 top-[36%] z-[30] text-center text-3xl font-bold tracking-tight text-purple-50 drop-shadow-[0_2px_20px_rgba(0,0,0,0.9)] sm:text-4xl"
              initial={{ opacity: 0, y: 8, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              🗑 삭제
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
