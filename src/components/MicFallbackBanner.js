import { MIC_MESSAGES } from '../constants/micMessages'
import MicSettingsGuide from './MicSettingsGuide'

export default function MicFallbackBanner({ variant }) {
  if (!variant) return null

  const message =
    variant === 'unsupported'
      ? MIC_MESSAGES.UNSUPPORTED
      : variant === 'denied'
        ? MIC_MESSAGES.DENIED
        : MIC_MESSAGES.BROWSE_HINT

  const showSettingsGuide = variant === 'denied'

  return (
    <div
      role="status"
      className="relative z-10 mb-4 w-full max-w-sm rounded-xl border border-[#FFE4E8] bg-[#FFF8F9] px-4 py-3 text-left"
    >
      <p className="text-center text-sm font-medium text-[#F04452]">
        {MIC_MESSAGES.PERMISSION_REQUIRED}
      </p>
      <p className="mt-1 text-center text-xs leading-relaxed text-[#8B95A1]">{message}</p>
      {showSettingsGuide && <MicSettingsGuide compact />}
    </div>
  )
}
