import type { PageRect } from "@/types/PageRect";

/**
 * ページのサイズと位置を返す
 */
export function calPageRect(
  containerRect?: DOMRect,
  pageSize?: { width: number; height: number },
  offset?: { top: number; bottom: number },
): PageRect {
  if (!offset || !pageSize || !containerRect) return {};
  const pageRatio = pageSize.width / pageSize.height;
  return preferredRect(
    offset.top,
    offset.bottom,
    pageRatio,
    containerRect.width,
    containerRect.height,
    containerRect.x,
  );

  /**
   * [width, height, deltaY（＝view中心とPdf中心の差）]
   */
  function preferredRect(
    offsetTop: number,
    offsetBottom: number,
    pageRatio: number, // width / height
    viewW: number,
    viewH: number,
    viewX: number,
  ) {
    const imgH = viewH / (1 - offsetTop - offsetBottom);
    const imgW = pageRatio * imgH;
    const top = imgH * offsetTop;
    const bottom = imgH * offsetBottom;
    const ratio = Math.min(1, viewW / imgW); // 画像が横にはみ出しそうな場合にこの係数をかけて縮小する
    const ratioTB = // top, bottomにかける係数
      ratio * imgH <= viewH
        ? 0 // 画像の縦方向もページ内に収まる場合は中央に配置する
        : (ratio * imgH - viewH) / (top + bottom); // 縦方向がはみ出す場合（分母が0の時はここには来ない）。ratio==1の時に 1, ratio*imgH==viewH の時に 0
    const x = viewX + (viewW - ratio * imgW) / 2;
    return {
      rect: new DOMRect(x, -ratioTB * top, ratio * imgW, ratio * imgH),
      top: -ratioTB * top,
      bottom: -ratioTB * bottom,
    };
  }
}
