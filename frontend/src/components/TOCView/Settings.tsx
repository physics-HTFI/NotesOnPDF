import React from "react";
import { Box } from "@mui/material";
import { Page } from "../../types/Notes";
import CheckboxText from "./Settings/CheckboxText";
import SectionBreak from "./Settings/SectionBreak";
import Excluded from "./Settings/Excluded";
import PageNumberRestart from "./Settings/PageNumberRestart";

/**
 * `Settings`の引数
 */
interface Props {
  preferredBook: string;
  preferredPart: string;
  preferredChapter: string;
  preferredPageNumber?: number;
  page?: Page;
  onChange: (p: Page) => void;
}

/**
 * 設定パネル
 */
const Settings: React.FC<Props> = ({
  page,
  preferredBook,
  preferredPart,
  preferredChapter,
  preferredPageNumber,
  onChange,
}) => {
  return (
    <Box
      sx={{ fontSize: "80%", p: 1, pl: 1.5, display: "flex", flexWrap: "wrap" }}
    >
      {/* 題区切り */}
      <CheckboxText
        label="題区切り"
        tooltip="このページの前に題名を追加します"
        text={page?.book}
        preferredText={preferredBook}
        onChange={(text) => {
          onChange({ book: text });
        }}
      />

      {/* 部区切り */}
      <CheckboxText
        label="部区切り"
        tooltip="このページの前に部名を追加します"
        text={page?.part}
        preferredText={preferredPart}
        onChange={(text) => {
          onChange({ part: text });
        }}
      />

      {/* 章区切り */}
      <CheckboxText
        label="章区切り"
        tooltip="このページの前に章名を追加します"
        text={page?.chapter}
        preferredText={preferredChapter}
        onChange={(text) => {
          onChange({ chapter: text });
        }}
      />

      {/* 節区切り */}
      <SectionBreak
        sectionBreak={page?.sectionBreak}
        onChange={(sectionBreak) => {
          onChange({ sectionBreak });
        }}
      />

      {/* ページ番号 */}
      <PageNumberRestart
        pageNumberRestart={page?.pageNumberRestart}
        preferredPageNumber={preferredPageNumber}
        onChange={(pageNumberRestart) => {
          onChange({ pageNumberRestart });
        }}
      />

      {/* ページ除外 */}
      <Excluded
        excluded={page?.excluded}
        onChange={(excluded) => {
          onChange({ excluded });
        }}
      />
    </Box>
  );
};

export default Settings;
