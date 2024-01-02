import { FC, useState } from "react";
import { TextField, Tooltip } from "@mui/material";
import { Note } from "@/types/Notes";
import { useNotes } from "@/hooks/useNotes";
import EditorBase from "./EditorBase";
import { Help } from "@mui/icons-material";

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
const NoteEditor: FC<Props> = ({ params, onClose }) => {
  const { update } = useNotes();
  const [text, setText] = useState(params.html);

  // 閉じたときに値を更新する
  const handleClose = () => {
    onClose();
    const html = text.trim();
    if (text === "" || text === params.html) return;
    update(params, { ...params, html });
  };

  return (
    <EditorBase onClose={handleClose}>
      <TextField
        value={text}
        multiline
        rows={10}
        inputProps={{
          spellCheck: "false",
          sx: { whiteSpace: "nowrap", fontSize: "90%", width: 350 },
        }}
        inputRef={(ref?: HTMLInputElement) => {
          ref?.focus();
        }}
        onChange={(e) => {
          setText(e.target.value);
        }}
      />
      <Tooltip
        enterDelay={0}
        title={
          <span>
            ・インライン数式 <code style={{ fontSize: "120%" }}>$e=mc^2$</code>
            <br />
            ・別行立て数式 <code style={{ fontSize: "120%" }}>$$e=mc^2$$</code>
            {/*
            <br />
            ・HTMLタグも使用できます{" "}
            <code style={{ fontSize: "120%" }}>{"<h1>タイトル</h1>"}</code>
            */}
          </span>
        }
      >
        <Help
          sx={{
            position: "absolute",
            right: 0,
            bottom: -25,
            fontSize: "130%",
            color: "white",
          }}
        />
      </Tooltip>
    </EditorBase>
  );
};

export default NoteEditor;
