import { useEffect, useMemo, useState } from "react";
import { Box, Drawer } from "@mui/material";
import FileTreeView from "./components/FileTreeView";
import ModelMock from "./model/Model.Mock";
import { Progresses } from "./types/Progresses";
import PDFView from "./components/PDFView";
import Waiting from "./components/Waiting";
import TOC from "./components/TOC";

function App() {
  const [open, setOpen] = useState(true);
  const model = useMemo(() => new ModelMock(), []);
  const [Progresses, setProgresses] = useState<Progresses>();
  const [selectedPDF, setSelectedPDF] = useState<string>();
  const [targetPDF, setTargetPDF] = useState<string>();
  const [isWaiting, setIsWaiting] = useState(false);

  useEffect(() => {
    setIsWaiting(true);
    model
      .getProgresses()
      .then((Progresses) => {
        setProgresses(Progresses);
      })
      .catch(() => undefined)
      .finally(() => {
        setIsWaiting(false);
      });
  }, [model]);

  return (
    <Box sx={{ display: "flex" }}>
      {/* ファイルツリー */}
      <Drawer
        anchor={"left"}
        open={open}
        onClose={() => {
          if (!targetPDF) return;
          setOpen(false);
        }}
        PaperProps={{ square: false, sx: { borderRadius: "0 10px 10px 0" } }}
      >
        {/* TODO ツリービューが2度目に開かれたときに、開閉状態を保存する */}
        {Progresses && (
          <FileTreeView
            model={model}
            Progresses={Progresses}
            onSelect={(pdfPath) => {
              setOpen(false);
              if (selectedPDF === pdfPath) return;
              setSelectedPDF(pdfPath);
              setIsWaiting(true);
            }}
          />
        )}
      </Drawer>

      {/* 目次 */}
      <TOC
        onOpenFileTree={() => {
          setOpen(true);
        }}
      />

      {/* PDFビュー */}
      <PDFView
        sx={{ flexGrow: 1 }}
        file={selectedPDF}
        onLoadError={() => {
          setIsWaiting(false);
        }}
        onLoadSuccess={(pdfPath) => {
          setTargetPDF(pdfPath);
          setOpen(false);
          setIsWaiting(false);
        }}
      />

      {/* 処理中プログレス表示 */}
      <Waiting isWaiting={isWaiting} />
    </Box>
  );
}

export default App;
