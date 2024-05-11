import { useRef } from "react";
import { TextField } from "@mui/material";
import { PageLink, fromDisplayedPage } from "@/types/PdfNotes";
import usePdfNotes from "@/hooks/usePdfNotes";
import EditorBase from "./EditorBase";

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
  const { pdfNotes, updateNote } = usePdfNotes();
  const pageNum =
    pdfNotes?.pages[params.page]?.num ??
    pdfNotes?.pages[pdfNotes.currentPage]?.num ??
    1;
  const num = useRef<number>(pageNum);
  if (!pdfNotes) return <></>;

  // 閉じたときに値を更新する
  const handleClose = (cancel?: boolean) => {
    onClose();
    if (cancel) return;
    if (pageNum === num.current) return;
    updateNote(params, {
      ...params,
      page: fromDisplayedPage(pdfNotes, num.current),
    });
  };

  return (
    <EditorBase onClose={handleClose}>
      ページ番号:
      <TextField
        variant="standard"
        defaultValue={pageNum}
        type="number"
        sx={{ pl: 1, width: 80 }}
        inputRef={(ref?: HTMLInputElement) => {
          setTimeout(() => {
            ref?.focus();
          }, 10);
        }}
        onFocus={(e) => {
          e.target.select();
        }}
        onChange={(e) => {
          num.current = Number(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleClose();
            e.stopPropagation();
          }
          if (e.key === "Escape") {
            handleClose(true);
            e.stopPropagation();
          }
        }}
      />
    </EditorBase>
  );
}
