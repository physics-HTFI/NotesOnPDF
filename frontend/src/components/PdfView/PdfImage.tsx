import { useContext } from "react";
import PdfNotesContext from "@/contexts/PdfNotesContext";
import ModelContext from "@/contexts/ModelContext";
import MouseContext from "@/contexts/MouseContext";

/**
 * PDF画像を表示するコンポーネント
 */
export default function PdfImage({ onEndRead }: { onEndRead: () => void }) {
  const { model } = useContext(ModelContext);
  const { pageRect } = useContext(MouseContext);
  const { id, pdfNotes } = useContext(PdfNotesContext);

  if (!id || !pdfNotes || !pageRect) {
    return <></>;
  }

  return (
    <img
      src={model.getPageImageUrl(id, pdfNotes.currentPage, pageRect.width)}
      style={{ width: "100%", height: "100%" }}
      onLoad={onEndRead}
      onError={onEndRead}
    />
  );
}
