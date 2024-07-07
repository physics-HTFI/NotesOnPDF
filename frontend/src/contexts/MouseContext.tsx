import PdfNotes from "@/types/PdfNotes";
import { Box } from "@mui/material";
import { ReactNode, createContext, useContext, useState } from "react";
import PdfNotesContext, { PageSize } from "./PdfNotesContext/PdfNotesContext";

export interface Mouse {
  pageX: number;
  pageY: number;
}

const MouseContext = createContext<{
  mouse?: Mouse;
  setMouse: (m: Mouse) => void;
  pageRect?: DOMRect;
  scale: number; // %単位
  top?: number;
  bottom?: number;
}>({
  setMouse: () => undefined,
  scale: 100,
});

export default MouseContext;

/**
 * `MouseContext`のプロバイダー
 */
export function MouseContextProvider({ children }: { children: ReactNode }) {
  const { pdfNotes, pageSizes, imageNum } = useContext(PdfNotesContext);
  const [mouse, setMouse] = useState({ pageX: 0, pageY: 0 });
  const [refContainer, setRefContainer] = useState<HTMLDivElement>();
  const containerRect = refContainer?.getBoundingClientRect();
  const { pageRect, top, bottom } = getRect(
    pdfNotes,
    imageNum,
    pageSizes,
    containerRect
  );

  const scale =
    !pdfNotes || !pageRect
      ? 100
      : (pdfNotes.settings.fontSize * pageRect.width) / 600;

  return (
    <MouseContext.Provider
      value={{ mouse, setMouse, pageRect, scale, top, bottom }}
    >
      <Box ref={setRefContainer}>{children}</Box>
    </MouseContext.Provider>
  );
}

/**
 * ページのサイズと位置を返す
 */
function getRect(
  pdfNotes?: PdfNotes,
  imageNum?: number,
  pageSizes?: PageSize[],
  containerRect?: DOMRect
): { pageRect?: DOMRect; top?: number; bottom?: number } {
  if (!pdfNotes || !pageSizes || !containerRect || imageNum === undefined)
    return {};
  const size = pageSizes[imageNum];
  if (!size) return {};
  const pageRatio = size.width / size.height;
  return preferredSize(
    pdfNotes.settings.offsetTop,
    pdfNotes.settings.offsetBottom,
    pageRatio,
    containerRect.width,
    containerRect.height,
    containerRect.x
  );

  /**
   * [width, height, deltaY（＝view中心とPdf中心の差）]
   */
  function preferredSize(
    offsetTop: number,
    offsetBottom: number,
    pageRatio: number, // width / height
    viewW: number,
    viewH: number,
    viewX: number
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
      pageRect: new DOMRect(x, -ratioTB * top, ratio * imgW, ratio * imgH),
      top: -ratioTB * top,
      bottom: -ratioTB * bottom,
    };
  }
}
