import React, { useState } from "react";
import { Box, Drawer, IconButton } from "@mui/material";
import { Notes } from "@/types/Notes";
import Control from "./TOCView/Control";
import Settings from "./TOCView/Settings";
import getTOCData from "./TOCView/getTOCData";
import { ExpandMore } from "@mui/icons-material";

/**
 * `TOCView`の引数
 */
interface Props {
  pdfPath?: string;
  notes?: Notes;
  onChanged: (notes: Notes) => void;
  onOpenFileTree: () => void;
  onPageChange: (pageNum: number) => void;
}

/**
 * 目次を表示するコンポーネント
 */
const TOCView: React.FC<Props> = ({
  pdfPath,
  notes,
  onChanged,
  onOpenFileTree,
  onPageChange,
}) => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [showControl, setShowControl] = useState(false);

  let partNum = 1;
  let chapterNum = 1;
  let pageNum = 1;
  for (let i = 0; i < (notes?.currentPage ?? 0); i++) {
    ++pageNum;
    const page = notes?.pages[i];
    if (!page) continue;
    if (page.part !== undefined) ++partNum;
    if (page.chapter !== undefined) ++chapterNum;
    if (page.pageNumberRestart) {
      pageNum = 1 + page.pageNumberRestart;
    }
  }

  return (
    <Box
      onMouseEnter={() => {
        setShowControl(true);
      }}
      onMouseLeave={() => {
        setShowControl(false);
      }}
      onWheel={(e) => {
        if (!notes) return;
        onPageChange(notes.currentPage + (e.deltaY < 0 ? -1 : 1));
      }}
      sx={{
        background: "whitesmoke",
        position: "relative",
        height: "100vh",
        overflowWrap: "break-word",
        overflow: "hidden",
        fontSize: "70%",
      }}
    >
      <Control
        shown={showControl}
        onOpenFileTree={onOpenFileTree}
        onOpenSettings={() => {
          setOpenDrawer(!openDrawer);
        }}
      />
      <Box sx={{ p: 0.5, pt: 1 }}>{getTOCData(notes, onChanged)}</Box>

      <Drawer
        variant="persistent"
        anchor="bottom"
        open={openDrawer}
        PaperProps={{
          square: false,
          sx: {
            position: "absolute",
            borderRadius: "10px 10px 0 0",
            overflow: "visible",
          },
        }}
        onWheel={(e) => {
          e.stopPropagation();
        }}
      >
        <Settings
          page={notes?.pages[notes.currentPage] ?? {}}
          preferredBook={pdfPath?.match(/[^\\/]+(?=\.[^.]+$)/)?.[0] ?? ""}
          preferredPart={`第${partNum}部`}
          preferredChapter={`第${chapterNum}章`}
          preferredPageNumber={pageNum}
          onChange={(page) => {
            if (!notes) return;
            notes.pages[notes.currentPage] = {
              ...notes.pages[notes.currentPage],
              ...page,
            };
            onChanged(notes);
          }}
        />
        <IconButton
          sx={{
            position: "absolute",
            right: 0,
            top: "-35px",
          }}
          onClick={() => {
            setOpenDrawer(!openDrawer);
          }}
          size="small"
        >
          <ExpandMore />
        </IconButton>
      </Drawer>
    </Box>
  );
};

export default TOCView;
