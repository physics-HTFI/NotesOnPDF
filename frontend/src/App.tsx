import { useEffect, useState } from "react";
import { Box, Drawer } from "@mui/material";
import FileTreeView from "@/components/FileTreeView";
import ModelMock from "@/models/Model.Mock";
import { Progresses } from "@/types/Progresses";
import PDFView from "@/components/PDFView";
import Waiting from "@/components/Waiting";
import TOCView from "@/components/TOCView";
import { Notes, createNewNotes, getPageLabel } from "@/types/Notes";
import IModel from "@/models/IModel";
import SnackbarsMock from "./components/SnackbarMock";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

const IS_MOCK = import.meta.env.VITE_IS_MOCK === "true";
const model: IModel | undefined = IS_MOCK ? new ModelMock() : undefined;

function App() {
  const [progresses, setProgresses] = useState<Progresses>();
  const [selectedPDF, setSelectedPDF] = useState<string>();
  const [targetPDF, setTargetPDF] = useState<string>();
  const [notes, setNotes] = useState<Notes | null>(); // 読み込み失敗時にnull
  const [numPages, setNumPages] = useState<number>();

  const [drawerOpen, setDrawerOpen] = useState(true);
  const [isWaitingInit, setIsWaitingInit] = useState(false);
  const [isWaitingRead, setIsWaitingRead] = useState(false);
  const [isWaitingNotes, setIsWaitingNotes] = useState(false);

  // ページの遷移
  const handlePageChange = (pageNum: number) => {
    if (!notes) return;
    const newPage = Math.max(0, Math.min(notes.numPages - 1, pageNum));
    if (notes.currentPage === newPage) return;
    setNotes({ ...notes, currentPage: newPage });
  };

  // ファイルツリーに表示する進捗情報の取得
  useEffect(() => {
    setIsWaitingInit(true);
    model
      ?.getProgresses()
      .then((progresses) => {
        setProgresses(progresses);
      })
      .catch(() => undefined)
      .finally(() => {
        setIsWaitingInit(false);
      });
  }, []);

  // 始めて読み込むPDFの場合、`Notes`を生成する
  useEffect(() => {
    if (isWaitingRead || isWaitingNotes) return;
    if (!numPages || !targetPDF) return;
    if (notes === undefined) return;

    if (notes === null) {
      setNotes(createNewNotes(targetPDF, numPages));
    } else if (notes.numPages !== numPages) {
      // 同じPDFでページ数が異なっている場合に対応する
      setNotes({ ...notes, numPages });
    }
  }, [isWaitingRead, isWaitingNotes, numPages, notes, targetPDF]);

  return (
    <Box sx={{ display: "flex" }}>
      {/* ファイルツリー */}
      <Drawer
        anchor={"left"}
        open={drawerOpen}
        onClose={() => {
          if (!targetPDF) return;
          setDrawerOpen(false);
        }}
        PaperProps={{ square: false, sx: { borderRadius: "0 5px 5px 0" } }}
      >
        {/* TODO ツリービューが2度目に開かれたときに、開閉状態を保存する */}
        {progresses && (
          <FileTreeView
            model={model}
            Progresses={progresses}
            onSelect={(pdfPath) => {
              setDrawerOpen(false);
              if (selectedPDF === pdfPath) return;

              setIsWaitingRead(true);
              setTargetPDF(undefined);
              setNumPages(undefined);
              setSelectedPDF(pdfPath);

              setIsWaitingNotes(true);
              setNotes(undefined);
              model
                ?.getNotes(pdfPath)
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
        )}
      </Drawer>
      <PanelGroup direction="horizontal">
        {/* 目次 */}
        <Panel defaultSizePercentage={30} minSizePercentage={20}>
          <TOCView
            pdfPath={targetPDF}
            notes={notes ?? undefined}
            onOpenFileTree={() => {
              setDrawerOpen(true);
            }}
            onChanged={(notes) => {
              setNotes({ ...notes });
            }}
            onPageChange={handlePageChange}
          />
        </Panel>
        {/* リサイズハンドル */}
        <PanelResizeHandle>
          <Box sx={{ width: 5, height: "100vh", background: "silver" }} />
        </PanelResizeHandle>
        {/* PDFビュー */}
        <Panel defaultSizePercentage={70} minSizePercentage={50}>
          <PDFView
            sx={{ flexGrow: 1 }}
            file={selectedPDF}
            currentPage={notes?.currentPage}
            pageLabel={notes ? getPageLabel(notes) : undefined}
            onPageChange={handlePageChange}
            onLoadError={() => {
              setIsWaitingRead(false);
              setDrawerOpen(true);
            }}
            onLoadSuccess={(pdfPath, numPages) => {
              setTargetPDF(pdfPath);
              setNumPages(numPages);
              setIsWaitingRead(false);
              setDrawerOpen(false);
            }}
          />
        </Panel>
      </PanelGroup>
      {/* 処理中プログレス表示 */}
      <Waiting isWaiting={isWaitingInit || isWaitingRead || isWaitingNotes} />

      {/* モックモデルを使用していることを示すポップアップ表示 */}
      {IS_MOCK && <SnackbarsMock open />}
    </Box>
  );
}

export default App;
