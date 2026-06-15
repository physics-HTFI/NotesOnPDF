import { useCallback, useState } from "react";
import { TextField } from "@mui/material";
import { fromDisplayedPage } from "@/types/PdfNotes";
import EditorBase from "./EditorBase";
import { modelPdfNotes } from "@/models/modelPdfNotes/modelPdfNotes";

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
  const pages = modelPdfNotes.pdfNotes.usePages();
  const currentPage = modelPdfNotes.pdfNotes.useCurrentPage();
  const pageCandidate1 =
    pageNumInit === undefined ? undefined : pages[pageNumInit]?.num;
  const pageCandidate2 =
    currentPage === undefined ? undefined : pages[currentPage]?.num;
  const displayedPageNumInit = pageCandidate1 ?? pageCandidate2 ?? 1;
  const [displayedPageNum, setDisplayedPageNum] = useState<number | "">(
    displayedPageNumInit,
  );

  const handleRef = useCallback((ref?: HTMLInputElement) => {
    setTimeout(() => {
      ref?.focus();
    }, 10);
  }, []);

  if (!open || currentPage === undefined) return null;

  // 閉じたときに値を更新する
  const handleClose = (cancel?: boolean) => {
    const newPage =
      cancel === true ||
      displayedPageNumInit === displayedPageNum ||
      displayedPageNum === ""
        ? undefined
        : fromDisplayedPage(displayedPageNum, pages, currentPage);
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
        inputRef={handleRef}
        onFocus={(e) => {
          e.target.select();
        }}
        onChange={(e) => {
          if (e.target.value === "") {
            setDisplayedPageNum("");
            return;
          }
          const num = Number(e.target.value);
          const numMin = pages.reduce((a, b) => (a.num < b.num ? a : b)).num;
          const numMax = pages.reduce((a, b) => (a.num < b.num ? b : a)).num;
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
