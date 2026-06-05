import { JAR_FRAME_SRC } from '../constants/gameAssets'

export const DESTRUCTION_DURATION_MS = 2800
export const SHARD_SETTLE_MS = 680
export const SMOKE_START_MS = 620

const JAR_BG_SIZE = '420px auto'

const SHARD_LAYOUTS = [
  { clip: 'polygon(8% 0%, 95% 5%, 70% 45%, 0% 35%)', bgPos: 'center 8%' },
  { clip: 'polygon(55% 0%, 100% 25%, 85% 55%, 40% 40%)', bgPos: '62% 5%' },
  { clip: 'polygon(0% 20%, 45% 0%, 50% 50%, 5% 60%)', bgPos: '8% 28%' },
  { clip: 'polygon(60% 15%, 100% 40%, 75% 70%, 35% 55%)', bgPos: '72% 32%' },
  { clip: 'polygon(25% 35%, 75% 30%, 90% 75%, 15% 80%)', bgPos: '48% 42%' },
  { clip: 'polygon(0% 55%, 35% 45%, 40% 95%, 0% 100%)', bgPos: '10% 72%' },
  { clip: 'polygon(40% 50%, 85% 48%, 100% 100%, 30% 100%)', bgPos: '68% 78%' },
  { clip: 'polygon(48% 0%, 100% 0%, 100% 38%, 55% 32%)', bgPos: '78% 12%' },
  { clip: 'polygon(0% 0%, 42% 8%, 38% 42%, 0% 48%)', bgPos: '5% 15%' },
  { clip: 'polygon(20% 58%, 58% 52%, 62% 92%, 18% 88%)', bgPos: '38% 68%' },
  { clip: 'polygon(72% 58%, 100% 65%, 92% 95%, 58% 90%)', bgPos: '82% 70%' },
  { clip: 'polygon(30% 12%, 55% 18%, 48% 38%, 22% 32%)', bgPos: '42% 18%' },
]

function pickShardCount() {
  return 8 + Math.floor(Math.random() * 5)
}

/** 바닥에 쌓이는 항아리 파편 (낙하 후 잔해 유지) */
export function createJarShards(count = pickShardCount()) {
  const layouts = [...SHARD_LAYOUTS]
  while (layouts.length < count) {
    layouts.push(SHARD_LAYOUTS[layouts.length % SHARD_LAYOUTS.length])
  }

  return Array.from({ length: count }, (_, i) => {
    const layout = layouts[i % layouts.length]
    const spreadX = (Math.random() - 0.5) * 64
    const fallY = 72 + Math.random() * 88
    const rotA = (Math.random() - 0.5) * 55
    const rotB = rotA + 75 + Math.random() * 95
    const rotC = rotB + 45 + Math.random() * 80

    return {
      id: `jar-shard-${i}`,
      clip: layout.clip,
      bgPos: layout.bgPos,
      width: 34 + Math.random() * 42,
      height: 30 + Math.random() * 38,
      tx: spreadX,
      ty: fallY,
      rotate: [0, rotA, rotB, rotC],
      finalScale: 0.78 + Math.random() * 0.18,
      delay: Math.random() * 0.1,
      fallDuration: 0.52 + Math.random() * 0.32,
      jarImage: JAR_FRAME_SRC,
      bgSize: JAR_BG_SIZE,
    }
  })
}

/** 잔해 위로 피어오르는 연기 (파편 낙하 후 시작) */
export function createSmokeParticles(count = 14) {
  return Array.from({ length: count }, (_, i) => ({
    id: `smoke-${i}`,
    x: (Math.random() - 0.5) * 72,
    baseYOffset: 8 + Math.random() * 16,
    riseY: [0, -48 - Math.random() * 40, -100 - Math.random() * 50],
    width: 40 + Math.random() * 52,
    height: 44 + Math.random() * 58,
    delay: SMOKE_START_MS / 1000 + Math.random() * 0.45,
    duration: 1.6 + Math.random() * 0.9,
    tint: i % 3 === 0 ? 'gray' : 'purple',
    driftX: (Math.random() - 0.5) * 36,
  }))
}

export function createBurstSparks(count = 8) {
  return Array.from({ length: count }, (_, i) => {
    const angle = (360 / count) * i + (Math.random() - 0.5) * 20
    const rad = (angle * Math.PI) / 180
    const dist = 50 + Math.random() * 80
    return {
      id: `spark-${i}`,
      tx: Math.cos(rad) * dist,
      ty: Math.sin(rad) * dist - 30,
      delay: i * 0.03,
    }
  })
}
