import { FC, useContext, useRef } from "react";
import { PdfNotesContext } from "@/contexts/PdfNotesContext";
import { ModelContext } from "@/contexts/ModelContext";

interface Prev {
  id: string;
  page: number;
  width: number;
}

/**
 * `PdfImage`の引数
 */
interface Props {
  width?: number;
  onStartRead: () => void;
  onEndRead: () => void;
}

/**
 * PDF画像を表示するコンポーネント
 */
const PdfImage: FC<Props> = ({ width, onStartRead, onEndRead }) => {
  const { model } = useContext(ModelContext);
  const { id, pdfNotes } = useContext(PdfNotesContext);
  const prev = useRef<Prev>();

  if (!id || !pdfNotes || !width) {
    return <></>;
  }

  if (
    !prev.current ||
    prev.current.id !== id ||
    prev.current.page !== pdfNotes.currentPage ||
    prev.current.width !== width
  ) {
    onStartRead();
    prev.current = { id, page: pdfNotes.currentPage, width };
  }

  return (
    <img
      src={model.getPageImageUrl(id, pdfNotes.currentPage, width)}
      style={{ width: "100%", height: "100%" }}
      onLoad={onEndRead}
      onError={onEndRead}
    />
  );
};

export default PdfImage;
