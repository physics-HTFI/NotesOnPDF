import { useContext, useRef, useState } from "react";
import PdfNotesContext from "@/contexts/PdfNotesContext";
import ModelContext from "@/contexts/ModelContext";
import MouseContext from "@/contexts/MouseContext";
import PageLabelLarge from "./PageLabelLarge";

/**
 * PDF画像を表示するコンポーネント
 */
export default function PdfImage({ pageLabel }: { pageLabel?: string }) {
  const { model } = useContext(ModelContext);
  const { pageRect } = useContext(MouseContext);
  const { id, pdfNotes } = useContext(PdfNotesContext);
  const [src, setSrc] = useState("");
  const [reading, setReading] = useState(false);
  const nextSrc = useRef("");

  if (!id || !pdfNotes || !pageRect) {
    return <></>;
  }

  const width = Math.round(pageRect.width);
  const height = Math.round(pageRect.height);
  nextSrc.current = model.getPageImageUrl(
    id,
    pdfNotes.currentPage,
    width,
    height
  );
  // 現在の読み込みが終了してから次の読み込みを行う
  if (!reading && nextSrc.current !== src) {
    setSrc(nextSrc.current);
    if (nextSrc.current.split("?")[0] != src.split("?")[0]) {
      setReading(true);
    }
  }

  const handleEndRead = () => {
    setReading(false);
  };

  return (
    <>
      <img
        src={src}
        style={{ width, height }}
        onLoad={handleEndRead}
        onError={handleEndRead}
      />
      <PageLabelLarge label={pageLabel} shown={reading} />
    </>
  );
}
