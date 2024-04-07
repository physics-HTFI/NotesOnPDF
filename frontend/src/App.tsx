import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import IModel from "@/models/IModel";
import Model from "./models/Model";
import ModelMock from "@/models/Model.Mock";
import { Coverages } from "@/types/Coverages";
import { PdfInfo } from "@/types/PdfInfo";
import SnackbarsMock from "./components/Fullscreen/SnackbarMock";
import OpenFileDrawer from "./components/OpenFileDrawer";
import PDFView from "@/components/PDFView";
import Waiting from "@/components/Fullscreen/Waiting";
import TOCView from "@/components/TOCView";
import { PdfInfoContext } from "./contexts/PdfInfoContext";
import { grey } from "@mui/material/colors";
import { AppSettingsContext } from "./contexts/AppSettingsContext";
import { AppSettings } from "./types/AppSettings";

const IS_MOCK = import.meta.env.VITE_IS_MOCK === "true";
const model: IModel = IS_MOCK ? new ModelMock() : new Model();

function App() {
  const [appSettings, setAppSettings] = useState<AppSettings>();
  const [coverages, setCoverages] = useState<Coverages>();
  const [pdf, setPDF] = useState<string | File>();
  const [pdfInfo, setPdfInfo] = useState<PdfInfo | null>(); // 読み込み失敗時にnull
  const [pageRatios, setPageRatios] = useState<number[]>();
  const pdfPath = pdf && (pdf instanceof File ? pdf.name : pdf);

  const [openLeftDrawer, setOpenLeftDrawer] = useState(true);
  const [openBottomDrawer, setOpenBottomDrawer] = useState(false);
  const [isWaitingPDF, setIsWaitingPDF] = useState(false);
  const [isWaitingPdfInfo, setIsWaitingPdfInfo] = useState(false);

  // ページの遷移
  const handlePageChange = (delta: number) => {
    if (!pdfInfo) return;
    const newPage = Math.max(
      0,
      Math.min(pdfInfo.pages.length - 1, pdfInfo.currentPage + delta)
    );
    if (pdfInfo.currentPage === newPage) return;
    setPdfInfo({ ...pdfInfo, currentPage: newPage });
  };

  // クリック系のイベントを無効にする
  useEffect(() => {
    document.onselectstart = () => false;
    document.oncontextmenu = () => false;
  }, []);

  // ファイルツリーに表示する進捗情報の取得
  useEffect(() => {
    document.onselectstart = () => false;
    document.oncontextmenu = () => false;
    model
      .getCoverages()
      .then((coverages) => {
        setCoverages(coverages);
      })
      .catch(() => undefined);
    model
      .getAppSettings()
      .then((settings) => {
        setAppSettings(settings);
      })
      .catch(() => undefined);
  }, []);

  // 進捗の更新
  useEffect(() => {
    if (!coverages || !pdfPath || !pdfInfo) return;
    // TODO ページを切り替えるだけで更新されている
    coverages.PDFs[pdfPath] = {
      allPages: pdfInfo.pages.length,
      enabledPages:
        pdfInfo.pages.length -
        Object.keys(pdfInfo.pages).filter((key) =>
          pdfInfo.pages[Number(key)]?.style?.includes("excluded")
        ).length,
      notedPages: Object.keys(pdfInfo.pages).filter(
        (key) =>
          (pdfInfo.pages[Number(key)]?.style?.includes("excluded")
            ? 0
            : pdfInfo.pages[Number(key)]?.notes?.length ?? 0) > 0
      ).length,
    };
    model.putCoverages(coverages).catch(() => undefined);
  }, [pdfInfo, coverages, pdfPath]);
  useEffect(() => {
    if (!appSettings) return;
    model.putAppSettings(appSettings).catch(() => undefined);
  }, [appSettings]);
  useEffect(() => {
    if (!pdfInfo || !pdfPath) return;
    model.putPdfInfo(pdfPath, pdfInfo).catch(() => undefined);
  }, [pdfPath, pdfInfo]);

  // 始めて読み込むPDFの場合、`PdfInfo`を生成する
  useEffect(() => {
    if (isWaitingPDF || isWaitingPdfInfo) return;
    if (!pageRatios || !pdf || !pdfPath) return;
    if (pdfInfo === undefined) return;
    /*
    if (pdfInfo === null) {
      setPdfInfo(createNewPdfInfo(pageRatios));
    } else if (pdfInfo.pages.length !== pageRatios.length) {
      // 同じPDFでページ数が異なっている場合に対応する
      setPdfInfo({ ...pdfInfo });
    }
    */
  }, [isWaitingPDF, isWaitingPdfInfo, pageRatios, pdfInfo, pdfPath, pdf]);

  return (
    <AppSettingsContext.Provider value={{ appSettings, setAppSettings }}>
      <PdfInfoContext.Provider
        value={{ pdfInfo: pdfInfo ?? undefined, setPdfInfo, pdfPath }}
      >
        <Box
          sx={{ display: "flex" }}
          onWheel={(e) => {
            handlePageChange(e.deltaY < 0 ? -1 : 1);
          }}
        >
          {/* ファイルツリー */}
          <OpenFileDrawer
            model={model}
            coverages={coverages}
            open={openLeftDrawer}
            onClose={() => {
              if (!pdf) return;
              setOpenLeftDrawer(false);
            }}
            onSelect={(pdf, path) => {
              setOpenLeftDrawer(false);
              const pdfPathNew = pdf instanceof File ? pdf.name : pdf;
              if (pdfPath === pdfPathNew || !pdfPathNew) return;
              setIsWaitingPDF(true);
              setIsWaitingPdfInfo(true);
              setPdfInfo(undefined);
              setPDF(pdf);
              if (coverages)
                setCoverages({ ...coverages, recentPath: pdfPathNew });
              model
                .getPdfInfo(pdfPathNew)
                .then((pdfInfo) => {
                  // 初回生成時にタイトルを設定する
                  if (
                    pdfInfo?.pages.every((p) => Object.keys(p).length === 2)
                  ) {
                    if (pdfInfo.pages[0] !== undefined) {
                      pdfInfo.pages[0].book =
                        path.match(/[^\\/]+(?=\.[^.]+$)/)?.[0] ?? undefined;
                    }
                  }
                  setPdfInfo(pdfInfo);
                })
                .catch(() => {
                  setPdfInfo(null);
                })
                .finally(() => {
                  setIsWaitingPdfInfo(false);
                });
            }}
          />

          <PanelGroup direction="horizontal">
            {/* 目次 */}
            <Panel defaultSizePixels={270} minSizePixels={40}>
              <TOCView
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
              <PDFView
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
          <Waiting isWaiting={isWaitingPDF || isWaitingPdfInfo} />

          {/* モックモデルを使用していることを示すポップアップ表示 */}
          {IS_MOCK && <SnackbarsMock open />}
        </Box>
      </PdfInfoContext.Provider>
    </AppSettingsContext.Provider>
  );
}

export default App;
