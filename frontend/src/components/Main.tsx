import { useContext, useState } from "react";
import { Box } from "@mui/material";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import OpenFileDrawer from "@/components/OpenFileDrawer/OpenFileDrawer";
import PdfView from "@/components/PdfView/PdfView";
import TocView from "@/components/TocView/TocView";
import { grey } from "@mui/material/colors";
import { WaitContext } from "@/contexts/WaitContext";
import { PdfNotesContext } from "@/contexts/PdfNotesContext";
import usePdfNotes from "@/hooks/usePdfNotes";

const IS_MOCK = import.meta.env.VITE_IS_MOCK === "true";

function Main() {
  const { setWaiting } = useContext(WaitContext);
  const { id, setId } = useContext(PdfNotesContext);
  const [openLeftDrawer, setOpenLeftDrawer] = useState(true);
  const [openBottomDrawer, setOpenBottomDrawer] = useState(false);
  const { changePage } = usePdfNotes();

  // モック用
  const [, setPageRatios] = useState<number[]>();

  return (
    <Box
      sx={{ display: "flex" }}
      onWheel={(e) => {
        changePage(e.deltaY < 0 ? -1 : 1);
      }}
    >
      {/* ファイルツリー */}
      <OpenFileDrawer
        open={openLeftDrawer}
        onClose={() => {
          if (!id) return;
          setOpenLeftDrawer(false);
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
              setWaiting(false);
              setOpenLeftDrawer(true);
            }}
            onLoadSuccess={(pageRatios) => {
              setPageRatios(pageRatios);
              setWaiting(false);
              setOpenLeftDrawer(false);
            }}
          />
        </Panel>
      </PanelGroup>
    </Box>
  );
}

export default Main;
