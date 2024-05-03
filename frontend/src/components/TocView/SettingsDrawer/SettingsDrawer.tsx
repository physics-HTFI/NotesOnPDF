import { FC, useContext, useState } from "react";
import { Box, Drawer, IconButton, Tab, Tabs } from "@mui/material";
import {
  Page,
  PageStyle,
  PdfNotes,
  Settings as PdfSettings,
  updatePageNum,
} from "@/types/PdfNotes";
import CheckboxText from "./CheckboxText";
import SectionBreak from "./SectionBreak";
import PageNumberRestart from "./PageNumberRestart";
import LabelSlider from "./LabelSlider";
import { PdfNotesContext } from "@/contexts/PdfNotesContext";
import {
  Close,
  KeyboardDoubleArrowDown,
  KeyboardDoubleArrowUp,
} from "@mui/icons-material";
import Checkbox from "./Checkbox";
import ClickOptionSelect from "./ClickOptionSelect";
import { AppSettingsContext } from "@/contexts/AppSettingsContext";
import { AppSettings } from "@/types/AppSettings";
import { UiStateContext } from "@/contexts/UiStateContext";
import { grey } from "@mui/material/colors";

/**
 * 設定パネル
 */
const SettingsDrawer: FC = () => {
  const { appSettings, setAppSettings } = useContext(AppSettingsContext);
  const { pdfNotes, setPdfNotes } = useContext(PdfNotesContext);
  const { openSettingsDrawer, setOpenSettingsDrawer } =
    useContext(UiStateContext);
  const [tab, setTab] = useState(0);
  const [isBottom, setIsBottom] = useState(true);
  if (!appSettings || !setAppSettings) return <></>;
  if (!pdfNotes) return <></>;

  // 部名・章名・ページ番号の候補など
  const { page, partNum, chapterNum, pageNum } = getParams(pdfNotes);

  // ページ設定変更
  const handleChangePage = (page: Partial<Page>) => {
    const pre = pdfNotes.pages[pdfNotes.currentPage];
    if (!pre) return;
    pdfNotes.pages[pdfNotes.currentPage] = { ...pre, ...page };
    if (Object.keys(page).includes("numberRestart")) updatePageNum(pdfNotes);
    setPdfNotes({ ...pdfNotes });
  };

  // ファイル設定変更
  const handleChangeFileSettings = (newSettings: Partial<PdfSettings>) => {
    setPdfNotes({
      ...pdfNotes,
      settings: { ...pdfNotes.settings, ...newSettings },
    });
  };

  // アプリ設定変更
  const handleChangeAppSettings = (newSettings: Partial<AppSettings>) => {
    setAppSettings({
      ...appSettings,
      ...newSettings,
    });
  };

  // `page.style`の編集用関数
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
    <Drawer
      variant="persistent"
      anchor={isBottom ? "bottom" : "top"}
      open={openSettingsDrawer}
      PaperProps={{
        square: false,
        sx: {
          position: "absolute",
          borderRadius: isBottom ? "10px 10px 0 0" : "0 0 10px 10px",
          overflow: "visible", // 「閉じるアイコン」を表示する
        },
      }}
    >
      <Box sx={{ width: "100%", fontSize: "80%" }}>
        {/* 閉じるアイコン */}
        <CloseIcon
          isBottom={isBottom}
          onClose={() => {
            setOpenSettingsDrawer(false);
          }}
        />

        {/* 設定パネル位置変更ボタン */}
        <ToggleSettingsPositionIcon
          isBottom={isBottom}
          onToggleSettingsPosition={() => {
            setIsBottom(!isBottom);
          }}
        />

        {/* タブ */}
        <SettingsTabs
          tab={tab}
          pageLabel={`p. ${pdfNotes.pages[pdfNotes.currentPage]?.num ?? "???"}`}
          setTab={setTab}
        />

        {/* ページ設定 */}
        {tab === 0 && (
          <Box sx={{ mx: 1.5, mb: 1.5 }}>
            {/* 題区切り */}
            <CheckboxText
              label="題区切り"
              text={page?.book}
              preferredText={"タイトル"}
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
              numberRestart={page?.numberRestart}
              preferredPageNumber={pageNum}
              onChange={(numberRestart) => {
                handleChangePage({ numberRestart });
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
              value={pdfNotes.settings.fontSize}
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
              value={pdfNotes.settings.offsetTop}
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
              value={pdfNotes.settings.offsetBottom}
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
    </Drawer>
  );
};

export default SettingsDrawer;

//|
//| ローカル関数
//|

function getParams(pdfNotes: PdfNotes) {
  const page = pdfNotes.pages[pdfNotes.currentPage];

  // 部名・章名・ページ番号の候補
  let partNum = 1;
  let chapterNum = 1;
  let pageNum = 1;
  for (let i = 0; i < pdfNotes.currentPage; i++) {
    ++pageNum;
    const page = pdfNotes.pages[i];
    if (!page) continue;
    if (page.part !== undefined) ++partNum;
    if (page.chapter !== undefined) ++chapterNum;
    if (page.numberRestart) {
      pageNum = 1 + page.numberRestart;
    }
  }

  return { page, partNum, chapterNum, pageNum };
}

/**
 * 閉じるボタン
 */
function CloseIcon({
  isBottom,
  onClose,
}: {
  isBottom: boolean;
  onClose: () => void;
}): JSX.Element {
  return (
    <IconButton
      sx={{
        position: "absolute",
        right: 2,
        bottom: isBottom ? undefined : -37,
        top: isBottom ? -37 : undefined,
        background: grey[100],
        "&:hover": {
          background: grey[300],
        },
      }}
      onClick={onClose}
      size="small"
    >
      <Close />
    </IconButton>
  );
}

/**
 * 設定パネル位置変更ボタン
 */
function ToggleSettingsPositionIcon({
  isBottom,
  onToggleSettingsPosition,
}: {
  isBottom: boolean;
  onToggleSettingsPosition: () => void;
}): JSX.Element {
  return (
    <IconButton
      sx={{
        position: "absolute",
        right: 39,
        bottom: isBottom ? undefined : -37,
        top: isBottom ? -37 : undefined,
        background: grey[100],
        "&:hover": {
          background: grey[300],
        },
      }}
      onClick={onToggleSettingsPosition}
      size="small"
    >
      {isBottom ? <KeyboardDoubleArrowUp /> : <KeyboardDoubleArrowDown />}
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
        <Tab label={props.pageLabel ?? "p. ???"} />
        <Tab label="ファイル" />
        <Tab label="アプリ" />
      </Tabs>
    </Box>
  );
}
