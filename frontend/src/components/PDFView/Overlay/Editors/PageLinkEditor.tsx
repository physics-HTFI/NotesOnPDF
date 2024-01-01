import React, { useContext, useRef } from "react";
import { TextField } from "@mui/material";
import { PageLink, fromDisplayedPage, toDisplayedPage } from "@/types/Notes";
import { MouseContext } from "@/contexts/MouseContext";
import { useNotes } from "@/hooks/useNotes";
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
const PageLinkEditor: React.FC<Props> = ({ params, onClose }) => {
  const { notes, setNotes, update } = useNotes();
  const { mouse, pageRect } = useContext(MouseContext);
  const pageNum =
    toDisplayedPage(notes, params.page).pageNum ??
    toDisplayedPage(notes).pageNum ??
    1;
  const num = useRef<number>(pageNum);
  const page = notes?.pages[notes.currentPage];

  // 閉じたときに値を更新する
  const handleClose = () => {
    onClose();
    if (!notes) return;
    if (pageNum === num.current) return;
    update(params, {
      ...params,
      page: fromDisplayedPage(notes, num.current),
    });
  };

  if (!notes || !setNotes || !page || !mouse || !pageRect) return <></>;
  return (
    <EditorBase onClose={handleClose}>
      <TextField
        variant="standard"
        defaultValue={pageNum}
        type="number"
        sx={{ p: 1, width: 80 }}
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
