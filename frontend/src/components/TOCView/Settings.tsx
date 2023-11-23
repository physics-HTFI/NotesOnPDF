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
  const getSectionBreak = (
    top: boolean,
    middle: boolean
  ): "top" | "middle" | "top-middle" | undefined => {
    if (top) {
      return middle ? "top-middle" : "top";
    } else if (middle) return "middle";
    return undefined;
  };

  return (
    <Box
      sx={{ fontSize: "80%", p: 1, pl: 1.5, display: "flex", flexWrap: "wrap" }}
    >
      {/* 題区切り */}
      <CheckboxText
        label="題区切り"
        checked={bookChecked}
        text={bookText}
        onChange={(checked, text) => {
          onChange({ book: checked ? text : undefined });
        }}
      />

      {/* 部区切り */}
      <CheckboxText
        label="部区切り"
        checked={partChecked}
        text={partText}
        onChange={(checked, text) => {
          onChange({ part: checked ? text : undefined });
        }}
      />

      {/* 章区切り */}
      <CheckboxText
        label="章区切り"
        checked={chapterChecked}
        text={chapterText}
        onChange={(checked, text) => {
          onChange({ chapter: checked ? text : undefined });
        }}
      />

      {/* 節区切り */}
      <FormControlLabel
        control={
          <Checkbox
            size="small"
            checked={sectionBreakTop}
            onChange={(e) => {
              const newVal = e.target.checked;
              setSectionBreakTop(newVal);
              onChange({
                sectionBreak: getSectionBreak(newVal, sectionBreakMiddle),
              });
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
              const newVal = e.target.checked;
              setSectionBreakMiddle(newVal);
              onChange({
                sectionBreak: getSectionBreak(sectionBreakTop, newVal),
              });
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
              const newVal = e.target.checked;
              setPageNumChecked(newVal);
              onChange({
                pageNumberRestart: newVal ? undefined : pageNumRestart,
              });
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
          const numValidated = Math.min(999999, Math.max(1, num));
          setPageNumRestart(numValidated);
          onChange({
            pageNumberRestart: pageNumChecked ? undefined : numValidated,
          });
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
              const newVal = e.target.checked;
              setExcluded(newVal);
              onChange({ excluded: newVal ? newVal : undefined });
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
