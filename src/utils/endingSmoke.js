/** 최종 엔딩 연기 파티클 (무한 루프) */
export function createEndingSmokeParticles(count = 12) {
  return Array.from({ length: count }, (_, i) => ({
    id: `ending-smoke-${i}`,
    x: (Math.random() - 0.5) * 56,
    width: 44 + Math.random() * 48,
    height: 52 + Math.random() * 60,
    delay: i * 0.22 + Math.random() * 0.35,
    duration: 2.8 + Math.random() * 1.4,
    driftX: (Math.random() - 0.5) * 28,
    risePeak: -72 - Math.random() * 56,
  }))
}
