import { useContext, useRef, useState } from "react";
import PdfNotesContext from "@/contexts/PdfNotesContext";
import MouseContext from "@/contexts/MouseContext";
import PageLabelLarge from "./PageLabelLarge";
import ModelContext from "@/contexts/ModelContext";
import UiStateContext from "@/contexts/UiStateContext";
import usePdfNotes from "@/hooks/usePdfNotes";

/**
 * PDF画像を表示するコンポーネント
 */
export default function PdfImageDesktop() {
  const { model } = useContext(ModelContext);
  const { setErrorMessage } = useContext(UiStateContext);
  const { pageRect } = useContext(MouseContext);
  const { id, pdfNotes } = useContext(PdfNotesContext);
  const { pageLabel } = usePdfNotes();
  const [src, setSrc] = useState("");
  const [reading, setReading] = useState(false);
  const nextSrc = useRef("");

  if (!id || !pdfNotes || !pageRect) {
    return <></>;
  }

  const width = Math.round(pageRect.width);
  const height = Math.round(pageRect.height);
  try {
    nextSrc.current = model.getPageImageUrl(
      id,
      pdfNotes.currentPage,
      width,
      height
    );
  } catch {
    setErrorMessage(model.getMessage("ページ画像の取得"));
  }
  // 現在の読み込みが終了してから次の読み込みを行う
  if (!reading && nextSrc.current !== src) {
    setSrc(nextSrc.current);
    if (nextSrc.current.split("?")[0] != src.split("?")[0]) {
      setReading(true);
    }
  }

  return (
    <>
      <img
        src={src}
        style={{ width, height }}
        onLoad={() => {
          setReading(false);
        }}
        onError={() => {
          setReading(false);
          setErrorMessage(model.getMessage("ページ画像の取得"));
        }}
      />
      <PageLabelLarge label={pageLabel} shown={reading} />
    </>
  );
}
