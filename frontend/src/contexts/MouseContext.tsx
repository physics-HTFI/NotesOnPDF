import usePdfNotes from "@/hooks/usePdfNotes";
import { PdfNotes } from "@/types/PdfNotes";
import { Box } from "@mui/material";
import { FC, ReactNode, createContext, useState } from "react";

interface Mouse {
  pageX: number;
  pageY: number;
}

interface MouseContextType {
  mouse?: Mouse;
  setMouse: (m: Mouse) => void;
  pageRect?: DOMRect;
  scale: number; // %単位
  top?: number;
  bottom?: number;
}

export const MouseContext = createContext<MouseContextType>({
  setMouse: () => undefined,
  scale: 100,
});

/**
 * `MouseContextProvider`の引数
 */
interface Props {
  children: ReactNode;
}

/**
 * `MouseContext`のプロバイダー
 */
export const MouseContextProvider: FC<Props> = ({ children }) => {
  const { pdfNotes } = usePdfNotes();
  const [mouse, setMouse] = useState({ pageX: 0, pageY: 0 });
  const [refContainer, setRefContainer] = useState<HTMLDivElement>();
  const containerRect = refContainer?.getBoundingClientRect();
  const { pageRect, top, bottom } = getRect(pdfNotes, containerRect);

  const scale =
    !pdfNotes || !pageRect
      ? 100
      : (pdfNotes.settings.fontSize * pageRect.width) / 500;

  return (
    <MouseContext.Provider
      value={{ mouse, setMouse, pageRect, scale, top, bottom }}
    >
      <Box ref={setRefContainer}>{children}</Box>
    </MouseContext.Provider>
  );
};

/**
 * ページのサイズと位置を返す
 */
function getRect(
  pdfNotes?: PdfNotes,
  containerRect?: DOMRect
): { pageRect?: DOMRect; top?: number; bottom?: number } {
  const pdfRatio = pdfNotes?.pages[pdfNotes.currentPage]?.sizeRatio;
  if (!pdfNotes || !pdfRatio || !containerRect) return {};
  return preferredSize(
    pdfNotes.settings.offsetTop,
    pdfNotes.settings.offsetBottom,
    pdfRatio,
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
    pdfRatio: number, // width / height
    viewW: number,
    viewH: number,
    viewX: number
  ) {
    const H = viewH / (1 - offsetTop - offsetBottom);
    const W = pdfRatio * H;
    const ratio = Math.min(1, viewW / W); // 画像が横にはみ出しそうな場合にこの係数をかけて収める
    const top = H * offsetTop;
    const bottom = H * offsetBottom;
    const tbRatio =
      ratio * H < viewH
        ? 0 // ページ内に収まる場合は中央に配置する
        : 1 - ((1 - ratio) * H) / (top + bottom); // ratio==1の時に 1, ratio*H==viewH(==H-top-bottom) の時（ページサイズ＝画像サイズ）に 0 になる
    const x = viewX + (viewW - ratio * W) / 2;
    return {
      pageRect: new DOMRect(x, -tbRatio * top, ratio * W, ratio * H),
      top: -tbRatio * top,
      bottom: -tbRatio * bottom,
    };
  }
}
