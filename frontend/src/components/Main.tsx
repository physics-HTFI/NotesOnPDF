import { useContext, useState } from "react";
import { Box } from "@mui/material";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import OpenFileDrawer from "@/components/OpenFileDrawer/OpenFileDrawer";
import PdfView from "@/components/PdfView/PdfView";
import TocView from "@/components/TocView/TocView";
import { grey } from "@mui/material/colors";
import { UiStateContext } from "@/contexts/UiStateContext";
import { PdfNotesContext } from "@/contexts/PdfNotesContext";
import usePdfNotes from "@/hooks/usePdfNotes";

function Main() {
  const {
    setWaiting,
    setOpenFileTreeDrawer,
    openSettingsDrawer,
    setOpenSettingsDrawer,
  } = useContext(UiStateContext);
  const { id, setId } = useContext(PdfNotesContext);
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
      <OpenFileDrawer />

      <PanelGroup direction="horizontal">
        {/* 目次 */}
        <Panel defaultSizePixels={270} minSizePixels={40}>
          <TocView />
        </Panel>

        {/* リサイズハンドル */}
        <PanelResizeHandle>
          <Box sx={{ width: 5, height: "100vh", background: grey[400] }} />
        </PanelResizeHandle>

        {/* PDFビュー */}
        <Panel minSizePixels={200}>
          <PdfView
            file={id}
            openDrawer={openSettingsDrawer}
            onOpenFileTree={() => {
              setOpenFileTreeDrawer(true);
            }}
            onOpenDrawer={() => {
              setOpenSettingsDrawer(!openSettingsDrawer);
            }}
            onLoadError={() => {
              setId(undefined);
              setPageRatios(undefined);
              setWaiting(false);
              setOpenFileTreeDrawer(true);
            }}
            onLoadSuccess={(pageRatios) => {
              setPageRatios(pageRatios);
              setWaiting(false);
              setOpenFileTreeDrawer(false);
            }}
          />
        </Panel>
      </PanelGroup>
    </Box>
  );
}

export default Main;
