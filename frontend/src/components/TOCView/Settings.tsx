import { FC, useContext, useState } from "react";
import { Box, IconButton, Tab, Tabs } from "@mui/material";
import { Page, Settings, toDisplayedPage } from "@/types/PdfInfo";
import CheckboxText from "./Settings/CheckboxText";
import SectionBreak from "./Settings/SectionBreak";
import Excluded from "./Settings/Excluded";
import PageNumberRestart from "./Settings/PageNumberRestart";
import LabelSlider from "./Settings/LabelSlider";
import { PdfInfoContext } from "@/contexts/PdfInfoContext";
import { ExpandMore } from "@mui/icons-material";

interface Props {
  onClose: () => void;
}

/**
 * 設定パネル
 */
const Settings: FC<Props> = ({ onClose }) => {
  const [tab, setTab] = useState(0);
  const { pdfinfo, setPdfInfo, pdfPath } = useContext(PdfInfoContext);
  if (!pdfinfo || !setPdfInfo || !pdfPath) return <></>;
  const page: Page | undefined = pdfinfo.pages[pdfinfo.currentPage];

  // 部名・章名・ページ番号の候補
  const bookName = pdfPath.match(/[^\\/]+(?=\.[^.]+$)/)?.[0] ?? "";
  let partNum = 1;
  let chapterNum = 1;
  let pageNum = 1;
  for (let i = 0; i < pdfinfo.currentPage; i++) {
    ++pageNum;
    const page = pdfinfo.pages[i];
    if (!page) continue;
    if (page.part !== undefined) ++partNum;
    if (page.chapter !== undefined) ++chapterNum;
    if (page.pageNumberRestart) {
      pageNum = 1 + page.pageNumberRestart;
    }
  }

  // ページ設定変更
  const handleChangePage = (page: Partial<Page>) => {
    pdfinfo.pages[pdfinfo.currentPage] = {
      ...pdfinfo.pages[pdfinfo.currentPage],
      ...page,
    };
    setPdfInfo({ ...pdfinfo });
  };

  // PDF設定変更
  const handleChangeSettings = (settings: Partial<Settings>) => {
    setPdfInfo({
      ...pdfinfo,
      settings: { ...pdfinfo.settings, ...settings },
    });
  };

  return (
    <Box sx={{ width: "100%", fontSize: "80%" }}>
      {/* 閉じるアイコン */}
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

      {/* タブ */}
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tab}
          onChange={(_, i: number) => {
            setTab(i);
          }}
        >
          <Tab label={toDisplayedPage(pdfinfo).pageLabel} />
          <Tab label="ファイル" />
          <Tab label="アプリ" />
        </Tabs>
      </Box>

      {/* ページ設定 */}
      {tab === 0 && (
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
      )}

      {/* PDF設定 */}
      {tab === 1 && (
        <Box sx={{ width: "90%", m: 1 }}>
          <LabelSlider
            label="文字サイズ"
            value={pdfinfo.settings.fontSize}
            minValue={30}
            maxValue={100}
            step={0.5}
            tooltipTitle="注釈内で使用される文字のサイズを調節します"
            onChange={(fontSize) => {
              handleChangeSettings({ fontSize });
            }}
          />
          <LabelSlider
            label="余白(上)"
            value={pdfinfo.settings.offsetTop}
            minValue={0}
            maxValue={0.2}
            step={0.001}
            tooltipTitle="ページ上部の余白をカットすることで表示範囲を拡大します"
            onChange={(offsetTop) => {
              handleChangeSettings({ offsetTop });
            }}
          />
          <LabelSlider
            label="余白(下)"
            value={pdfinfo.settings.offsetBottom}
            minValue={0}
            maxValue={0.2}
            step={0.001}
            tooltipTitle="ページ下部の余白をカットすることで表示範囲を拡大します"
            onChange={(offsetBottom) => {
              handleChangeSettings({ offsetBottom });
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default Settings;
