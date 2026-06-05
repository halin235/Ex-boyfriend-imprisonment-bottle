import { motion } from 'framer-motion'
import { SAFE_AREA_OVERLAY } from '../constants/safeArea'
import MicSettingsGuide from './MicSettingsGuide'

export default function MicPermissionGate({
  onRequestMic,
  onDismiss,
  isRequesting,
  errorMessage,
  isDenied,
}) {
  return (
    <motion.div
      className="fixed inset-0 z-30 flex items-end justify-center bg-[#191F28]/40 px-4 sm:items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      role="dialog"
      aria-labelledby="mic-permission-title"
      aria-describedby="mic-permission-desc"
      style={{
        ...SAFE_AREA_OVERLAY,
        paddingBottom: 'max(2rem, env(safe-area-inset-bottom, 0px))',
      }}
    >
      <motion.div
        className="w-full max-w-sm rounded-3xl bg-white px-6 py-6 shadow-[0_12px_40px_rgba(0,0,0,0.12)]"
        initial={{ y: 24 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
      >
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F2F4F6] text-2xl">
          🎙️
        </div>

        <h2 id="mic-permission-title" className="text-lg font-bold text-[#191F28]">
          마이크 권한이 필요해요
        </h2>
        <p id="mic-permission-desc" className="mt-2 text-sm leading-relaxed text-[#4E5968]">
          이 게임은 <strong className="font-semibold text-[#191F28]">속삭이며 감정을 배출</strong>하는
          방식으로 봉인 강도를 올려요. 마이크는 속삭임 인식에만 사용되며, 인터랙션이 끝나면
          바로 꺼집니다.
        </p>

        <ul className="mt-4 space-y-2 text-xs text-[#8B95A1]">
          <li className="flex gap-2">
            <span className="text-[#3182F6]">•</span>
            <span>작게 속삭일수록 봉인 게이지가 빨리 차요</span>
          </li>
          <li className="flex gap-2">
            <span className="text-[#3182F6]">•</span>
            <span>큰 소리는 전남친의 저항을 유발해요</span>
          </li>
          <li className="flex gap-2">
            <span className="text-[#3182F6]">•</span>
            <span>권한을 거부해도 앱은 계속 이용할 수 있어요</span>
          </li>
        </ul>

        {errorMessage && (
          <p className="mt-4 rounded-xl bg-[#FFF0F1] px-3 py-2 text-xs leading-relaxed text-[#F04452]">
            {errorMessage}
          </p>
        )}

        {isDenied && <MicSettingsGuide />}

        <div className="mt-6 flex flex-col gap-2">
          <button
            type="button"
            onClick={onRequestMic}
            disabled={isRequesting}
            className="h-12 w-full rounded-xl bg-[#3182F6] text-[15px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isRequesting ? '권한 확인 중...' : '속삭이기 시작'}
          </button>
          <button
            type="button"
            onClick={onDismiss}
            className="h-11 w-full rounded-xl text-sm font-medium text-[#8B95A1] hover:bg-[#F2F4F6]"
          >
            {isDenied ? '나중에 하기' : '권한 없이 둘러보기'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
