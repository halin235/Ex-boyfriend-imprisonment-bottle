import { MIC_SETTINGS_GUIDE } from '../constants/micMessages'

export default function MicSettingsGuide({ compact = false }) {
  return (
    <div
      className={`rounded-xl bg-[#F2F4F6] text-left ${
        compact ? 'mt-3 px-3 py-3' : 'mt-4 px-4 py-4'
      }`}
      role="region"
      aria-label={MIC_SETTINGS_GUIDE.title}
    >
      <p className="text-xs font-semibold text-[#191F28]">{MIC_SETTINGS_GUIDE.title}</p>
      <ol className="mt-2 space-y-2">
        {MIC_SETTINGS_GUIDE.steps.map((step, index) => (
          <li key={step.id} className="flex gap-2 text-xs leading-relaxed text-[#4E5968]">
            <span className="shrink-0 font-medium text-[#3182F6]">{index + 1}.</span>
            <span>
              <span className="font-medium text-[#191F28]">[{step.label}]</span> {step.text}
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-[11px] leading-relaxed text-[#8B95A1]">
        {MIC_SETTINGS_GUIDE.footer}
      </p>
    </div>
  )
}
