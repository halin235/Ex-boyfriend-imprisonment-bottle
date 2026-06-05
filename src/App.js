import { Suspense, lazy } from 'react'
import LoadingScreen from './components/LoadingScreen'
import { BG_DEEP_MYSTERY } from './constants/backgrounds'
import { useGamePreload } from './hooks/useGamePreload'

const GameApp = lazy(() => import('./GameApp.js'))

function GameSuspenseFallback() {
  return <LoadingScreen progress={100} hasError={false} />
}

export default function App() {
  const { isReady, hasError, progress, retry } = useGamePreload()

  if (!isReady) {
    return (
      <LoadingScreen progress={progress} hasError={hasError} onRetry={retry} />
    )
  }

  return (
    <div className="min-h-[100svh] min-h-[100dvh]" style={{ backgroundColor: BG_DEEP_MYSTERY }}>
      <Suspense fallback={<GameSuspenseFallback />}>
        <GameApp />
      </Suspense>
    </div>
  )
}
