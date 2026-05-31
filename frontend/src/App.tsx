import { useEffect, useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Box, ThemeProvider, createTheme } from "@mui/material";
import { grey } from "@mui/material/colors";
import OpenFileDrawer from "@/components/OpenFileDrawer/OpenFileDrawer";
import PdfView from "@/components/PdfView/PdfView";
import TocView from "@/components/TocView/TocView";
import { UiContextProvider } from "./contexts/UiContext";
import { MathJaxContext } from "better-react-mathjax";
import { MouseContextProvider } from "./contexts/MouseContext";
import SelectRootDialog from "./components/state起動直後/SelectRootDialog";
import { ModelContextProvider } from "./contexts/ModelContext/ModelContextProvider";
import { PdfNotesContextProvider } from "./contexts/PdfNotesContext/PdfNotesContextProvider";
import IsWritableDialog from "./components/state起動直後/IsWritableDialog";

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

/**
 * CSS変更
 */
const theme = createTheme({
  components: {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          maxWidth: "none",
        },
      },
    },
  },
});

export default function App() {
  const [isOpen_SelectRootDialog, setIsOpen_SelectRootDialog] = useState(true);
  const [isOpen_IsWritableDialog, setIsOpen_IsWritableDialog] = useState(true);

  // 右クリックメニューを無効にする
  useEffect(() => {
    document.oncontextmenu = () => false;
    return () => {
      document.oncontextmenu = null;
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <UiContextProvider>
        <ModelContextProvider>
          {import.meta.env.MODE === "web" && (
            <>
              <SelectRootDialog
                open={isOpen_SelectRootDialog}
                onClose={() => {
                  setIsOpen_SelectRootDialog(false);
                }}
              />
              <IsWritableDialog
                open={!isOpen_SelectRootDialog && isOpen_IsWritableDialog}
                onClose={() => {
                  setIsOpen_IsWritableDialog(false);
                }}
              />
            </>
          )}
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
    </ThemeProvider>
  );
}
