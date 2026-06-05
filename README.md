# 전남친 봉인 항아리

미련과 분노를 속삭이며 봉인하고, 항아리를 파괴하며 카타르시스를 느끼는 미니 게임입니다.

## 1단계

- React + Tailwind CSS + Framer Motion
- `src/App.js` — 전체 레이아웃, 신비로운 보라색 배경
- `src/components/JarComponent.js` — 항아리 이미지 + 전남친 이모지 오버레이

## 2단계

- 마이크 속삭임 인식 (`hooks/useWhisperMic.js`, `requestAnimationFrame` 루프)
- 속삭임 ↑ / 큰 소리 ↓ 분노 게이지 로직 (`utils/audioLevels.js`)
- 게이지 0·33·66·100% 구간별 표정 이모지 (`constants/expressionStages.js`)
- 토스 스타일 하단 상태바 + 파형 (`WhisperStatusBar`, `WhisperWaveform`)
- 권한 안내 모달 + 거부 시 graceful degrade (`MicPermissionGate`)

## 3단계 (현재)

- 게이지 100% → **[봉인 해제]** 버튼 활성화
- 파괴 연출: Framer Motion 파편 + 스파크 + 밝은 배경 전환 + `🗑 삭제`
- 햅틱: `navigator.vibrate([200, 100, 200])` (`utils/haptics.js`)
- 연출 종료 후 `AudioContext.close()` 및 마이크 트랙 해제

### 토스 미니앱 최종 점검 (반영)

| 항목 | 내용 |
|------|------|
| Safe Area | `viewport-fit=cover`, `constants/safeArea.js` 전역 적용 |
| 로딩 | 프리로드 + `Suspense` + `AppErrorBoundary` |
| 뒤로가기 | `graniteEvent` + `history` 폴백, 모달 열린 상태에서도 가드 유지 |
| 마이크 권한 | `localStorage` + `permissions.query` 1회, `getUserMedia`는 버튼 탭 시만 |
| 빌드 | `esbuild.drop: ['console']`, devDependencies 미포함, 청크 분리 |
| 배포 설정 | `granite.config.ts` (microphone 권한) |

### 토스 출시 Self-Review 반영

| 체크리스트 | 조치 |
|-----------|------|
| 권한 거부/미지원 | `MIC_MESSAGES` 통일, `MicFallbackBanner`, 앱 계속 동작 |
| 성능 | `visibilitychange` 시 분석 중단, 파괴 완료 시 `await context.close()` |
| 햅틱 | 파괴 시작 시 `triggerDestructionHaptic()` |
| Safe Area | `viewport-fit=cover`, `env(safe-area-inset-*)` 패딩 |

### 앱인토스 (토스) 설정

`granite.config.ts`에 마이크 사용 목적을 검수용으로 선언하고, WebView에서는 `getUserMedia`로 동작합니다.

```ts
permissions: [
  { name: 'microphone', access: 'access' }, // 콘솔/가이드에 맞게 설정
],
```

## 토스 제출 전 체크 (반영됨)

- **햅틱**: 게이지 25·50·75·100% 돌파 시 짧은 진동 (`useGaugeMilestoneHaptic`)
- **뒤로가기**: `useTossBackGuard` + `ExitConfirmModal` («게임이 종료됩니다»)
- **프리로드**: 4종 표정 PNG + 항아리(`sealing-jar.png`) 로드 후 게임 시작
- **빌드**: `npm run build` → `dist/` 폴더 제출

## 실행

```bash
cd ex-boyfriend-jar
npm install
npm run dev
```

## 프로덕션 빌드 (토스 제출용)

```bash
npm run build
# 또는
npm run build:dist
```

빌드 결과물은 `dist/` 디렉터리에 생성됩니다. 앱인토스 배포 시 `@apps-in-toss/web-framework`가 있으면 `graniteEvent` / `closeView`가 자동 연동됩니다.

브라우저에서 표시된 로컬 URL(보통 `http://localhost:5173`)을 엽니다.

## 에셋

항아리 이미지: `public/images/sealing-jar.png`
