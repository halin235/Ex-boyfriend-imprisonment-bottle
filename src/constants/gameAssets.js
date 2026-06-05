import endingVideoSrc from '../assets/videos/ending.mp4'
import { EXPRESSION_STAGES } from './expressionStages'

/** 항아리 프레임 */
export const JAR_FRAME_SRC = '/images/sealing-jar.png'

/** 최종 엔딩 영상 (Vite asset URL) */
export const ENDING_VIDEO_SRC = endingVideoSrc

/** 게임 시작 전 프리로드 — 이미지 */
export function getGameImageUrls() {
  const characterUrls = Object.values(EXPRESSION_STAGES).map((stage) => stage.src)
  return [JAR_FRAME_SRC, ...characterUrls]
}

/** @deprecated 이미지 URL 목록 — getGameImageUrls 사용 */
export function getGameAssetUrls() {
  return getGameImageUrls()
}
