import { createTossBridgeMock } from './tossBridgeMock'

/**
 * 토스 앱인토스(미니앱) WebView 브릿지
 *
 * 공식 종료 API: closeView() (@apps-in-toss/web-framework)
 * - toss.exit() 는 웹 미니앱 공식 API가 아님
 *
 * 환경 분기:
 * - 로컬 (NODE_ENV !== 'production' / Vite DEV): Mock → dynamic import 없음
 * - 토스 샌드박스·프로덕션: @apps-in-toss/web-framework 로드
 */

/** @returns {boolean} 로컬 Mock 사용 여부 */
export function shouldUseTossBridgeMock() {
  if (import.meta.env.VITE_TOSS_BRIDGE_MOCK === 'true') {
    return true
  }
  if (import.meta.env.VITE_TOSS_APP === 'true') {
    return false
  }
  if (import.meta.env.DEV) {
    return true
  }
  if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
    return true
  }
  return false
}

async function loadTossFramework() {
  if (shouldUseTossBridgeMock()) {
    return createTossBridgeMock()
  }

  try {
    const mod = await import(
      /* @vite-ignore */ '@apps-in-toss/web-framework'
    )
    return mod
  } catch {
    return createTossBridgeMock()
  }
}

export async function trySubscribeTossBackEvent(onBack) {
  if (typeof onBack !== 'function') return null

  const mod = await loadTossFramework()
  if (mod?.graniteEvent?.addEventListener) {
    return mod.graniteEvent.addEventListener('backEvent', {
      onEvent: () => {
        onBack()
      },
      onError: () => {},
    })
  }
  return null
}

/**
 * 미니앱 화면 종료 (토스 샌드박스: 「나가기」 확인 후 closeView)
 * @returns {Promise<boolean>} closeView 호출 성공 여부
 */
export async function tryCloseTossView() {
  if (shouldUseTossBridgeMock()) {
    return false
  }

  const mod = await loadTossFramework()
  if (typeof mod?.closeView === 'function') {
    await mod.closeView()
    return true
  }
  return false
}
