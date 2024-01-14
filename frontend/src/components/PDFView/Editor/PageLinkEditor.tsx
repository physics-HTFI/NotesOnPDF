import { FC, useRef } from "react";
import { TextField } from "@mui/material";
import { PageLink, fromDisplayedPage } from "@/types/PdfInfo";
import { usePdfInfo } from "@/hooks/usePdfInfo";
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
  const { pdfInfo, updateNote } = usePdfInfo();
  const pageNum =
    pdfInfo?.pages[params.page]?.num ??
    pdfInfo?.pages[pdfInfo.currentPage]?.num ??
    1;
  const num = useRef<number>(pageNum);
  if (!pdfInfo) return <></>;

  // 閉じたときに値を更新する
  const handleClose = () => {
    onClose();
    if (pageNum === num.current) return;
    updateNote(params, {
      ...params,
      page: fromDisplayedPage(pdfInfo, num.current),
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
