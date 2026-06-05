import { motion } from 'framer-motion'
import { SAFE_AREA_OVERLAY } from '../constants/safeArea'
import { tryCloseTossView } from '../utils/tossBridge'

export default function ExitConfirmModal({ open, onCancel, onConfirmExit }) {
  if (!open) return null

  const handleExit = async () => {
    onConfirmExit?.()
    const closed = await tryCloseTossView()
    if (closed) return
    if (window.history.length > 1) {
      window.history.go(-1)
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#191F28]/50 px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      role="alertdialog"
      aria-labelledby="exit-modal-title"
      aria-describedby="exit-modal-desc"
      style={SAFE_AREA_OVERLAY}
    >
      <motion.div
        className="w-full max-w-sm rounded-3xl bg-white px-6 py-6 shadow-[0_12px_40px_rgba(0,0,0,0.12)]"
        initial={{ scale: 0.94, y: 8 }}
        animate={{ scale: 1, y: 0 }}
      >
        <h2 id="exit-modal-title" className="text-lg font-bold text-[#191F28]">
          게임이 종료됩니다
        </h2>
        <p id="exit-modal-desc" className="mt-2 text-sm leading-relaxed text-[#4E5968]">
          지금 나가면 진행 중인 봉인이 저장되지 않아요. 정말 나갈까요?
        </p>

        <div className="mt-6 flex flex-col gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="h-12 w-full rounded-xl bg-[#3182F6] text-[15px] font-semibold text-white"
          >
            계속하기
          </button>
          <button
            type="button"
            onClick={handleExit}
            className="h-11 w-full rounded-xl text-sm font-medium text-[#8B95A1] hover:bg-[#F2F4F6]"
          >
            나가기
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
