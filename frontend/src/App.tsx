import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import IModel from "@/models/IModel";
import Model from "./models/Model";
import ModelMock from "@/models/Model.Mock";
import { Progresses } from "@/types/Progresses";
import { PdfInfo, createNewPdfInfo } from "@/types/PdfInfo";
import SnackbarsMock from "./components/Fullscreen/SnackbarMock";
import OpenFileDrawer from "./components/OpenFileDrawer";
import PDFView from "@/components/PDFView";
import Waiting from "@/components/Fullscreen/Waiting";
import TOCView from "@/components/TOCView";
import { PdfInfoContext } from "./contexts/PdfInfoContext";
import { grey } from "@mui/material/colors";

const IS_MOCK = import.meta.env.VITE_IS_MOCK === "true";
const model: IModel = IS_MOCK ? new ModelMock() : new Model();

function App() {
  const [progresses, setProgresses] = useState<Progresses>();
  const [pdf, setPDF] = useState<string | File>();
  const [pdfInfo, setPdfInfo] = useState<PdfInfo | null>(); // 読み込み失敗時にnull
  const [numPages, setNumPages] = useState<number>();
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
      Math.min(pdfInfo.numPages - 1, pdfInfo.currentPage + delta)
    );
    if (pdfInfo.currentPage === newPage) return;
    setPdfInfo({ ...pdfInfo, currentPage: newPage });
  };

  // ファイルツリーに表示する進捗情報の取得
  useEffect(() => {
    model
      .getProgresses()
      .then((progresses) => {
        setProgresses(progresses);
      })
      .catch(() => undefined);
  }, []);

  // 始めて読み込むPDFの場合、`PdfInfo`を生成する
  useEffect(() => {
    if (isWaitingPDF || isWaitingPdfInfo) return;
    if (!numPages || !pdf || !pdfPath) return;
    if (pdfInfo === undefined) return;

    if (pdfInfo === null) {
      setPdfInfo(createNewPdfInfo(pdfPath, numPages));
    } else if (pdfInfo.numPages !== numPages) {
      // 同じPDFでページ数が異なっている場合に対応する
      setPdfInfo({ ...pdfInfo, numPages });
    }
  }, [isWaitingPDF, isWaitingPdfInfo, numPages, pdfInfo, pdfPath, pdf]);

  return (
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
          progresses={progresses}
          open={openLeftDrawer}
          onClose={() => {
            if (!pdf) return;
            setOpenLeftDrawer(false);
          }}
          onSelect={(pdf) => {
            setOpenLeftDrawer(false);
            const pdfPathNew = pdf instanceof File ? pdf.name : pdf;
            if (pdfPath === pdfPathNew || !pdfPathNew) return;
            setIsWaitingPDF(true);
            setIsWaitingPdfInfo(true);
            setPdfInfo(undefined);
            setPDF(pdf);
            model
              .getPdfInfo(pdfPathNew)
              .then((pdfInfo) => {
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
              openDrawer={openBottomDrawer}
              onOpenFileTree={() => {
                setOpenLeftDrawer(true);
              }}
              onOpenDrawer={() => {
                setOpenBottomDrawer(!openBottomDrawer);
              }}
              onLoadError={() => {
                setPDF(undefined);
                setNumPages(undefined);
                setIsWaitingPDF(false);
                setOpenLeftDrawer(true);
              }}
              onLoadSuccess={(numPages) => {
                setNumPages(numPages);
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
  );
}

export default App;
