import { useEffect } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Box } from "@mui/material";
import { grey } from "@mui/material/colors";
import OpenFileDrawer from "@/components/OpenFileDrawer/OpenFileDrawer";
import PdfView from "@/components/PdfView/PdfView";
import TocView from "@/components/TocView/TocView";
import { UiContextProvider } from "./contexts/UiContext";
import { MathJaxContext } from "better-react-mathjax";
import { MouseContextProvider } from "./contexts/MouseContext";
import SelectRootDialog from "./components/dialogs/SelectRootDialog";
import { ModelContextProvider } from "./contexts/ModelContext/ModelContextProvider";
import { PdfNotesContextProvider } from "./contexts/PdfNotesContext/PdfNotesContextProvider";

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
    <UiContextProvider>
      <ModelContextProvider>
        {/* モックモデルを使用していることを示すポップアップ表示 */}
        {import.meta.env.MODE === "web" && <SelectRootDialog />}
        <MathJaxContext version={3} config={mathjaxConfig}>
          <PdfNotesContextProvider>
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
          </PdfNotesContextProvider>
        </MathJaxContext>
      </ModelContextProvider>
    </UiContextProvider>
  );
}
