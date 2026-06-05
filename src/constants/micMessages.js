/** 토스 인앱 출시용 마이크 안내 문구 (일관된 UX) */
export const MIC_MESSAGES = {
  PERMISSION_REQUIRED: '마이크 권한이 필요합니다.',
  DENIED:
    '마이크 권한이 필요합니다. 아래 안내에 따라 토스 앱 설정에서 마이크를 허용해 주세요.',
  UNSUPPORTED: '마이크 권한이 필요합니다. 이 환경에서는 마이크를 사용할 수 없어요.',
  NOT_FOUND: '마이크를 찾을 수 없어요. 기기 설정을 확인해 주세요.',
  GENERIC: '마이크를 시작할 수 없어요. 잠시 후 다시 시도해 주세요.',
  BROWSE_HINT: '마이크 권한이 필요합니다. 속삭이기를 시작하면 봉인 게이지가 올라가요.',
}

/** 마이크 거부 사용자 — 토스·OS 설정 이동 가이드 */
export const MIC_SETTINGS_GUIDE = {
  title: '마이크 권한 켜는 방법',
  steps: [
    {
      id: 'toss',
      label: '토스 앱',
      text: '토스 앱 우측 하단 전체 → 설정 → 개인정보/권한 → 마이크 → 허용',
    },
    {
      id: 'ios',
      label: 'iPhone',
      text: '설정 → 개인정보 보호 및 보안 → 마이크 → 토스 → 켬',
    },
    {
      id: 'android',
      label: 'Android',
      text: '설정 → 앱 → 토스 → 권한 → 마이크 → 허용',
    },
  ],
  footer: '설정 변경 후 이 화면으로 돌아와 「속삭이기 다시 시작」을 눌러 주세요.',
}
