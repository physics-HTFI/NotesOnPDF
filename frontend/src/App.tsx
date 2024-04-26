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
import { MathJaxContext } from "better-react-mathjax";

/**
 * 数式表示のコンフィグ
 */
const mathjaxConfig = {
  loader: {
    load: [
      "[tex]/html",
      "[tex]/boldsymbol",
      "[tex]/ams",
      "[tex]/braket",
      "[tex]/cancel",
      "[tex]/cases",
      "[tex]/color",
      //"[tex]/physics", // Mathjaxは対応していないが、physics2というのがあるらしい: https://qiita.com/Yarakashi_Kikohshi/items/131e2324f401c3effb84
    ],
  },
  tex: {
    packages: {
      "[+]": [
        "html",
        "boldsymbol",
        "ams",
        "braket",
        "cancel",
        "cases",
        "color",
        //"physics",
      ],
    },
    inlineMath: [
      ["$", "$"],
      ["\\(", "\\)"],
    ],
    displayMath: [
      ["$$", "$$"],
      ["\\[", "\\]"],
    ],
  },
  options: {
    enableMenu: false,
  },
};

function App() {
  // ドラッグでの選択と右クリックメニューを無効にする
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
          <MathJaxContext version={3} config={mathjaxConfig}>
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
          </MathJaxContext>
        </PdfNotesContextProvider>
      </UiStateContextProvider>
    </AppSettingsContextProvider>
  );
}

export default App;
