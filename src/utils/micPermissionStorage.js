const STORAGE_KEY = 'ex_boyfriend_jar_mic_prefs'

const DEFAULT_PREFS = {
  /** 권한 안내를 이미 확인함 (모달 1회 노출 완료) */
  promptSeen: false,
  /** 사용자가 '권한 없이 둘러보기' 선택 */
  dismissed: false,
  /** 마이크 세션을 한 번 이상 성공적으로 시작함 */
  hasUsedMic: false,
}

function readPrefs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULT_PREFS }
    return { ...DEFAULT_PREFS, ...JSON.parse(raw) }
  } catch {
    return { ...DEFAULT_PREFS }
  }
}

function writePrefs(partial) {
  try {
    const next = { ...readPrefs(), ...partial }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    return next
  } catch {
    return readPrefs()
  }
}

/** 앱 최초 마운트 시 UI 초기 상태 (getUserMedia 호출 없음) */
export function getInitialMicUIState() {
  const prefs = readPrefs()
  if (prefs.dismissed) {
    return { showPermissionGate: false, browseWithoutMic: true }
  }
  if (prefs.promptSeen || prefs.hasUsedMic) {
    return { showPermissionGate: false, browseWithoutMic: false }
  }
  return { showPermissionGate: true, browseWithoutMic: false }
}

export function markMicPromptSeen() {
  return writePrefs({ promptSeen: true })
}

export function markMicDismissed() {
  return writePrefs({ promptSeen: true, dismissed: true })
}

export function markMicUsed() {
  return writePrefs({ promptSeen: true, dismissed: false, hasUsedMic: true })
}

export function clearMicDismissedForRetry() {
  return writePrefs({ dismissed: false, promptSeen: true })
}

/** 브라우저 권한 API 1회 조회 (반복 getUserMedia 방지용) */
export async function queryMicPermissionOnce() {
  if (!navigator?.permissions?.query) {
    return 'unsupported'
  }
  try {
    const status = await navigator.permissions.query({ name: 'microphone' })
    return status.state
  } catch {
    return 'unknown'
  }
}
