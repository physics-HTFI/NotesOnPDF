import { FC, useState } from "react";
import {
  TextareaAutosize,
  Tooltip,
  TooltipProps,
  styled,
  tooltipClasses,
} from "@mui/material";
import { Note } from "@/types/PdfInfo";
import { usePdfInfo } from "@/hooks/usePdfInfo";
import EditorBase from "./EditorBase";
import { Help } from "@mui/icons-material";
import { blue, grey } from "@mui/material/colors";

// https://mui.com/base-ui/react-textarea-autosize/
const Textarea = styled(TextareaAutosize)(
  () => `
  width: 500px;
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.9rem;
  padding: 8px 12px;
  color: ${grey[900]};
  background: ${"#fff"};
  border: 1px solid ${grey[200]};
  white-space: nowrap;
  &:hover {
    border-color: ${blue[400]};
  }
  // firefox
  &:focus-visible {
    outline: 0;
  }
`
);

const NoMaxWidthTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: "none",
  },
});

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
  const { updateNote } = usePdfInfo();
  const [text, setText] = useState(params.html);

  // 閉じたときに値を更新する
  const handleClose = () => {
    onClose();
    const html = text.trim();
    if (text === "" || text === params.html) return;
    updateNote(params, { ...params, html });
  };

  return (
    <EditorBase onClose={handleClose}>
      <Textarea
        minRows={10}
        value={text}
        spellCheck={false}
        onChange={(e) => {
          setText(e.target.value);
        }}
        ref={(ref: HTMLElement | null) => {
          ref?.focus();
        }}
      />
      <NoMaxWidthTooltip
        enterDelay={0}
        disableInteractive={false}
        title={
          <span>
            ・インライン数式:
            <code style={{ fontSize: "120%", paddingLeft: 4 }}>$e=mc^2$</code>
            <br />
            ・別行立て数式:
            <code style={{ fontSize: "120%", paddingLeft: 4 }}>$$e=mc^2$$</code>
            <br />
            ・amsmath:
            <code style={{ fontSize: "120%", paddingLeft: 4 }}>
              {"\\begin{align} e=mc^2 \\end{align}"}
            </code>
            <br />
            ・HTMLタグ:
            <code style={{ fontSize: "120%", paddingLeft: 4 }}>
              {'<span style="font-size: 150%;">テキスト</span>'}
            </code>
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
      </NoMaxWidthTooltip>
    </EditorBase>
  );
};

export default NoteEditor;
