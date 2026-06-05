/**
 * 마이크 레벨 분류: 속삭임은 게이지 상승, 큰 소리는 저항(게이지 감소/정체)
 */
export const AUDIO_MODES = {
  SILENT: 'silent',
  WHISPER: 'whisper',
  LOUD: 'loud',
}

/** 정규화 RMS 기준 (캘리브레이션 가능) */
const WHISPER_MIN = 0.012
const WHISPER_MAX = 0.09
const LOUD_THRESHOLD = 0.22

export function computeRms(timeDomainData) {
  let sum = 0
  for (let i = 0; i < timeDomainData.length; i += 1) {
    const sample = (timeDomainData[i] - 128) / 128
    sum += sample * sample
  }
  return Math.sqrt(sum / timeDomainData.length)
}

export function classifyAudioLevel(rms) {
  if (rms >= LOUD_THRESHOLD) {
    return { mode: AUDIO_MODES.LOUD, rms }
  }
  if (rms >= WHISPER_MIN && rms <= WHISPER_MAX) {
    return { mode: AUDIO_MODES.WHISPER, rms }
  }
  return { mode: AUDIO_MODES.SILENT, rms }
}

/** 속삭임일수록 더 빠르게 충전 (중간 구간이 최적) */
export function getGaugeDelta(mode, rms, deltaMs) {
  const sec = deltaMs / 1000
  if (mode === AUDIO_MODES.WHISPER) {
    const sweetSpot = 0.045
    const proximity = 1 - Math.min(1, Math.abs(rms - sweetSpot) / sweetSpot)
    return (8 + proximity * 14) * sec
  }
  if (mode === AUDIO_MODES.LOUD) {
    return -10 * sec
  }
  return -0.3 * sec
}

export function getDisplayLevel(rms, mode) {
  if (mode === AUDIO_MODES.LOUD) return Math.min(1, rms * 2.2)
  if (mode === AUDIO_MODES.WHISPER) return Math.min(1, rms * 8)
  return Math.max(0.06, rms * 4)
}
