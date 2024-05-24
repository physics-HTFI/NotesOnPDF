import { useContext, useRef, useState } from "react";
import { Chip, IconButton, Stack, TextField, Tooltip } from "@mui/material";
import { Reply } from "@mui/icons-material";
import usePdfNotes from "@/hooks/usePdfNotes";
import PdfNotesContext from "@/contexts/PdfNotesContext";
import EditorBase from "./Editor/EditorBase";
import MouseContext from "@/contexts/MouseContext";
import PdfNotes from "@/types/PdfNotes";
import Progress from "../OpenFileDrawer/FileTreeView/Progress";
import FileTreeContext from "@/contexts/FileTreeContext";

const getPageNums = (pdfNotes: PdfNotes) => {
  const pageNums = { curTotal: 0, total: 0, curChapter: 0, chapter: 0 };
  let found = false;
  for (let i = 0; i < pdfNotes.pages.length; i++) {
    const p = pdfNotes.pages[i];
    if (!p) continue;
    const before = i <= pdfNotes.currentPage;
    const isChapterStart =
      p.volume !== undefined || p.part !== undefined || p.chapter !== undefined;
    if (isChapterStart) {
      found = !before;
      if (!found) {
        pageNums.curChapter = 0;
        pageNums.chapter = 0;
      }
    }
    if (p.style && p.style.includes("excluded")) continue;
    ++pageNums.total;
    if (before) ++pageNums.curTotal;
    if (!found) {
      ++pageNums.chapter;
      if (before) ++pageNums.curChapter;
    }
  }
  return pageNums;
};

/**
 * 画面隅のページ数表示コンポーネント
 */
export default function PageLabelSmall({ hidden }: { hidden: boolean }) {
  const { previousPageNum, id } = useContext(PdfNotesContext);
  const { coverages } = useContext(FileTreeContext);
  const { jumpPage, page, pageLabel, pdfNotes } = usePdfNotes();
  const [openJumpDialog, setOpenJumpDialog] = useState(false);
  const { setMouse } = useContext(MouseContext);
  if (!pdfNotes || !id) return <></>;

  const { curTotal, total, curChapter, chapter } = getPageNums(pdfNotes);

  return (
    <Stack
      direction="row"
      sx={{
        position: "absolute",
        left: 7,
        bottom: 0,
        fontSize: "75%",
        cursor: "default",
        visibility: hidden ? "collapse" : undefined,
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
      }}
    >
      <Stack direction="column">
        {/* 進捗 */}
        <Tooltip
          title={<Progress coverage={coverages?.pdfs[id]} />}
          disableInteractive
        >
          <progress
            max="100"
            value={coverages?.pdfs[id]?.percent ?? 0}
            style={{
              width: "calc(100% - 4px)",
              margin: "0 2px 5px",
              height: "14px",
              accentColor: "#2e7d32",
            }}
          />
        </Tooltip>
        {/* ページラベル */}
        <Tooltip
          disableInteractive
          title={
            <span>
              【現在地】
              <br />
              {`全体： ${curTotal} / ${total}`} <br />
              {`チャプター内： ${curChapter} / ${chapter}`} <br />
              <br />
              クリックすると指定したページにジャンプできます <br />
            </span>
          }
        >
          <Chip
            variant="outlined"
            color="success"
            label={pageLabel}
            size="small"
            sx={{ cursor: "pointer", mb: 0.5 }}
            onMouseDown={(e) => {
              setOpenJumpDialog(true);
              setMouse({ pageX: e.pageX, pageY: e.pageY });
            }}
          />
        </Tooltip>
      </Stack>
      {page && openJumpDialog && (
        <JumpDialog
          page={page.num}
          onClose={(page) => {
            setOpenJumpDialog(false);
            if (page === undefined) return;
            jumpPage(page, true);
          }}
        />
      )}

      {/* 直前に表示していたページに移動 */}
      <Tooltip
        title={
          <span>
            直前に表示していたページに移動します [Space] <br />
            <br />
            その他の移動操作
            <br />
            ・ページ移動： ←→ or マウスホイール <br />
            ・節移動： Shift + (←→ or マウスホイール) <br />
            ・章移動： ↑↓ or Ctrl + マウスホイール
          </span>
        }
        placement="right"
        disableInteractive
      >
        <span style={{ marginLeft: 2, alignContent: "end" }}>
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
    </Stack>
  );
}

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
        onFocus={(e) => {
          e.target.select();
        }}
        onChange={(e) => {
          num.current = Number(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onClose(num.current);
            e.stopPropagation();
          }
          if (e.key === "Escape") {
            onClose(undefined);
            e.stopPropagation();
          }
        }}
      />
    </EditorBase>
  );
}
