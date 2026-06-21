import { motion } from 'framer-motion'
import { GAUGE_MARKS } from '../constants/expressionStages'

export default function GaugeBar({ gauge }) {
  const clamped = Math.max(0, Math.min(100, gauge))

  return (
    <div className="w-full max-w-xs">
      <div className="mb-2 flex items-center justify-between text-xs font-medium text-[#8B95A1]">
        <span>비워낸 정도</span>
        <span className="tabular-nums text-[#4E5968]">{Math.round(clamped)}%</span>
      </div>
      <div className="relative h-2 overflow-hidden rounded-full bg-[#E5E8EB]">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9]"
          initial={false}
          animate={{ width: `${clamped}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        />
        {GAUGE_MARKS.map((mark) => (
          <span
            key={mark}
            className="absolute top-0 bottom-0 w-px bg-[#B0B8C1]/60"
            style={{ left: `${mark}%` }}
            aria-hidden
          />
        ))}
      </div>
    </div>
  )
}
