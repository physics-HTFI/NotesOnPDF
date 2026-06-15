import { type PageLink } from "@/types/PdfNotes";
import PageInput from "./PageInput";
import { modelPdfNotes } from "@/models/modelPdfNotes/modelPdfNotes";

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
  const updateNote = modelPdfNotes.update.useSetNote();

  // 閉じたときに値を更新する
  const handleClose = (page?: number) => {
    onClose();
    if (page === undefined) return;
    updateNote(params, { ...params, page });
  };

  return <PageInput open pageNumInit={params.page} onClose={handleClose} />;
}
