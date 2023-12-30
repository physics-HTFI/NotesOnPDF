import React, { useContext, useEffect, useRef } from "react";
import { TextField } from "@mui/material";
import { PageLink, fromDisplayedPage } from "@/types/Notes";
import { MouseContext } from "@/contexts/MouseContext";
import { useNotes } from "@/hooks/useNotes";
import EditorBase from "./EditorBase";

/**
 * `PageLinkEditor`の引数
 */
interface Props {
  params: PageLink;
  pageNum: number;
  onClose: () => void;
}

/**
 * ページリンクのメニュー
 */
const PageLinkEditor: React.FC<Props> = ({ params, pageNum, onClose }) => {
  const { notes, setNotes, update } = useNotes();
  const { mouse, pageRect } = useContext(MouseContext);
  const num = useRef<number>(pageNum);
  const page = notes?.pages[notes.currentPage];

  // 閉じたときに値を更新する
  useEffect(() => {
    return () => {
      if (!notes) return;
      if (pageNum === num.current) return;
      update(params, {
        ...params,
        page: fromDisplayedPage(notes, num.current),
      });
    };
  });

  if (!notes || !setNotes || !page || !mouse || !pageRect) return <></>;
  return (
    <EditorBase width={100} height={50} onClose={onClose}>
      <TextField
        variant="standard"
        defaultValue={pageNum}
        type="number"
        sx={{ p: 1 }}
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
