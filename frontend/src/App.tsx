import { useEffect, useMemo, useState } from "react";
import { Box, Drawer } from "@mui/material";
import FileTreeView from "./components/FileTreeView";
import ModelMock from "./model/Model.Mock";
import { PDFsInfo } from "./types/PDFsInfo";
import PDFView from "./components/PDFView";
import TOCControl from "./components/TOCControl";
import Waiting from "./components/Waiting";

function App() {
  const [open, setOpen] = useState(true);
  const model = useMemo(() => new ModelMock(), []);
  const [pdfsInfo, setPDFsInfo] = useState<PDFsInfo>();
  const [selectedPDF, setSelectedPDF] = useState<string>();
  const [targetPDF, setTargetPDF] = useState<string>();
  const [isWaiting, setIsWaiting] = useState(false);

  useEffect(() => {
    setIsWaiting(true);
    model
      .getPDFsInfo()
      .then((pdfsInfo) => {
        setPDFsInfo(pdfsInfo);
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
      >
        {/* TODO ツリービューが2度目に開かれたときに、開閉状態を保存する */}
        {pdfsInfo && (
          <FileTreeView
            model={model}
            pdfsInfo={pdfsInfo}
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
      <Box
        sx={{
          width: 300,
          background: "whitesmoke",
          minWidth: 300,
          position: "relative",
          height: "100vh",
        }}
      >
        <TOCControl
          onOpenFileTree={() => {
            setOpen(true);
          }}
        />
      </Box>

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
