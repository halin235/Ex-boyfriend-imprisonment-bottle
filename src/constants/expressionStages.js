/** 감정 정리 눈금 (구간 경계) */
export const GAUGE_MARKS = [25, 50, 75, 100]

/** public/images — 배경 포함 전체 장면 표정 */
export const EXPRESSION_IMAGE_SRC = {
  relaxed: '/images/expression_relaxed.png',
  annoyed: '/images/expression_annoyed.png',
  scared: '/images/expression_scared.png',
  panicked: '/images/expression_panicked.png',
}

export const EXPRESSION_STAGES = {
  relaxed: {
    id: 'relaxed',
    src: EXPRESSION_IMAGE_SRC.relaxed,
    label: '여유',
    ariaLabel: '여유로운 표정',
    min: 0,
    max: 25,
  },
  annoyed: {
    id: 'annoyed',
    src: EXPRESSION_IMAGE_SRC.annoyed,
    label: '불쾌',
    ariaLabel: '불쾌한 표정',
    min: 26,
    max: 50,
  },
  scared: {
    id: 'scared',
    src: EXPRESSION_IMAGE_SRC.scared,
    label: '공포',
    ariaLabel: '두려운 표정',
    min: 51,
    max: 75,
  },
  panicked: {
    id: 'panicked',
    src: EXPRESSION_IMAGE_SRC.panicked,
    label: '패닉',
    ariaLabel: '공포에 질린 표정',
    min: 76,
    max: 100,
  },
}

export function getStageFromGauge(gauge) {
  const value = Math.max(0, Math.min(100, gauge))
  if (value >= 76) return 'panicked'
  if (value >= 51) return 'scared'
  if (value >= 26) return 'annoyed'
  return 'relaxed'
}

export function getExpressionForGauge(gauge) {
  const stage = getStageFromGauge(gauge)
  return EXPRESSION_STAGES[stage]
}
