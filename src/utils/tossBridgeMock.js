/**
 * 로컬 개발용 토스 브릿지 Mock
 * - closeView 없음 → ExitConfirmModal이 history 폴백 사용
 * - backEvent 미연동 → useTossBackGuard의 popstate 폴백 사용
 */
export function createTossBridgeMock() {
  return {
    graniteEvent: {
      addEventListener(event, handlers) {
        if (event !== 'backEvent' || !handlers) {
          return () => {}
        }
        return () => {}
      },
    },
  }
}
