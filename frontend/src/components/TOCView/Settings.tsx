import React from "react";
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

/**
 * `Settings`の引数
 */
interface Props {
  page?: Page;
  settings?: Settings;
  preferredBook: string;
  preferredPart: string;
  preferredChapter: string;
  preferredPageNumber?: number;
  onChangePage: (p: Partial<Page>) => void;
  onChangeSettings: (s: Partial<Settings>) => void;
}

/**
 * 設定パネル
 */
// TODO 表示範囲
const Settings: React.FC<Props> = ({
  page,
  settings,
  preferredBook,
  preferredPart,
  preferredChapter,
  preferredPageNumber,
  onChangePage,
  onChangeSettings,
}) => {
  return (
    <Box sx={{ fontSize: "80%", flexWrap: "wrap" }}>
      <Box sx={{ mx: 1.5, mb: 1.5 }}>
        {/* 題区切り */}
        <CheckboxText
          label="題区切り"
          tooltip="このページの前に題名を追加します"
          text={page?.book}
          preferredText={preferredBook}
          onChange={(book) => {
            onChangePage({ book });
          }}
        />

        {/* 部区切り */}
        <CheckboxText
          label="部区切り"
          tooltip="このページの前に部名を追加します"
          text={page?.part}
          preferredText={preferredPart}
          onChange={(part) => {
            onChangePage({ part });
          }}
        />

        {/* 章区切り */}
        <CheckboxText
          label="章区切り"
          tooltip="このページの前に章名を追加します"
          text={page?.chapter}
          preferredText={preferredChapter}
          onChange={(chapter) => {
            onChangePage({ chapter });
          }}
        />

        {/* 節区切り */}
        <SectionBreak
          sectionBreak={page?.sectionBreak}
          onChange={(sectionBreak) => {
            onChangePage({ sectionBreak });
          }}
        />

        {/* ページ番号 */}
        <PageNumberRestart
          pageNumberRestart={page?.pageNumberRestart}
          preferredPageNumber={preferredPageNumber}
          onChange={(pageNumberRestart) => {
            onChangePage({ pageNumberRestart });
          }}
        />

        {/* ページ除外 */}
        <Excluded
          excluded={page?.excluded}
          onChange={(excluded) => {
            onChangePage({ excluded });
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
            value={settings?.offsetTop ?? 0}
            onChange={(offsetTop) => {
              onChangeSettings({ offsetTop });
            }}
          />
          <LabelSlider
            label="余白(下)"
            value={settings?.offsetBottom ?? 0}
            onChange={(offsetBottom) => {
              onChangeSettings({ offsetBottom });
            }}
          />
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default Settings;
