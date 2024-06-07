import { useContext, useState } from "react";
import { TextField } from "@mui/material";
import { fromDisplayedPage } from "@/types/PdfNotes";
import EditorBase from "./EditorBase";
import PdfNotesContext from "@/contexts/PdfNotesContext/PdfNotesContext";

/**
 * ページ番号入力ダイアログ
 */
export default function PageInput({
  pageNumInit,
  open,
  onClose,
}: {
  pageNumInit?: number;
  open: boolean;
  onClose: (newPage?: number) => void;
}) {
  const { pdfNotes } = useContext(PdfNotesContext);
  const displayedPageNumInit =
    pdfNotes?.pages[pageNumInit ?? pdfNotes.currentPage]?.num ??
    pdfNotes?.pages[pdfNotes.currentPage]?.num ??
    1;
  const [displayedPageNum, setDisplayedPageNum] =
    useState(displayedPageNumInit);
  if (!pdfNotes || !open) return <></>;

  // 閉じたときに値を更新する
  const handleClose = (cancel?: boolean) => {
    const newPage =
      cancel === true || displayedPageNumInit === displayedPageNum
        ? undefined
        : fromDisplayedPage(pdfNotes, displayedPageNum);
    onClose(newPage);
  };

  return (
    <EditorBase onClose={handleClose}>
      ページ番号:
      <TextField
        variant="standard"
        value={String(displayedPageNum)}
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
          setDisplayedPageNum(num);
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
