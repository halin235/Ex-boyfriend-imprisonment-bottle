import relaxedSrc from '../assets/characters/expression_relaxed.png'
import annoyedSrc from '../assets/characters/expression_annoyed.png'
import scaredSrc from '../assets/characters/expression_scared.png'
import panickedSrc from '../assets/characters/expression_panicked.png'

/** 게이지 눈금 (구간 경계) */
export const GAUGE_MARKS = [25, 50, 75, 100]

export const EXPRESSION_STAGES = {
  relaxed: {
    id: 'relaxed',
    src: relaxedSrc,
    label: '여유',
    ariaLabel: '여유로운 표정',
    min: 0,
    max: 25,
  },
  annoyed: {
    id: 'annoyed',
    src: annoyedSrc,
    label: '불쾌',
    ariaLabel: '불쾌한 표정',
    min: 26,
    max: 50,
  },
  scared: {
    id: 'scared',
    src: scaredSrc,
    label: '공포',
    ariaLabel: '두려운 표정',
    min: 51,
    max: 75,
  },
  panicked: {
    id: 'panicked',
    src: panickedSrc,
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
