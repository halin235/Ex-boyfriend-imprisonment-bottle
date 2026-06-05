/**
 * 로컬 개발용 @apps-in-toss/web-framework 스텁 (Vite alias 대상)
 * npm run dev 시 실제 패키지 없이 import 분석 통과
 */
import { createTossBridgeMock } from '../utils/tossBridgeMock.js'

const mock = createTossBridgeMock()

export async function closeView() {
  return undefined
}

export const graniteEvent = mock.graniteEvent
