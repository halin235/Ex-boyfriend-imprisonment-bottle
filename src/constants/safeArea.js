/** 토스 인앱 · 노치/홈 인디케이터 대응 공통 safe-area 스타일 */
export const SAFE_AREA_PAGE = {
  paddingTop: 'max(1rem, env(safe-area-inset-top, 0px))',
  paddingBottom: 'max(9rem, calc(env(safe-area-inset-bottom, 0px) + 6rem))',
  paddingLeft: 'max(1rem, env(safe-area-inset-left, 0px))',
  paddingRight: 'max(1rem, env(safe-area-inset-right, 0px))',
}

export const SAFE_AREA_OVERLAY = {
  paddingTop: 'env(safe-area-inset-top, 0px)',
  paddingBottom: 'env(safe-area-inset-bottom, 0px)',
  paddingLeft: 'env(safe-area-inset-left, 0px)',
  paddingRight: 'env(safe-area-inset-right, 0px)',
}

export const SAFE_AREA_BOTTOM_OFFSET = {
  bottom: 'max(2rem, env(safe-area-inset-bottom, 0px))',
}

export const SAFE_AREA_ACTION_MARGIN = {
  marginBottom: 'env(safe-area-inset-bottom, 0px)',
}
