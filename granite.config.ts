// WebView build marker for Apps in Toss CLI: @apps-in-toss/web-framework
export default {
  appName: 'seal-the-ex',
  brand: {
    displayName: '전남친 봉인 항아리',
    primaryColor: '#3182F6',
    icon: null,
  },
  web: {
    host: 'localhost',
    port: 5173,
    commands: {
      dev: 'vite dev',
      build: 'vite build',
    },
  },
  webViewProps: {
    type: 'game',
  },
  permissions: [
    {
      name: 'microphone',
      access: 'access',
    },
  ],
  outdir: 'dist',
}
