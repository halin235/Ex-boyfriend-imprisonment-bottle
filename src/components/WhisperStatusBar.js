import { AnimatePresence, motion } from 'framer-motion'
import { SAFE_AREA_BOTTOM_OFFSET } from '../constants/safeArea'
import { AUDIO_MODES } from '../utils/audioLevels'
import WhisperWaveform from './WhisperWaveform'

const STATUS_COPY = {
  [AUDIO_MODES.WHISPER]: {
    title: '속삭임 인식 중...',
    hint: '작게 속삭일수록 봉인이 빨라져요',
    tone: 'listening',
  },
  [AUDIO_MODES.LOUD]: {
    title: '소리가 너무 커요',
    hint: '전남친이 저항하고 있어요 · 작게 속삭여 주세요',
    tone: 'resist',
  },
  [AUDIO_MODES.SILENT]: {
    title: '속삭임을 기다리는 중...',
    hint: '항아리에 대고 작게 말해 보세요',
    tone: 'idle',
  },
}

export default function WhisperStatusBar({ visible, audioMode, volumeLevel, micActive }) {
  const copy = STATUS_COPY[audioMode] ?? STATUS_COPY[AUDIO_MODES.SILENT]
  const isListening = micActive && audioMode === AUDIO_MODES.WHISPER

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed left-1/2 z-20 w-[min(340px,calc(100vw-env(safe-area-inset-left)-env(safe-area-inset-right)-2rem))] -translate-x-1/2"
          style={SAFE_AREA_BOTTOM_OFFSET}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.25 }}
        >
          <div className="rounded-2xl border border-[#E5E8EB] bg-white/95 px-5 py-4 shadow-[0_8px_24px_rgba(0,0,0,0.08)] backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3">
              <WhisperWaveform volumeLevel={volumeLevel} active={micActive} />

              <div className="text-center">
                <p
                  className={`text-[15px] font-semibold tracking-tight ${
                    copy.tone === 'resist' ? 'text-[#F04452]' : 'text-[#191F28]'
                  }`}
                >
                  {copy.title}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-[#8B95A1]">{copy.hint}</p>
              </div>

              {isListening && (
                <motion.span
                  className="h-1.5 w-1.5 rounded-full bg-[#3182F6]"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                  aria-hidden
                />
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
