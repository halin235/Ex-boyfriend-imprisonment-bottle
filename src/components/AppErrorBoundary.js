import { Component } from 'react'

export default class AppErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <main
          className="flex min-h-[100dvh] flex-col items-center justify-center bg-[#1a0a2e] px-6 text-center"
          style={{
            paddingTop: 'env(safe-area-inset-top, 0px)',
            paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          }}
        >
          <p className="text-lg font-semibold text-purple-100">잠시 문제가 생겼어요</p>
          <p className="mt-2 text-sm text-purple-300/80">앱을 다시 열어 주세요</p>
          <button
            type="button"
            className="mt-6 h-11 rounded-xl bg-[#3182F6] px-6 text-sm font-semibold text-white"
            onClick={() => window.location.reload()}
          >
            새로고침
          </button>
        </main>
      )
    }

    return this.props.children
  }
}
