import { FC, useRef } from "react";
import { TextField } from "@mui/material";
import { PageLink, fromDisplayedPage } from "@/types/PdfNotes";
import { usePdfNotes } from "@/hooks/usePdfNotes";
import EditorBase from "./EditorBase";

/**
 * `PageLinkEditor`の引数
 */
interface Props {
  params: PageLink;
  onClose: () => void;
}

/**
 * ページリンクの編集ダイアログ
 */
const PageLinkEditor: FC<Props> = ({ params, onClose }) => {
  const { pdfNotes, updateNote } = usePdfNotes();
  const pageNum =
    pdfNotes?.pages[params.page]?.num ??
    pdfNotes?.pages[pdfNotes.currentPage]?.num ??
    1;
  const num = useRef<number>(pageNum);
  if (!pdfNotes) return <></>;

  // 閉じたときに値を更新する
  const handleClose = () => {
    onClose();
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
          ref?.focus();
        }}
        onChange={(e) => {
          num.current = Number(e.target.value);
        }}
      />
    </EditorBase>
  );
};

export default PageLinkEditor;
