# Toss Non-Game Mini App Release Review

## Scope

- Target app bundle: `seal-the-ex.ait`
- Target appName: `seal-the-ex`
- Guide source checked: `app-nongame.md` and Apps in Toss WebView build guidance

## Applied Changes

- Removed the in-app custom title/header area so the screen does not duplicate the native Toss navigation bar.
- Changed `granite.config.ts` from game mode to non-game WebView mode by setting `webViewProps` to an empty object.
- Standardized loading copy from game-resource wording to service loading wording.
- Fixed `LoadingScreen` duplicate `style` props so safe-area and background styles are both applied.
- Adjusted top safe-area spacing after removing the custom top header.
- Updated the exit confirmation title from game-specific wording to neutral screen-exit wording.
- Added a fallback back-navigation bypass so tapping "나가기" does not immediately reopen the custom back guard modal in browser fallback mode.
- Updated microphone permission copy from "게임" to "서비스".

## Non-Game Checklist

- Native navigation: Pass. The app no longer renders a custom top navigation/title bar.
- Root layout: Pass. Main screens use safe-area padding and do not assume a browser chrome layout.
- Loading UI: Pass. Loading text is neutral and service-oriented.
- Back behavior: Pass with fallback. Toss `backEvent` is handled through the bridge, and browser fallback history is guarded.
- Login: Not implemented. If added later, use the Apps in Toss SDK flow instead of a custom external login redirect.
- Payment: Not implemented. If added later, use the Apps in Toss SDK payment APIs and avoid opening external payment windows.
- Sensitive data: Pass based on prior scan. No API key/secret/token was found in source or env files.

## Login Integration Proposal

```js
import { login } from '@apps-in-toss/web-framework'

export async function requestTossLogin() {
  const result = await login()
  return result
}
```

Use this only after confirming the exact login API shape for the SDK version installed in the project.

## Payment Integration Proposal

```js
import { requestPayment } from '@apps-in-toss/web-framework'

export async function startTossPayment(paymentParams) {
  const result = await requestPayment(paymentParams)
  return result
}
```

Use the developer center's current payment API contract when payment is introduced. Do not hard-code API keys or payment secrets in the client bundle.

## Remaining Notes

- The public `app-nongame.md` content currently exposes only the checklist heading and summary, so detailed criteria were inferred from the Apps in Toss WebView build guidance and common non-game review requirements.
- The app still has a game-like concept and microphone interaction. The bundle is now configured as non-game, but final classification depends on Toss review policy.
