import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import IModel from "@/models/IModel";
import Model from "./models/Model";
import ModelMock from "@/models/Model.Mock";
import { Progresses } from "@/types/Progresses";
import { Notes, createNewNotes } from "@/types/Notes";
import SnackbarsMock from "./components/Fullscreen/SnackbarMock";
import OpenFileDrawer from "./components/OpenFileDrawer";
import PDFView from "@/components/PDFView";
import Waiting from "@/components/Fullscreen/Waiting";
import TOCView from "@/components/TOCView";

const IS_MOCK = import.meta.env.VITE_IS_MOCK === "true";
const model: IModel = IS_MOCK ? new ModelMock() : new Model();

function App() {
  const [progresses, setProgresses] = useState<Progresses>();
  const [pdf, setPDF] = useState<string | File>();
  const [notes, setNotes] = useState<Notes | null>(); // 読み込み失敗時にnull
  const [numPages, setNumPages] = useState<number>();
  const pdfPath = pdf && (pdf instanceof File ? pdf.name : pdf);

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
    if (!numPages || !pdf || !pdfPath) return;
    if (notes === undefined) return;

    if (notes === null) {
      setNotes(createNewNotes(pdfPath, numPages));
    } else if (notes.numPages !== numPages) {
      // 同じPDFでページ数が異なっている場合に対応する
      setNotes({ ...notes, numPages });
    }
  }, [isWaitingPDF, isWaitingNotes, numPages, notes, pdfPath, pdf]);

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
          if (!pdf) return;
          setOpenLeftDrawer(false);
        }}
        onSelect={(pdf) => {
          setOpenLeftDrawer(false);
          const pdfPathNew = pdf instanceof File ? pdf.name : pdf;
          if (pdfPath === pdfPathNew || !pdfPathNew) return;
          setIsWaitingPDF(true);
          setIsWaitingNotes(true);
          setNotes(undefined);
          setPDF(pdf);
          model
            .getNotes(pdfPathNew)
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
        <Panel defaultSizePixels={270} minSizePixels={240}>
          <TOCView
            pdfPath={pdfPath}
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
            file={pdf}
            currentPage={notes?.currentPage}
            notes={notes ?? undefined}
            settings={notes?.settings}
            openDrawer={openBottomDrawer}
            onOpenFileTree={() => {
              setOpenLeftDrawer(true);
            }}
            onOpenDrawer={() => {
              setOpenBottomDrawer(!openBottomDrawer);
            }}
            onLoadError={() => {
              setPDF(undefined);
              setNumPages(undefined);
              setIsWaitingPDF(false);
              setOpenLeftDrawer(true);
            }}
            onLoadSuccess={(numPages) => {
              setNumPages(numPages);
              setIsWaitingPDF(false);
              setOpenLeftDrawer(false);
            }}
            onNotesChanged={(notes) => {
              setNotes(notes);
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
