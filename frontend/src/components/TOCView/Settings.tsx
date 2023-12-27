import React, { useContext } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from "@mui/material";
import { Page, Settings } from "@/types/Notes";
import CheckboxText from "./Settings/CheckboxText";
import SectionBreak from "./Settings/SectionBreak";
import Excluded from "./Settings/Excluded";
import PageNumberRestart from "./Settings/PageNumberRestart";
import { ExpandLess } from "@mui/icons-material";
import LabelSlider from "./Settings/LabelSlider";
import { NotesContext } from "@/contexts/NotesContext";

/**
 * 設定パネル
 */
const Settings: React.FC = () => {
  const { notes, setNotes, pdfPath } = useContext(NotesContext);
  if (!notes || !setNotes || !pdfPath) return <></>;
  const page: Page | undefined = notes.pages[notes.currentPage];

  // 部名・章名・ページ番号の候補
  const bookName = pdfPath.match(/[^\\/]+(?=\.[^.]+$)/)?.[0] ?? "";
  let partNum = 1;
  let chapterNum = 1;
  let pageNum = 1;
  for (let i = 0; i < notes.currentPage; i++) {
    ++pageNum;
    const page = notes.pages[i];
    if (!page) continue;
    if (page.part !== undefined) ++partNum;
    if (page.chapter !== undefined) ++chapterNum;
    if (page.pageNumberRestart) {
      pageNum = 1 + page.pageNumberRestart;
    }
  }

  // ページ設定変更
  const handleChangePage = (page: Partial<Page>) => {
    notes.pages[notes.currentPage] = {
      ...notes.pages[notes.currentPage],
      ...page,
    };
    setNotes({ ...notes });
  };

  // PDF設定変更
  const handleChangeSettings = (settings: Partial<Settings>) => {
    setNotes({
      ...notes,
      settings: { ...notes.settings, ...settings },
    });
  };

  return (
    <Box sx={{ fontSize: "80%", flexWrap: "wrap" }}>
      <Box sx={{ mx: 1.5, mb: 1.5 }}>
        {/* 題区切り */}
        <CheckboxText
          label="題区切り"
          tooltip="このページの前に題名を追加します"
          text={page?.book}
          preferredText={bookName}
          onChange={(book) => {
            handleChangePage({ book });
          }}
        />

        {/* 部区切り */}
        <CheckboxText
          label="部区切り"
          tooltip="このページの前に部名を追加します"
          text={page?.part}
          preferredText={`第${partNum}部`}
          onChange={(part) => {
            handleChangePage({ part });
          }}
        />

        {/* 章区切り */}
        <CheckboxText
          label="章区切り"
          tooltip="このページの前に章名を追加します"
          text={page?.chapter}
          preferredText={`第${chapterNum}章`}
          onChange={(chapter) => {
            handleChangePage({ chapter });
          }}
        />

        {/* 節区切り */}
        <SectionBreak
          sectionBreak={page?.sectionBreak}
          sectionBreakInner={page?.sectionBreakInner}
          onChange={(sectionBreak, sectionBreakInner) => {
            handleChangePage({
              sectionBreak: sectionBreak ? true : undefined,
              sectionBreakInner: sectionBreakInner ? true : undefined,
            });
          }}
        />

        {/* ページ番号 */}
        <PageNumberRestart
          pageNumberRestart={page?.pageNumberRestart}
          preferredPageNumber={pageNum}
          onChange={(pageNumberRestart) => {
            handleChangePage({ pageNumberRestart });
          }}
        />

        {/* ページ除外 */}
        <Excluded
          excluded={page?.excluded}
          onChange={(excluded) => {
            handleChangePage({ excluded });
          }}
        />
      </Box>
      <Accordion sx={{ background: "unset" }}>
        <AccordionSummary expandIcon={<ExpandLess />}>
          <Typography>PDF設定</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <LabelSlider
            label="余白(上)"
            value={notes.settings.offsetTop}
            onChange={(offsetTop) => {
              handleChangeSettings({ offsetTop });
            }}
          />
          <LabelSlider
            label="余白(下)"
            value={notes.settings.offsetBottom}
            onChange={(offsetBottom) => {
              handleChangeSettings({ offsetBottom });
            }}
          />
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default Settings;
