import { useEffect } from "react";
import { Group, Panel, Separator } from "react-resizable-panels";
import { Box, ThemeProvider, createTheme } from "@mui/material";
import { grey } from "@mui/material/colors";
import OpenFileDrawer from "@/components/statePDF選択/OpenFileDrawer";
import { MathJaxContext } from "better-react-mathjax";
import { Dialog起動直後 } from "./components/state起動直後/Dialog起動直後";
import { Alert } from "./components/global/Alert";
import { Waiting } from "./components/global/Waiting";
import TocView from "./components/statePDF閲覧編集/TocView/TocView";
import PdfView from "./components/statePDF閲覧編集/PdfView/PdfView";
import { Watch } from "./models/Watch/Watch";
import { ID_PDF_CONTAINER } from "./types/CONSTANTS";
import { queueRenderPage } from "./models/utils/usePdf/usePdf";

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
  return (
    <ThemeProvider theme={theme}>
      {/* フォルダ選択ダイアログ */}
      <Dialog起動直後 />

      <MathJaxContext version={4} config={mathjaxConfig}>
        <Box sx={{ userSelect: "none" }}>
          {/* ファイルツリー */}
          <OpenFileDrawer />

          <Group>
            {/* 目次 */}
            <Panel defaultSize={270} minSize={40}>
              <TocView />
            </Panel>

            {/* リサイズハンドル */}
            <Separator>
              <Box
                sx={{
                  width: 5,
                  height: "100vh",
                  background: grey[400],
                }}
              />
            </Separator>

            {/* PDFビュー */}
            <Panel minSize={200}>
              <Box id={ID_PDF_CONTAINER}>
                <PdfView />
              </Box>
            </Panel>
          </Group>
        </Box>
      </MathJaxContext>
      <Alert />
      <Waiting />

      <Watch />
      <DisableRightClick />
      <RenderWhenResize />
    </ThemeProvider>
  );
}

function DisableRightClick() {
  // 右クリックメニューを無効にする
  useEffect(() => {
    document.oncontextmenu = () => false;
    return () => {
      document.oncontextmenu = null;
    };
  }, []);
  return <></>;
}

function RenderWhenResize() {
  useEffect(() => {
    const elem = document.getElementById(ID_PDF_CONTAINER);
    if (!elem) return;
    const observer = new ResizeObserver(() => queueRenderPage());
    observer.observe(elem);
    return () => observer.disconnect();
  }, []);

  return <></>;
}
