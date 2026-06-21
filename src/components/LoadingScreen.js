import { motion } from 'framer-motion'
import { BG_DEEP_MYSTERY } from '../constants/backgrounds'
import { SAFE_AREA_OVERLAY } from '../constants/safeArea'

export default function LoadingScreen({ progress, hasError, onRetry }) {
  return (
    <main
      className="flex min-h-[100dvh] min-h-[100svh] flex-col items-center justify-center px-6"
      style={{ ...SAFE_AREA_OVERLAY, backgroundColor: BG_DEEP_MYSTERY }}
    >
      <motion.div
        className="w-full max-w-xs text-center"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-4xl" aria-hidden>
          🌿
        </p>
        <h1 className="mt-4 text-xl font-bold text-purple-100">전남친 봉인 항아리</h1>
        <p className="mt-2 text-sm text-purple-300/80">
          {hasError ? '화면을 불러오지 못했어요' : '서비스를 준비하고 있어요'}
        </p>

        <div className="mt-8 h-2 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-[#3182F6]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.25 }}
          />
        </div>
        <p className="mt-3 text-xs font-medium tabular-nums text-[#8B95A1]">{progress}%</p>

        {hasError && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-6 h-11 w-full rounded-xl bg-[#3182F6] text-sm font-semibold text-white"
          >
            다시 시도
          </button>
        )}
      </motion.div>
    </main>
  )
}
