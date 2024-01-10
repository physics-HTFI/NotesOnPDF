import { FC, useContext, useRef } from "react";
import { TextField } from "@mui/material";
import { PageLink, fromDisplayedPage, toDisplayedPage } from "@/types/PdfInfo";
import { MouseContext } from "@/contexts/MouseContext";
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
  const { pdfinfo, setPdfInfo, updateNote } = usePdfInfo();
  const { mouse, pageRect } = useContext(MouseContext);
  const pageNum =
    toDisplayedPage(pdfinfo, params.page).pageNum ??
    toDisplayedPage(pdfinfo).pageNum ??
    1;
  const num = useRef<number>(pageNum);
  const page = pdfinfo?.pages[pdfinfo.currentPage];

  // 閉じたときに値を更新する
  const handleClose = () => {
    onClose();
    if (!pdfinfo) return;
    if (pageNum === num.current) return;
    updateNote(params, {
      ...params,
      page: fromDisplayedPage(pdfinfo, num.current),
    });
  };

  if (!pdfinfo || !setPdfInfo || !page || !mouse || !pageRect) return <></>;
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
