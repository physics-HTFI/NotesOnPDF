import { useContext } from "react";
import { PageLink } from "@/types/PdfNotes";
import PdfNotesContext from "@/contexts/PdfNotesContext/PdfNotesContext";
import PageInput from "./PageInput";

/**
 * ページリンクの編集ダイアログ
 */
export default function PageLinkEditor({
  params,
  onClose,
}: {
  params: PageLink;
  onClose: () => void;
}) {
  const {
    pdfNotes,
    updaters: { updateNote },
  } = useContext(PdfNotesContext);
  if (!pdfNotes) return <></>;

  // 閉じたときに値を更新する
  const handleClose = (page?: number) => {
    onClose();
    if (page === undefined) return;
    updateNote(params, { ...params, page });
  };

  return <PageInput open pageNumInit={params.page} onClose={handleClose} />;
}
