import { FC, useContext, useState } from "react";
import { Box, IconButton, Tab, Tabs, Tooltip } from "@mui/material";
import {
  Page,
  PageStyle,
  PdfInfo,
  Settings,
  updatePageNum,
} from "@/types/PdfInfo";
import CheckboxText from "./Settings/CheckboxText";
import SectionBreak from "./Settings/SectionBreak";
import PageNumberRestart from "./Settings/PageNumberRestart";
import LabelSlider from "./Settings/LabelSlider";
import { PdfInfoContext } from "@/contexts/PdfInfoContext";
import { ExpandMore } from "@mui/icons-material";
import Checkbox from "./Settings/Checkbox";
import ClickOptionSelect from "./Settings/ClickOptionSelect";
import { AppSettingsContext } from "@/contexts/AppSettingsContext";
import { AppSettings } from "@/types/AppSettings";

/**
 * `Settings`の引数
 */
interface Props {
  onClose: () => void;
}

/**
 * 設定パネル
 */
const Settings: FC<Props> = ({ onClose }) => {
  const { appSettings, setAppSettings } = useContext(AppSettingsContext);
  const { pdfInfo, setPdfInfo, pdfPath } = useContext(PdfInfoContext);
  const [tab, setTab] = useState(0);
  if (!appSettings || !setAppSettings) return <></>;
  if (!pdfInfo || !setPdfInfo || !pdfPath) return <></>;

  // 部名・章名・ページ番号の候補など
  const { page, bookName, partNum, chapterNum, pageNum } = getParams(
    pdfInfo,
    pdfPath
  );

  // ページ設定変更
  const handleChangePage = (page: Partial<Page>) => {
    const pre = pdfInfo.pages[pdfInfo.currentPage];
    if (!pre) return;
    pdfInfo.pages[pdfInfo.currentPage] = { ...pre, ...page };
    if (Object.keys(page).includes("pageNumberRestart")) updatePageNum(pdfInfo);
    setPdfInfo({ ...pdfInfo });
  };

  // ファイル設定変更
  const handleChangeFileSettings = (newSettings: Partial<Settings>) => {
    setPdfInfo({
      ...pdfInfo,
      settings: { ...pdfInfo.settings, ...newSettings },
    });
  };

  // アプリ設定変更
  const handleChangeAppSettings = (newSettings: Partial<AppSettings>) => {
    setAppSettings({
      ...appSettings,
      ...newSettings,
    });
  };

  // `page.style`の編集よう関数
  const editStyle = (
    arr: PageStyle[] | undefined,
    item: PageStyle,
    adds: boolean
  ) => {
    const set = new Set(arr);
    if (adds) set.add(item);
    else set.delete(item);
    const retval = Array.from(set);
    return retval.length === 0 ? undefined : retval;
  };

  return (
    <Box sx={{ width: "100%", fontSize: "80%" }}>
      {/* 閉じるアイコン */}
      <CloseIcon onClose={onClose} />

      {/* タブ */}
      <SettingsTabs
        tab={tab}
        pageLabel={`p. ${pdfInfo.pages[pdfInfo.currentPage]?.num ?? "???"}`}
        setTab={setTab}
      />

      {/* ページ設定 */}
      {tab === 0 && (
        <Box sx={{ mx: 1.5, mb: 1.5 }}>
          {/* 題区切り */}
          <CheckboxText
            label="題区切り"
            text={page?.book}
            preferredText={bookName}
            onChange={(book) => {
              handleChangePage({ book });
            }}
          />
          {/* 部区切り */}
          <CheckboxText
            label="部区切り"
            text={page?.part}
            preferredText={`第${partNum}部`}
            onChange={(part) => {
              handleChangePage({ part });
            }}
          />
          {/* 章区切り */}
          <CheckboxText
            label="章区切り"
            text={page?.chapter}
            preferredText={`第${chapterNum}章`}
            onChange={(chapter) => {
              handleChangePage({ chapter });
            }}
          />
          {/* 節区切り */}
          <SectionBreak
            breakBefore={page?.style?.includes("break-before")}
            breakMiddle={page?.style?.includes("break-middle")}
            onChange={(breakBefore, breakMiddle) => {
              let style = editStyle(page?.style, "break-before", breakBefore);
              style = editStyle(style, "break-middle", breakMiddle);
              handleChangePage({ style });
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
          <Checkbox
            label="このページをグレーアウトする"
            checked={page?.style?.includes("excluded")}
            onChange={(excluded) => {
              const style = editStyle(page?.style, "excluded", excluded);
              handleChangePage({ style });
            }}
          />
        </Box>
      )}

      {/* ファイル設定 */}
      {tab === 1 && (
        <Box sx={{ width: "90%", m: 1 }}>
          <LabelSlider
            label="文字サイズ"
            value={pdfInfo.settings.fontSize}
            minValue={30}
            maxValue={100}
            step={0.5}
            tooltipTitle="注釈内で使用される文字のサイズを調節します"
            onChange={(fontSize) => {
              handleChangeFileSettings({ fontSize });
            }}
          />
          <LabelSlider
            label="余白(上)"
            value={pdfInfo.settings.offsetTop}
            minValue={0}
            maxValue={0.2}
            step={0.001}
            tooltipTitle="ページ上部の余白をカットします"
            onChange={(offsetTop) => {
              handleChangeFileSettings({ offsetTop });
            }}
          />
          <LabelSlider
            label="余白(下)"
            value={pdfInfo.settings.offsetBottom}
            minValue={0}
            maxValue={0.2}
            step={0.001}
            tooltipTitle="ページ上部の余白をカットします"
            onChange={(offsetBottom) => {
              handleChangeFileSettings({ offsetBottom });
            }}
          />
        </Box>
      )}

      {/* アプリ設定 */}
      {tab === 2 && (
        <Box sx={{ width: "95%", p: 1 }}>
          {/* モード解除 */}
          <Checkbox
            label="空クリックでモードを解除する"
            checked={appSettings.cancelModeWithVoidClick}
            tooltip="空クリックで変更／移動／削除モードを解除します"
            onChange={(cancelModeWithVoidClick) => {
              handleChangeAppSettings({ cancelModeWithVoidClick });
            }}
          />
          {/* スナップ */}
          <Checkbox
            label="注釈の向きをスナップする"
            checked={appSettings.snapNotes}
            tooltip="カッコ注釈／マーカー注釈の向きを水平／鉛直に限定します"
            onChange={(snapNotes) => {
              handleChangeAppSettings({ snapNotes });
            }}
          />
          {/* 右クリック */}
          <ClickOptionSelect
            label="注釈の右クリック"
            value={appSettings.rightClick}
            onChange={(rightClick) => {
              handleChangeAppSettings({ rightClick });
            }}
          />
          {/* 中クリック */}
          <ClickOptionSelect
            label="注釈の中クリック"
            value={appSettings.middleClick}
            onChange={(middleClick) => {
              handleChangeAppSettings({ middleClick });
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default Settings;

//|
//| ローカル関数
//|

function getParams(pdfInfo: PdfInfo, pdfPath: string) {
  const page = pdfInfo.pages[pdfInfo.currentPage];

  // 部名・章名・ページ番号の候補
  const bookName = pdfPath.match(/[^\\/]+(?=\.[^.]+$)/)?.[0] ?? "";
  let partNum = 1;
  let chapterNum = 1;
  let pageNum = 1;
  for (let i = 0; i < pdfInfo.currentPage; i++) {
    ++pageNum;
    const page = pdfInfo.pages[i];
    if (!page) continue;
    if (page.part !== undefined) ++partNum;
    if (page.chapter !== undefined) ++chapterNum;
    if (page.pageNumberRestart) {
      pageNum = 1 + page.pageNumberRestart;
    }
  }

  return { page, bookName, partNum, chapterNum, pageNum };
}

/**
 * 閉じるボタン
 */
function CloseIcon({ onClose }: Props): JSX.Element {
  return (
    <IconButton
      sx={{
        position: "absolute",
        right: 0,
        top: "-35px",
      }}
      onClick={onClose}
      size="small"
    >
      <ExpandMore />
    </IconButton>
  );
}

/**
 * タブ
 */
function SettingsTabs(props: {
  tab: number;
  setTab: (i: number) => void;
  pageLabel?: string;
}): JSX.Element {
  return (
    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
      <Tabs
        value={props.tab}
        onChange={(_, i: number) => {
          props.setTab(i);
        }}
      >
        <Tooltip title="現在のページの設定" placement="top">
          <Tab label={props.pageLabel ?? "p. ???"} />
        </Tooltip>
        <Tooltip title="このファイルの設定" placement="top">
          <Tab label="ファイル" />
        </Tooltip>
        <Tooltip title="アプリ全体の設定" placement="top">
          <Tab label="アプリ" />
        </Tooltip>
      </Tabs>
    </Box>
  );
}
