import { useEffect } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Box } from "@mui/material";
import { grey } from "@mui/material/colors";
import SnackbarsMock from "@/components/Fullscreen/SnackbarMock";
import OpenFileDrawer from "@/components/OpenFileDrawer/OpenFileDrawer";
import PdfView from "@/components/PdfView/PdfView";
import TocView from "@/components/TocView/TocView";
import { PdfNotesContextProvider } from "./contexts/PdfNotesContext";
import { AppSettingsContextProvider } from "./contexts/AppSettingsContext";
import { UiStateContextProvider } from "./contexts/UiStateContext";

function App() {
  // 初回に1度だけ行う処理
  useEffect(() => {
    document.onselectstart = () => false;
    document.oncontextmenu = () => false;
    return () => {
      document.onselectstart = null;
      document.oncontextmenu = null;
    };
  }, []);

  return (
    <AppSettingsContextProvider>
      <UiStateContextProvider>
        <PdfNotesContextProvider>
          <Box>
            {/* ファイルツリー */}
            <OpenFileDrawer />

            <PanelGroup direction="horizontal">
              {/* 目次 */}
              <Panel defaultSizePixels={270} minSizePixels={40}>
                <TocView />
              </Panel>

              {/* リサイズハンドル */}
              <PanelResizeHandle>
                <Box
                  sx={{ width: 5, height: "100vh", background: grey[400] }}
                />
              </PanelResizeHandle>

              {/* PDFビュー */}
              <Panel minSizePixels={200}>
                <PdfView />
              </Panel>
            </PanelGroup>
          </Box>

          {/* モックモデルを使用していることを示すポップアップ表示 */}
          {import.meta.env.VITE_IS_MOCK === "true" && <SnackbarsMock />}
        </PdfNotesContextProvider>
      </UiStateContextProvider>
    </AppSettingsContextProvider>
  );
}

export default App;
