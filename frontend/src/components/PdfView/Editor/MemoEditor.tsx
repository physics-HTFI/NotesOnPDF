import { useContext, useState } from "react";
import {
  FormControlLabel,
  Switch,
  TextareaAutosize,
  Tooltip,
  TooltipProps,
  Typography,
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
  const [fold, setFold] = useState(params.style === "fold");
  const [init, setInit] = useState(false);

  // 閉じたときに値を更新する
  const handleClose = (cancel?: boolean) => {
    onClose();
    if (cancel) return;
    const html = text.trim();
    const style = fold ? "fold" : "normal";
    if (text === "" || (text === params.html && style === params.style)) return;
    updateNote(params, { ...params, html, style });
  };

  return (
    <EditorBase onClose={handleClose}>
      <Tooltip
        title={
          <span>
            2行目以降を折り畳みます
            <br />
            マウスポインターを重ねた時に全体が表示されます
          </span>
        }
        disableInteractive
        placement="top"
      >
        <FormControlLabel
          sx={{
            position: "absolute",
            right: 11,
            top: -30,
            color: "white",
            fontSize: "1em",
          }}
          control={
            <Switch
              size="small"
              checked={fold}
              onChange={(e) => {
                setFold(e.target.checked);
              }}
              sx={{ background: "#fffd", borderRadius: "20%", ml: 0.5 }}
            />
          }
          label={<Typography variant="body2">折り畳む</Typography>}
          labelPlacement="start"
        />
      </Tooltip>
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
          if (init) return; // スイッチをトグルするたびに全選択されるのを防ぐ
          e.target.select();
          setInit(true);
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
