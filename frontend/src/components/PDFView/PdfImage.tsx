import { FC, useContext } from "react";
import { PdfNotesContext } from "@/contexts/PdfNotesContext";
import { ModelContext } from "@/contexts/ModelContext";

/**
 * `PdfImage`の引数
 */
interface Props {
  width?: number;
  onEndRead: () => void;
}

/**
 * PDF画像を表示するコンポーネント
 */
const PdfImage: FC<Props> = ({ width, onEndRead }) => {
  const { model } = useContext(ModelContext);
  const { id, pdfNotes } = useContext(PdfNotesContext);

  if (!id || !pdfNotes || !width) {
    return <></>;
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
