import { useContext, useState } from "react";
import {
  TextareaAutosize,
  Tooltip,
  TooltipProps,
  styled,
  tooltipClasses,
} from "@mui/material";
import { Memo } from "@/types/PdfNotes";
import EditorBase from "./EditorBase";
import { Help } from "@mui/icons-material";
import { blue, grey } from "@mui/material/colors";
import PdfNotesContext from "@/contexts/PdfNotesContext/PdfNotesContext";

// https://mui.com/base-ui/react-textarea-autosize/
const Textarea = styled(TextareaAutosize)(
  () => `
  field-sizing: content;
  min-width: 100px;
  max-width: 50vw;
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.9rem;
  padding: 8px 12px;
  color: ${grey[900]};
  background: ${"#fff"};
  border: 1px solid ${grey[200]};
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
 * 注釈メモの編集ダイアログ
 */
export default function MemoEditor({
  params,
  onClose,
}: {
  params: Memo;
  onClose: () => void;
}) {
  const {
    updaters: { updateNote },
  } = useContext(PdfNotesContext);
  const [text, setText] = useState(params.html);

  // 閉じたときに値を更新する
  const handleClose = (cancel?: boolean) => {
    onClose();
    if (cancel) return;
    const html = text.trim();
    if (text === "" || text === params.html) return;
    updateNote(params, { ...params, html });
  };

  return (
    <EditorBase onClose={handleClose}>
      <Textarea
        value={text}
        spellCheck={false}
        onChange={(e) => {
          setText(e.target.value);
        }}
        ref={(ref: HTMLElement | null) => {
          setTimeout(() => {
            ref?.focus();
          }, 10);
        }}
        onFocus={(e) => {
          e.target.select();
        }}
        onKeyDown={(e) => {
          if (e.ctrlKey && e.key === "Enter") {
            handleClose();
          }
          if (e.key === "Escape") {
            handleClose(true);
          }
          e.stopPropagation();
        }}
      />
      <NoMaxWidthTooltip
        enterDelay={0}
        disableInteractive={false}
        title={
          <span>
            ・[Ctrl+Enter] 編集完了
            <br />
            ・[Escape] キャンセル
            <br />
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
}
