import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import IModel from "@/models/IModel";
import Model from "./models/Model";
import ModelMock from "@/models/Model.Mock";
import { Progresses } from "@/types/Progresses";
import { Notes, createNewNotes, getPageLabelSmall } from "@/types/Notes";
import SnackbarsMock from "./components/Fullscreen/SnackbarMock";
import OpenFileDrawer from "./components/OpenFileDrawer";
import PDFView from "@/components/PDFView";
import Waiting from "@/components/Fullscreen/Waiting";
import TOCView from "@/components/TOCView";

const IS_MOCK = import.meta.env.VITE_IS_MOCK === "true";
const model: IModel = IS_MOCK ? new ModelMock() : new Model();

function App() {
  const [progresses, setProgresses] = useState<Progresses>();
  const [targetPDF, setTargetPDF] = useState<string>();
  const [notes, setNotes] = useState<Notes | null>(); // 読み込み失敗時にnull
  const [numPages, setNumPages] = useState<number>();

  const [openLeftDrawer, setOpenLeftDrawer] = useState(true);
  const [openBottomDrawer, setOpenBottomDrawer] = useState(false);
  const [isWaitingPDF, setIsWaitingPDF] = useState(false);
  const [isWaitingNotes, setIsWaitingNotes] = useState(false);

  // ページの遷移
  const handlePageChange = (delta: number) => {
    if (!notes) return;
    const newPage = Math.max(
      0,
      Math.min(notes.numPages - 1, notes.currentPage + delta)
    );
    if (notes.currentPage === newPage) return;
    setNotes({ ...notes, currentPage: newPage });
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

  // 始めて読み込むPDFの場合、`Notes`を生成する
  useEffect(() => {
    if (isWaitingPDF || isWaitingNotes) return;
    if (!numPages || !targetPDF) return;
    if (notes === undefined) return;

    if (notes === null) {
      setNotes(createNewNotes(targetPDF, numPages));
    } else if (notes.numPages !== numPages) {
      // 同じPDFでページ数が異なっている場合に対応する
      setNotes({ ...notes, numPages });
    }
  }, [isWaitingPDF, isWaitingNotes, numPages, notes, targetPDF]);

  return (
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
          if (!targetPDF) return;
          setOpenLeftDrawer(false);
        }}
        onSelect={(pdfPath) => {
          setOpenLeftDrawer(false);
          if (targetPDF === pdfPath) return;
          setIsWaitingPDF(true);
          setIsWaitingNotes(true);
          setNotes(undefined);
          setTargetPDF(pdfPath);
          model
            .getNotes(pdfPath)
            .then((notes) => {
              setNotes(notes);
            })
            .catch(() => {
              setNotes(null);
            })
            .finally(() => {
              setIsWaitingNotes(false);
            });
        }}
      />

      <PanelGroup direction="horizontal">
        {/* 目次 */}
        <Panel defaultSizePixels={270} minSizePixels={220}>
          <TOCView
            pdfPath={targetPDF}
            openDrawer={openBottomDrawer}
            notes={notes ?? undefined}
            onChanged={(notes) => {
              setNotes(notes);
            }}
          />
        </Panel>

        {/* リサイズハンドル */}
        <PanelResizeHandle>
          <Box sx={{ width: 5, height: "100vh", background: "silver" }} />
        </PanelResizeHandle>

        {/* PDFビュー */}
        <Panel minSizePixels={300}>
          <PDFView
            sx={{ flexGrow: 1 }}
            file={targetPDF}
            currentPage={notes?.currentPage}
            pageLabel={notes ? getPageLabelSmall(notes) : undefined}
            openDrawer={openBottomDrawer}
            onOpenFileTree={() => {
              setOpenLeftDrawer(true);
            }}
            onOpenDrawer={() => {
              setOpenBottomDrawer(!openBottomDrawer);
            }}
            onLoadError={() => {
              setTargetPDF(undefined);
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
      <Waiting isWaiting={isWaitingPDF || isWaitingNotes} />

      {/* モックモデルを使用していることを示すポップアップ表示 */}
      {IS_MOCK && <SnackbarsMock open />}
    </Box>
  );
}

export default App;
