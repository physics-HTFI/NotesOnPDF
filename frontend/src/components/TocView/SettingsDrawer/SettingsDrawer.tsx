import { useContext, useState } from "react";
import { Box, Drawer } from "@mui/material";
import {
  Page,
  Settings as PdfSettings,
  editPageStyle,
  updatePageNum,
} from "@/types/PdfNotes";
import CheckboxText from "./CheckboxText";
import SectionBreak from "./SectionBreak";
import PageNumberRestart from "./PageNumberRestart";
import LabelSlider from "./LabelSlider";
import Checkbox from "./Checkbox";
import ClickOptionSelect from "./ClickOptionSelect";
import AppSettings from "@/types/AppSettings";
import { UiContext } from "@/contexts/UiContext";
import IconClose from "./IconClose";
import IconTogglePosition from "./IconTogglePosition";
import Tabs from "./Tabs";
import ModelContext from "@/contexts/ModelContext/ModelContext";
import PdfNotesContext from "@/contexts/PdfNotesContext/PdfNotesContext";

/**
 * 設定パネル
 */
export default function SettingsDrawer() {
  const { appSettings, setAppSettings } = useContext(ModelContext);
  const {
    pdfNotes,
    setPdfNotes,
    updaters: { page, getPreferredLabels },
  } = useContext(PdfNotesContext);
  const { model } = useContext(ModelContext);
  const {
    readOnly,
    openSettingsDrawer,
    setOpenSettingsDrawer,
    setAlert,
    setReadOnly,
  } = useContext(UiContext);
  const [tab, setTab] = useState(0);
  const [isBottom, setIsBottom] = useState(true);
  const [variant, setVariant] = useState<"persistent" | "temporary">(
    "temporary"
  );

  if (!appSettings || !pdfNotes) return <></>;

  // 部名・章名・ページ番号の候補など
  const { volumeLabel, partLabel, chapterLabel, pageNum } =
    getPreferredLabels();

  // ページ設定変更
  const handleChangePage = (pageSettings: Partial<Page>) => {
    if (!page) return;
    pdfNotes.pages[pdfNotes.currentPage] = { ...page, ...pageSettings };
    if (Object.keys(pageSettings).includes("numRestart")) {
      updatePageNum(pdfNotes);
    }
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
  const handleChangeAppSettings = (changed: Partial<AppSettings>) => {
    const newSettings = {
      ...appSettings,
      ...changed,
    };
    setAppSettings(newSettings);
    if (readOnly) return;
    model.putAppSettings(newSettings).catch(() => {
      setAlert(
        "error",
        <span>
          設定ファイルの保存に失敗しました。
          <br />
          読み取り専用モードに切り替えました。
        </span>
      );
      setReadOnly(true);
    });
  };

  // 閉じているときは`variant`を`temporary`にすることで、内部コンポーネントの再レンダーを防ぐ
  const newVariant = openSettingsDrawer ? "persistent" : "temporary";
  if (newVariant !== variant) {
    if (openSettingsDrawer) {
      setVariant(newVariant);
    } else {
      setTimeout(() => {
        setVariant(newVariant);
      }, 500);
    }
  }

  return (
    <Drawer
      variant={variant}
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
        <IconClose
          isBottom={isBottom}
          onClose={() => {
            setOpenSettingsDrawer(false);
          }}
        />

        {/* 設定パネル位置変更ボタン */}
        <IconTogglePosition
          isBottom={isBottom}
          onToggleSettingsPosition={() => {
            setIsBottom(!isBottom);
          }}
        />

        {/* タブ */}
        <Tabs tab={tab} setTab={setTab} />

        {/* ページ設定 */}
        {tab === 0 && (
          <Box sx={{ mx: 1.5, mb: 1.5 }}>
            {/* 巻区切り */}
            <CheckboxText
              label="巻区切り"
              tooltip="[Alt+Enter]"
              text={page?.volume}
              preferredText={volumeLabel}
              onChange={(volume) => {
                handleChangePage({ volume });
              }}
            />
            {/* 部区切り */}
            <CheckboxText
              label="部区切り"
              tooltip="[Ctrl+Enter]"
              text={page?.part}
              preferredText={partLabel}
              onChange={(part) => {
                handleChangePage({ part });
              }}
            />
            {/* 章区切り */}
            <CheckboxText
              label="章区切り"
              tooltip="[Shift+Enter]"
              text={page?.chapter}
              preferredText={chapterLabel}
              onChange={(chapter) => {
                handleChangePage({ chapter });
              }}
            />
            {/* 節区切り */}
            <SectionBreak
              tooltip="[Enter]"
              breakBefore={page?.style?.includes("break-before")}
              breakMiddle={page?.style?.includes("break-middle")}
              onChange={(breakBefore, breakMiddle) => {
                let style = editPageStyle(
                  page?.style,
                  "break-before",
                  breakBefore
                );
                style = editPageStyle(style, "break-middle", breakMiddle);
                handleChangePage({ style });
              }}
            />
            {/* ページ番号 */}
            <PageNumberRestart
              numRestart={page?.numRestart}
              preferredPageNumber={pageNum}
              onChange={(numRestart) => {
                handleChangePage({ numRestart });
              }}
            />
            {/* ページ除外 */}
            <Checkbox
              label="このページをグレーアウトする"
              tooltip="[Escape]"
              checked={page?.style?.includes("excluded")}
              onChange={(excluded) => {
                const style = editPageStyle(page?.style, "excluded", excluded);
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
              minValue={50}
              maxValue={150}
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
}
