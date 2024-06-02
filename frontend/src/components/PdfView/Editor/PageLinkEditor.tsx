import { useContext, useState } from "react";
import { TextField } from "@mui/material";
import { PageLink, fromDisplayedPage } from "@/types/PdfNotes";
import EditorBase from "./EditorBase";
import PdfNotesContext from "@/contexts/PdfNotesContext/PdfNotesContext";

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
  const pageNumInit =
    pdfNotes?.pages[params.page]?.num ??
    pdfNotes?.pages[pdfNotes.currentPage]?.num ??
    1;
  const [pageNum, setPageNum] = useState(pageNumInit);
  if (!pdfNotes) return <></>;

  // 閉じたときに値を更新する
  const handleClose = (cancel?: boolean) => {
    onClose();
    if (cancel) return;
    if (pageNumInit === pageNum) return;
    updateNote(params, {
      ...params,
      page: fromDisplayedPage(pdfNotes, pageNum),
    });
  };

  return (
    <EditorBase onClose={handleClose}>
      ページ番号:
      <TextField
        variant="standard"
        value={String(pageNum)}
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
          const num = Number(e.target.value);
          const numMin = pdfNotes.pages.reduce((a, b) =>
            a.num < b.num ? a : b
          ).num;
          const numMax = pdfNotes.pages.reduce((a, b) =>
            a.num < b.num ? b : a
          ).num;
          if (num < numMin || numMax < num) return;
          setPageNum(num);
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
