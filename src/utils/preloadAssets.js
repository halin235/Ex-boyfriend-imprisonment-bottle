export function preloadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => resolve(src)
    img.onerror = () => reject(new Error(`이미지 로드 실패: ${src}`))
    img.src = src
  })
}

/** 마무리 비디오 버퍼링 — 감정 정리 100% 직후 끊김 방지 */
export function preloadVideo(src) {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.preload = 'auto'
    video.muted = true
    video.playsInline = true

    const cleanup = () => {
      video.removeEventListener('canplaythrough', onReady)
      video.removeEventListener('error', onError)
    }

    const onReady = () => {
      cleanup()
      resolve(src)
    }

    const onError = () => {
      cleanup()
      reject(new Error(`비디오 로드 실패: ${src}`))
    }

    video.addEventListener('canplaythrough', onReady)
    video.addEventListener('error', onError)
    video.src = src
    video.load()
  })
}

export async function preloadGameAssets(urls) {
  const unique = [...new Set(urls)]
  const results = await Promise.allSettled(unique.map((url) => preloadImage(url)))
  const failed = results.filter((r) => r.status === 'rejected')

  return {
    ok: failed.length === 0,
    loaded: results.length - failed.length,
    total: unique.length,
    failed,
  }
}
