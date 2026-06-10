import { type PageLink } from "@/types/PdfNotes";
import PageInput from "./PageInput";
import { useAtomValue, useSetAtom } from "jotai";
import { modelPdfNotes } from "@/models/modelPdfNotes";

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
  const pdfNotes = useAtomValue(modelPdfNotes.pdfNotes.atom);
  const updateNote = useSetAtom(modelPdfNotes.update.atomUpdateNote);
  if (!pdfNotes) return <></>;

  // 閉じたときに値を更新する
  const handleClose = (page?: number) => {
    onClose();
    if (page === undefined) return;
    updateNote(params, { ...params, page });
  };

  return <PageInput open pageNumInit={params.page} onClose={handleClose} />;
}
