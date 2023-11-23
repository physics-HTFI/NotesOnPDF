import React, { useEffect, useState } from "react";
import {
  Box,
  Checkbox,
  FormControlLabel,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { Page } from "../../types/Notes";
import CheckboxText from "./Settings/CheckboxText";

/**
 * `Settings`の引数
 */
interface Props {
  preferredBook?: string;
  preferredPart?: string;
  preferredChapter?: string;
  preferredPageNum?: number;
  page?: Page;
  onChange?: (p: Page) => void;
}

/**
 * 設定パネル
 */
const Settings: React.FC<Props> = ({
  page,
  preferredBook,
  preferredPart,
  preferredChapter,
  preferredPageNum,
  onChange,
}) => {
  const [bookChecked, setBookChecked] = useState(false);
  const [bookText, setBookText] = useState("");
  const [partChecked, setPartChecked] = useState(false);
  const [partText, setPartText] = useState("");
  const [chapterChecked, setChapterChecked] = useState(false);
  const [chapterText, setChapterText] = useState("");
  const [sectionBreakTop, setSectionBreakTop] = useState(false);
  const [sectionBreakMiddle, setSectionBreakMiddle] = useState(false);
  const [pageNumChecked, setPageNumChecked] = useState(false);
  const [pageNumRestart, setPageNumRestart] = useState(1);
  const [excluded, setExcluded] = useState(false);

  useEffect(() => {
    setBookChecked(page?.book !== undefined);
    setBookText(page?.book ?? preferredBook ?? "");
    setPartChecked(page?.part !== undefined);
    setPartText(page?.part ?? preferredPart ?? "");
    setChapterChecked(page?.chapter !== undefined);
    setChapterText(page?.chapter ?? preferredChapter ?? "");
    setSectionBreakTop(page?.sectionBreak?.includes("top") ?? false);
    setSectionBreakMiddle(page?.sectionBreak?.includes("middle") ?? false);
    setPageNumChecked(page?.pageNumberRestart === undefined);
    setPageNumRestart(page?.pageNumberRestart ?? preferredPageNum ?? 1);
    setExcluded(page?.excluded === true);
  }, [page, preferredBook, preferredPart, preferredChapter, preferredPageNum]);

  //|
  //| 更新されたパラメータを親コンポーネントに送る
  //|
  useEffect(() => {
    const page: Page = {};
    if (bookChecked) page.book = bookText;
    if (partChecked) page.part = partText;
    if (chapterChecked) page.chapter = chapterText;
    if (sectionBreakTop) {
      page.sectionBreak = sectionBreakMiddle ? "top-middle" : "top";
    } else if (sectionBreakMiddle) page.sectionBreak = "middle";
    if (!pageNumChecked) page.pageNumberRestart = pageNumRestart;
    if (excluded) page.excluded = excluded;
    onChange?.(page);
  }, [
    bookChecked,
    bookText,
    partChecked,
    partText,
    chapterChecked,
    chapterText,
    sectionBreakTop,
    sectionBreakMiddle,
    pageNumChecked,
    pageNumRestart,
    excluded,
    onChange,
  ]);

  return (
    <Box
      sx={{ fontSize: "80%", p: 1, pl: 1.5, display: "flex", flexWrap: "wrap" }}
    >
      {/* 題区切り */}
      <CheckboxText
        label="題区切り"
        checked={bookChecked}
        setChecked={setBookChecked}
        text={bookText}
        setText={setBookText}
      />

      {/* 部区切り */}
      <CheckboxText
        label="部区切り"
        checked={partChecked}
        setChecked={setPartChecked}
        text={partText}
        setText={setPartText}
      />

      {/* 章区切り */}
      <CheckboxText
        label="章区切り"
        checked={chapterChecked}
        setChecked={setChapterChecked}
        text={chapterText}
        setText={setChapterText}
      />

      {/* 節区切り */}
      <FormControlLabel
        control={
          <Checkbox
            size="small"
            checked={sectionBreakTop}
            onChange={(e) => {
              setSectionBreakTop(e.target.checked);
            }}
          />
        }
        label={<Typography variant="button">節区切り</Typography>}
      />
      <FormControlLabel
        control={
          <Checkbox
            size="small"
            checked={sectionBreakMiddle}
            onChange={(e) => {
              setSectionBreakMiddle(e.target.checked);
            }}
          />
        }
        label={<Typography variant="button">ページ途中</Typography>}
      />
      <Box sx={{ width: "100%" }} />

      {/* ページ番号 */}
      <FormControlLabel
        control={
          <Switch
            size="small"
            checked={pageNumChecked}
            onChange={(e) => {
              setPageNumChecked(e.target.checked);
            }}
          />
        }
        label={
          <Typography
            variant="button"
            color={pageNumChecked ? undefined : "gray"}
          >
            ページ番号を前ページから決める
          </Typography>
        }
        sx={{ pt: 1 }}
      />
      <FormControlLabel
        control={<Switch size="small" />}
        label=""
        sx={{ visibility: "hidden", mr: 0 }}
      />
      <Typography
        variant="button"
        sx={{
          visibility: pageNumChecked ? "hidden" : "visible",
        }}
      >
        新しく始める
      </Typography>
      <TextField
        variant="standard"
        value={pageNumRestart}
        onChange={(e) => {
          const num = Number(e.target.value);
          setPageNumRestart(Math.min(999999, Math.max(1, num)));
        }}
        InputProps={{ sx: { fontSize: "140%", pl: 1 } }}
        type="number"
        sx={{
          width: 80,
          pl: 1,
          visibility: pageNumChecked ? "hidden" : "visible",
        }}
      />

      {/* ページ除外 */}
      <FormControlLabel
        control={
          <Switch
            size="small"
            checked={excluded}
            onChange={(e) => {
              setExcluded(e.target.checked);
            }}
          />
        }
        label={<Typography variant="button">このページを除外する</Typography>}
        sx={{ pt: 1 }}
      />
    </Box>
  );
};

export default Settings;
