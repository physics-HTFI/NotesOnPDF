import { useEffect, useMemo, useState } from "react";
import { Box, Drawer } from "@mui/material";
import FileTreeView from "./components/FileTreeView";
import ModelMock from "./model/Model.Mock";
import { Progresses } from "./types/Progresses";
import PDFView from "./components/PDFView";
import Waiting from "./components/Waiting";
import TOCView from "./components/TOCView";
import { Notes, createNewNotes, getPageLabel } from "./types/Notes";
import IModel from "./model/IModel";

function App() {
  const model: IModel = useMemo(() => new ModelMock(), []);
  const [progresses, setProgresses] = useState<Progresses>();
  const [selectedPDF, setSelectedPDF] = useState<string>();
  const [targetPDF, setTargetPDF] = useState<string>();
  const [notes, setNotes] = useState<Notes | null>(); // 読み込み失敗時にnull
  const [numPages, setNumPages] = useState<number>();

  const [drawerOpen, setDrawerOpen] = useState(true);
  const [isWaitingInit, setIsWaitingInit] = useState(false);
  const [isWaitingRead, setIsWaitingRead] = useState(false);
  const [isWaitingNotes, setIsWaitingNotes] = useState(false);

  // ファイルツリーに表示する進捗情報の取得
  useEffect(() => {
    setIsWaitingInit(true);
    model
      .getProgresses()
      .then((progresses) => {
        setProgresses(progresses);
      })
      .catch(() => undefined)
      .finally(() => {
        setIsWaitingInit(false);
      });
  }, [model]);

  // 始めて読み込むPDFの場合、`Notes`を生成する
  useEffect(() => {
    if (
      !isWaitingRead &&
      !isWaitingNotes &&
      numPages &&
      targetPDF &&
      notes === null
    ) {
      setNotes(createNewNotes(targetPDF, numPages));
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
        PaperProps={{ square: false, sx: { borderRadius: "0 10px 10px 0" } }}
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
        )}
      </Drawer>
      {/* 目次 */}
      <TOCView
        notes={notes ?? undefined}
        onOpenFileTree={() => {
          setDrawerOpen(true);
        }}
        onChanged={(notes) => {
          setNotes({ ...notes });
        }}
      />
      {/* PDFビュー */}
      <PDFView
        sx={{ flexGrow: 1 }}
        file={selectedPDF}
        currentPage={notes?.currentPage}
        pageLabel={notes ? getPageLabel(notes) : undefined}
        onPageChanged={(pageNum) => {
          if (!notes) return;
          const newPage = Math.max(0, Math.min(notes.numPages - 1, pageNum));
          if (notes.currentPage === newPage) return;
          notes.currentPage = newPage;
          setNotes({ ...notes });
        }}
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
      {/* 処理中プログレス表示 */}
      <Waiting isWaiting={isWaitingInit || isWaitingRead || isWaitingNotes} />
    </Box>
  );
}

export default App;
