import { motion } from 'framer-motion'

const BAR_COUNT = 5
const BAR_HEIGHTS = [10, 16, 22, 16, 10]

export default function WhisperWaveform({ volumeLevel = 0, active }) {
  return (
    <div
      className="flex h-7 items-end justify-center gap-1"
      role="img"
      aria-label={active ? '속삭임 파형' : '대기 중 파형'}
    >
      {BAR_HEIGHTS.map((base, index) => {
        const scale = active ? 0.35 + volumeLevel * 0.85 : 0.2
        const height = base * scale

        return (
          <motion.span
            key={index}
            className="w-1 rounded-full bg-[#3182F6]"
            animate={{
              height: active ? height : base * 0.25,
              opacity: active ? 0.55 + volumeLevel * 0.45 : 0.35,
            }}
            transition={{
              type: 'spring',
              stiffness: 280,
              damping: 22,
              delay: index * 0.03,
            }}
          />
        )
      })}
    </div>
  )
}
