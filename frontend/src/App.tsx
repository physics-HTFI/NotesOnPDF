import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import IModel from "@/models/IModel";
import Model from "./models/Model";
import ModelMock from "@/models/Model.Mock";
import { Coverage, Coverages } from "@/types/Coverages";
import { PdfNotes, createOrGetPdfNotes } from "@/types/PdfNotes";
import SnackbarsMock from "./components/Fullscreen/SnackbarMock";
import OpenFileDrawer from "./components/OpenFileDrawer";
import PdfView from "@/components/PdfView";
import Waiting from "@/components/Fullscreen/Waiting";
import TocView from "@/components/TocView";
import { PdfNotesContext } from "./contexts/PdfNotesContext";
import { grey } from "@mui/material/colors";
import { AppSettingsContextProvider } from "./contexts/AppSettingsContext";

const IS_MOCK = import.meta.env.VITE_IS_MOCK === "true";
const model: IModel = IS_MOCK ? new ModelMock() : new Model();

function App() {
  const [coverages, setCoverages] = useState<Coverages>();
  const [pdf, setPDF] = useState<string | File>();
  const [pdfNotes, setPdfNotes] = useState<PdfNotes>();
  const [, setPageRatios] = useState<number[]>();
  const pdfPath = pdf && (pdf instanceof File ? pdf.name : pdf);

  const [openLeftDrawer, setOpenLeftDrawer] = useState(true);
  const [openBottomDrawer, setOpenBottomDrawer] = useState(false);
  const [isWaitingPDF, setIsWaitingPDF] = useState(false);
  const [isWaitingPdfNotes, setIsWaitingPdfNotes] = useState(false);

  // ページの遷移
  const handlePageChange = (delta: number) => {
    if (!pdfNotes) return;
    const newPage = Math.max(
      0,
      Math.min(pdfNotes.pages.length - 1, pdfNotes.currentPage + delta)
    );
    if (pdfNotes.currentPage === newPage) return;
    setPdfNotes({ ...pdfNotes, currentPage: newPage });
  };

  // 初回に1度だけ行う処理
  useEffect(() => {
    document.onselectstart = () => false;
    document.oncontextmenu = () => false;
  }, []);

  // 進捗の更新
  useEffect(() => {
    if (!coverages || !pdfPath || !pdfNotes) return;
    // TODO ページを切り替えるだけで更新されてしまう
    const coverage: Coverage = {
      allPages: pdfNotes.pages.length,
      enabledPages:
        pdfNotes.pages.length -
        Object.keys(pdfNotes.pages).filter((key) =>
          pdfNotes.pages[Number(key)]?.style?.includes("excluded")
        ).length,
      notedPages: Object.keys(pdfNotes.pages).filter(
        (key) =>
          (pdfNotes.pages[Number(key)]?.style?.includes("excluded")
            ? 0
            : pdfNotes.pages[Number(key)]?.notes?.length ?? 0) > 0
      ).length,
    };
    coverages.pdfs[pdfPath] = coverage;
    model.putCoverages(coverages).catch(() => undefined);
  }, [pdfNotes, coverages, pdfPath]);
  useEffect(() => {
    if (!pdfNotes || !pdfPath) return;
    model.putPdfNotes(pdfPath, pdfNotes).catch(() => undefined);
  }, [pdfPath, pdfNotes]);

  return (
    <AppSettingsContextProvider model={model}>
      <PdfNotesContext.Provider
        value={{
          pdfPath,
          pdfNotes,
          setPdfNotes,
          coverages,
          setCoverages,
        }}
      >
        <Box
          sx={{ display: "flex" }}
          onWheel={(e) => {
            handlePageChange(e.deltaY < 0 ? -1 : 1);
          }}
        >
          {/* ファイルツリー */}
          <OpenFileDrawer
            open={openLeftDrawer}
            onClose={() => {
              if (!pdf) return;
              setOpenLeftDrawer(false);
            }}
            onSelectPdfById={(id) => {
              setOpenLeftDrawer(false);
              if (pdfPath === id) return;
              setIsWaitingPdfNotes(true);
              setPdfNotes(undefined);
              setPDF(id);
              model
                .getPdfNotes(id)
                .then((result) => {
                  setPdfNotes(createOrGetPdfNotes(result));
                })
                .catch(() => {
                  setPdfNotes(undefined);
                })
                .finally(() => {
                  setIsWaitingPdfNotes(false);
                });
            }}
            onSelectPdfByFile={(file) => {
              setOpenLeftDrawer(false);
              const pdfPathNew = file.name;
              if (pdfPath === pdfPathNew || !pdfPathNew) return;
              setIsWaitingPDF(true);
              setIsWaitingPdfNotes(true);
              setPdfNotes(undefined);
              setPDF(pdf);
              // TODO
              setIsWaitingPdfNotes(false);
            }}
          />

          <PanelGroup direction="horizontal">
            {/* 目次 */}
            <Panel defaultSizePixels={270} minSizePixels={40}>
              <TocView
                openDrawer={openBottomDrawer}
                onCloseDrawer={() => {
                  setOpenBottomDrawer(false);
                }}
              />
            </Panel>

            {/* リサイズハンドル */}
            <PanelResizeHandle>
              <Box sx={{ width: 5, height: "100vh", background: grey[400] }} />
            </PanelResizeHandle>

            {/* PDFビュー */}
            <Panel minSizePixels={200}>
              <PdfView
                file={pdf}
                model={model}
                openDrawer={openBottomDrawer}
                onOpenFileTree={() => {
                  setOpenLeftDrawer(true);
                }}
                onOpenDrawer={() => {
                  setOpenBottomDrawer(!openBottomDrawer);
                }}
                onLoadError={() => {
                  setPDF(undefined);
                  setPageRatios(undefined);
                  setIsWaitingPDF(false);
                  setOpenLeftDrawer(true);
                }}
                onLoadSuccess={(pageRatios) => {
                  setPageRatios(pageRatios);
                  setIsWaitingPDF(false);
                  setOpenLeftDrawer(false);
                }}
              />
            </Panel>
          </PanelGroup>

          {/* 処理中プログレス表示 */}
          <Waiting isWaiting={isWaitingPDF || isWaitingPdfNotes} />

          {/* モックモデルを使用していることを示すポップアップ表示 */}
          {IS_MOCK && <SnackbarsMock open />}
        </Box>
      </PdfNotesContext.Provider>
    </AppSettingsContextProvider>
  );
}

export default App;
