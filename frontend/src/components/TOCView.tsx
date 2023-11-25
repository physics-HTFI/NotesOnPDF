import React, { useState } from "react";
import { Box, Drawer } from "@mui/material";
import Control from "./TOCView/Control";
import Settings from "./TOCView/Settings";
import { Notes } from "../types/Notes";
import getTOCData from "./TOCView/getTOCData";

/**
 * `TOCView`の引数
 */
interface Props {
  pdfPath?: string;
  notes?: Notes;
  onChanged: (notes: Notes) => void;
  onOpenFileTree: () => void;
}

/**
 * 目次を表示するコンポーネント
 */
const TOCView: React.FC<Props> = ({
  pdfPath,
  notes,
  onChanged,
  onOpenFileTree,
}) => {
  const [open, setOpen] = useState(false);

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
      sx={{
        width: 300,
        background: "whitesmoke",
        minWidth: 300,
        position: "relative",
        height: "100vh",
        overflowWrap: "break-word",
        overflow: "hidden",
        fontSize: "70%",
      }}
    >
      <Control
        onOpenFileTree={onOpenFileTree}
        onOpenSettings={() => {
          setOpen(!open);
        }}
      />
      <Box sx={{ p: 0.5 }}>{getTOCData(notes)}</Box>

      <Drawer
        variant="persistent"
        anchor="bottom"
        open={open}
        PaperProps={{
          square: false,
          sx: {
            position: "absolute",
            borderRadius: "10px 10px 0 0",
          },
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
      </Drawer>
    </Box>
  );
};

export default TOCView;
