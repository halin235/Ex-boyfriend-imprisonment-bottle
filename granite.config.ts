/**
 * 앱인토스(토스 미니앱) 배포 설정 예시
 * @see https://developers-apps-in-toss.toss.im
 */
import { defineConfig } from '@apps-in-toss/web-framework/config'

export default defineConfig({
  appName: 'ex-boyfriend-jar',
  web: {
    host: 'localhost',
    port: 5173,
  },
  permissions: [
    {
      name: 'microphone',
      access: 'access',
    },
  ],
})
