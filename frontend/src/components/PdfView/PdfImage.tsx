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

  nextSrc.current = model.getPageImageUrl(
    id,
    pdfNotes.currentPage,
    pageRect.width
  );
  // 現在の読み込みが終了してから次の読み込みを行う
  if (!reading && nextSrc.current !== src) {
    setReading(true);
    setSrc(nextSrc.current);
  }

  const handleEndRead = () => {
    setReading(false);
  };

  return (
    <>
      <img
        src={src}
        style={{
          objectFit: "none",
          width: Math.floor(pageRect.width),
          height: Math.floor(pageRect.height),
        }}
        onLoad={handleEndRead}
        onError={handleEndRead}
      />
      <PageLabelLarge label={pageLabel} shown={reading} />
    </>
  );
}
