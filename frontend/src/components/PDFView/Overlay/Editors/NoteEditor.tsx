import React, { useState } from "react";
import { TextField } from "@mui/material";
import { Note } from "@/types/Notes";
import { useNotes } from "@/hooks/useNotes";
import EditorBase from "./EditorBase";

/**
 * `NoteEditor`の引数
 */
interface Props {
  params: Note;
  onClose: () => void;
}

/**
 * 注釈コメントの編集ダイアログ
 */
const NoteEditor: React.FC<Props> = ({ params, onClose }) => {
  const { update } = useNotes();
  const [text, setText] = useState(params.html.replace(/<br\/>/g, "\n"));

  // TODO 使用されているテキストのリストを表示する

  // 閉じたときに値を更新する
  const handleClose = () => {
    onClose();
    const html = text.trim().replace(/\n/g, "<br/>");
    if (text === "" || text === params.html) return;
    update(params, { ...params, html });
  };

  return (
    <EditorBase width={350} height={280} onClose={handleClose}>
      <TextField
        value={text}
        multiline
        rows={10}
        inputProps={{
          spellCheck: "false",
          sx: { whiteSpace: "nowrap", fontSize: "90%" },
        }}
        sx={{ p: 1, width: "100%" }}
        inputRef={(ref?: HTMLInputElement) => {
          ref?.focus();
        }}
        onChange={(e) => {
          setText(e.target.value);
        }}
      />
    </EditorBase>
  );
};

export default NoteEditor;
