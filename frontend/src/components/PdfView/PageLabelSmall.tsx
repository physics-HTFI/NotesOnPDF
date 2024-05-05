import { FC, useContext, useRef, useState } from "react";
import { Box, Chip, IconButton, TextField, Tooltip } from "@mui/material";
import { Reply } from "@mui/icons-material";
import usePdfNotes from "@/hooks/usePdfNotes";
import { PdfNotesContext } from "@/contexts/PdfNotesContext";
import EditorBase from "./Editor/EditorBase";
import { MouseContext } from "@/contexts/MouseContext";

/**
 * `PageLabelSmall`の引数
 */
interface Props {
  label?: string;
  hidden: boolean;
}

/**
 * 画面隅のページ数表示コンポーネント
 */
const PageLabelSmall: FC<Props> = ({ label, hidden }) => {
  const { pdfNotes, previousPageNum } = useContext(PdfNotesContext);
  const [openJumpDialog, setOpenJumpDialog] = useState(false);
  const { setMouse } = useContext(MouseContext);
  const { jumpPage } = usePdfNotes();
  return (
    <Box
      sx={{
        position: "absolute",
        left: 3,
        bottom: 2,
        fontSize: "75%",
        cursor: "default",
        visibility: hidden ? "collapse" : undefined,
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
      }}
    >
      {/* ページラベル */}
      <Tooltip
        title={
          <span>
            クリックすると指定したページにジャンプできます
            <br />
            <br />
            その他ページ移動操作:
            <br />
            ・ページ移動: ←→ or マウスホイール
            <br />
            ・節移動: Shift + (←→ or マウスホイール)
            <br />
            ・章移動: ↑↓ or Ctrl + マウスホイール
          </span>
        }
      >
        <Chip
          variant="outlined"
          color="success"
          label={label}
          size="small"
          sx={{ cursor: "pointer" }}
          onMouseDown={(e) => {
            setOpenJumpDialog(true);
            setMouse({ pageX: e.pageX, pageY: e.pageY });
          }}
        />
      </Tooltip>
      {pdfNotes && openJumpDialog && (
        <JumpDialog
          page={pdfNotes.currentPage}
          onClose={(page) => {
            setOpenJumpDialog(false);
            if (page === undefined) return;
            jumpPage(page, true);
          }}
        />
      )}
      {/* 直前に表示していたページに移動 */}
      <Tooltip title="直前に表示していたページに移動します [Space]">
        <span>
          <IconButton
            disabled={previousPageNum === undefined}
            color="success"
            size="small"
            onMouseDown={() => {
              if (previousPageNum === undefined) return;
              jumpPage(previousPageNum);
            }}
          >
            <Reply />
          </IconButton>
        </span>
      </Tooltip>
    </Box>
  );
};

export default PageLabelSmall;

/**
 * ページリンクの編集ダイアログ
 */
function JumpDialog({
  page,
  onClose,
}: {
  page: number;
  onClose: (page?: number) => void;
}) {
  const num = useRef<number>(page);
  return (
    <EditorBase
      onClose={() => {
        onClose(num.current);
      }}
    >
      ページ番号:
      <TextField
        variant="standard"
        defaultValue={page}
        type="number"
        sx={{ pl: 1, width: 80 }}
        inputRef={(ref?: HTMLInputElement) => {
          setTimeout(() => {
            ref?.focus();
          }, 10);
        }}
        onChange={(e) => {
          num.current = Number(e.target.value);
        }}
      />
    </EditorBase>
  );
}
