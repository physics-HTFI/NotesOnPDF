import React from "react";
import { Box, Drawer } from "@mui/material";
import { Notes } from "@/types/Notes";
import Settings from "./TOCView/Settings";
import getTOCData from "./TOCView/getTOCData";

/**
 * `TOCView`の引数
 */
interface Props {
  pdfPath?: string;
  notes?: Notes;
  openDrawer: boolean;
  onChanged: (notes: Notes) => void;
}

/**
 * 目次を表示するコンポーネント
 */
const TOCView: React.FC<Props> = ({
  pdfPath,
  openDrawer,
  notes,
  onChanged,
}) => {
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
        background: "whitesmoke",
        position: "relative",
        height: "100vh",
        overflowWrap: "break-word",
        overflow: "hidden",
        fontSize: "70%",
      }}
    >
      <Box sx={{ p: 0.5, lineHeight: 1 }}>{getTOCData(notes, onChanged)}</Box>

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
            onChanged({ ...notes });
          }}
        />
      </Drawer>
    </Box>
  );
};

export default TOCView;
