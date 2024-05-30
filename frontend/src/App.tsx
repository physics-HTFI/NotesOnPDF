import { useEffect } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Box } from "@mui/material";
import { grey } from "@mui/material/colors";
import OpenFileDrawer from "@/components/OpenFileDrawer/OpenFileDrawer";
import PdfView from "@/components/PdfView/PdfView";
import TocView from "@/components/TocView/TocView";
import { PdfNotesContextProvider } from "./contexts/PdfNotesContext";
import { AppSettingsContextProvider } from "./contexts/AppSettingsContext";
import { UiStateContextProvider } from "./contexts/UiStateContext";
import { MathJaxContext } from "better-react-mathjax";
import { MouseContextProvider } from "./contexts/MouseContext";
import { FileTreeContextProvider } from "./contexts/FileTreeContext";
import SelectRootDialog from "./components/Fullscreen/SelectRootDialog";
import { ModelContextProvider } from "./contexts/ModelContext";
import ServerSideEvents from "./components/Fullscreen/ServerSideEvents";

/**
 * 数式表示のコンフィグ
 */
const mathjaxConfig = {
  loader: {
    load: [
      "[tex]/html",
      "[tex]/boldsymbol",
      //"[tex]/ams", // エラーになる"No version information available for component [tex]/ams"
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

export default function App() {
  // 右クリックメニューを無効にする
  useEffect(() => {
    document.oncontextmenu = () => false;
    return () => {
      document.oncontextmenu = null;
    };
  }, []);

  return (
    <ModelContextProvider>
      <UiStateContextProvider>
        {/* モックモデルを使用していることを示すポップアップ表示 */}
        {import.meta.env.VITE_IS_WEB === "true" && <SelectRootDialog />}
        <AppSettingsContextProvider>
          <MathJaxContext version={3} config={mathjaxConfig}>
            <PdfNotesContextProvider>
              <FileTreeContextProvider>
                <Box sx={{ userSelect: "none" }}>
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
                        sx={{
                          width: 5,
                          height: "100vh",
                          background: grey[400],
                        }}
                      />
                    </PanelResizeHandle>

                    {/* PDFビュー */}
                    <Panel minSizePixels={200}>
                      <MouseContextProvider>
                        <PdfView />
                      </MouseContextProvider>
                    </Panel>
                  </PanelGroup>
                </Box>
                <ServerSideEvents />
              </FileTreeContextProvider>
            </PdfNotesContextProvider>
          </MathJaxContext>
        </AppSettingsContextProvider>
      </UiStateContextProvider>
    </ModelContextProvider>
  );
}
