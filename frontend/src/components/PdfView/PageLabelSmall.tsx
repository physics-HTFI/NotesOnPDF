import { useContext, useState } from "react";
import { Chip, Stack, Tooltip } from "@mui/material";
import { Reply } from "@mui/icons-material";
import MouseContext from "@/contexts/MouseContext";
import PdfNotes from "@/types/PdfNotes";
import Progress from "../OpenFileDrawer/FileTreeView/Progress";
import { GetCoverage } from "@/types/Coverages";
import PdfNotesContext from "@/contexts/PdfNotesContext/PdfNotesContext";
import TooltipIconButton from "../common/TooltipIconButton";
import PageInput from "./Editor/PageInput";

/**
 * 画面隅のページ数表示コンポーネント
 */
export default function PageLabelSmall({ hidden }: { hidden: boolean }) {
  const {
    id,
    pdfNotes,
    previousPageNum,
    updaters: { jumpPage, pageLabel },
  } = useContext(PdfNotesContext);
  const [openJumpDialog, setOpenJumpDialog] = useState(false);
  const { setMouse } = useContext(MouseContext);
  if (!pdfNotes || !id) return <></>;
  const coverage = GetCoverage(pdfNotes);
  const color = "#2e7d32";

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
        <Tooltip title={<Progress coverage={coverage} />} disableInteractive>
          <progress
            max="100"
            value={coverage.percent}
            style={{
              width: "calc(100% - 4px)",
              margin: "0 2px 5px",
              height: "14px",
              accentColor: color,
            }}
          />
        </Tooltip>
        {/* ページラベル */}
        <Tooltip
          disableInteractive
          title={
            <span>
              【現在位置】
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
      {openJumpDialog && (
        <PageInput
          open
          pageNumInit={pdfNotes.currentPage}
          onClose={(page) => {
            setOpenJumpDialog(false);
            if (page === undefined) return;
            jumpPage(page);
          }}
        />
      )}

      {/* 直前に表示していたページに移動 */}
      <TooltipIconButton
        disabled={previousPageNum === undefined}
        icon={<Reply />}
        onMouseDown={() => {
          if (previousPageNum === undefined) return;
          jumpPage(previousPageNum);
        }}
        sx={{ ml: 0.5, alignContent: "end", color }}
        tooltipPlacement="right"
        tooltipTitle={
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
      />
    </Stack>
  );
}

/**
 * 現在ページのページ番号を取得
 */
function getPageNums(pdfNotes: PdfNotes) {
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
}
