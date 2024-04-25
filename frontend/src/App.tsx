import { useContext, useEffect, useState } from "react";
import { Box } from "@mui/material";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { PdfNotes, createOrGetPdfNotes } from "@/types/PdfNotes";
import SnackbarsMock from "./components/Fullscreen/SnackbarMock";
import OpenFileDrawer from "./components/OpenFileDrawer";
import PdfView from "@/components/PdfView";
import Waiting from "@/components/Fullscreen/Waiting";
import TocView from "@/components/TocView";
import { PdfNotesContext } from "./contexts/PdfNotesContext";
import { grey } from "@mui/material/colors";
import { AppSettingsContextProvider } from "./contexts/AppSettingsContext";
import { ModelContext } from "./contexts/ModelContext";

const IS_MOCK = import.meta.env.VITE_IS_MOCK === "true";

function App() {
  const model = useContext(ModelContext);
  const [id, setId] = useState<string>();
  const [pdfNotes, setPdfNotes] = useState<PdfNotes>();
  const [openLeftDrawer, setOpenLeftDrawer] = useState(true);
  const [openBottomDrawer, setOpenBottomDrawer] = useState(false);
  const [isWaitingPDF, setIsWaitingPDF] = useState(false);
  const [isWaitingPdfNotes, setIsWaitingPdfNotes] = useState(false);

  // モック用
  const [file, setFile] = useState<File>();
  const [, setPageRatios] = useState<number[]>();

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
    return () => {
      document.onselectstart = null;
      document.oncontextmenu = null;
    };
  }, []);

  useEffect(() => {
    if (!pdfNotes || !id) return;
    model.putPdfNotes(id, pdfNotes).catch(() => undefined);
  }, [model, id, pdfNotes]);

  return (
    <AppSettingsContextProvider>
      <PdfNotesContext.Provider
        value={{
          id,
          pdfNotes,
          setPdfNotes,
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
            id={id}
            pdfNotes={pdfNotes}
            onClose={() => {
              if (!id) return;
              setOpenLeftDrawer(false);
            }}
            onSelectPdfById={(_id) => {
              setOpenLeftDrawer(false);
              if (_id === id) return;
              setIsWaitingPdfNotes(true);
              setPdfNotes(undefined);
              setId(_id);
              model
                .getPdfNotes(_id)
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
            onSelectPdfByFile={(_file) => {
              setOpenLeftDrawer(false);
              const pdfPathNew = _file.name;
              if (file?.name === pdfPathNew || !pdfPathNew) return;
              setIsWaitingPDF(true);
              setIsWaitingPdfNotes(true);
              setPdfNotes(undefined);
              setFile(_file);
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
                file={id}
                openDrawer={openBottomDrawer}
                onOpenFileTree={() => {
                  setOpenLeftDrawer(true);
                }}
                onOpenDrawer={() => {
                  setOpenBottomDrawer(!openBottomDrawer);
                }}
                onLoadError={() => {
                  setId(undefined);
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
