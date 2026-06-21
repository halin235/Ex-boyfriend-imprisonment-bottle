// WebView build marker for Apps in Toss CLI: @apps-in-toss/web-framework
export default {
  appName: 'seal-the-ex',
  brand: {
    displayName: '전남친 봉인 항아리',
    primaryColor: '#3182F6',
    icon: 'https://static.toss.im/appsintoss/50917/b0a75b7c-120c-4cbe-a5cc-ea408ca81d21.png',
  },
  web: {
    host: '172.30.26.170',
    port: 5173,
    commands: {
      dev: 'vite dev --host 0.0.0.0',
      build: 'vite build',
    },
  },
  webViewProps: {},
  permissions: [
    {
      name: 'microphone',
      access: 'access',
    },
  ],
  outdir: 'dist',
}
