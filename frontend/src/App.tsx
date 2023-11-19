import { useEffect, useMemo, useState } from "react";
import { Box, Drawer, IconButton } from "@mui/material";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import FileTreeView from "./components/FileTreeView";
import ModelMock from "./model/Model.Mock";
import { PDFsInfo } from "./types/PDFsInfo";
import PDFView from "./components/PDFView";

function App() {
  const [open, setOpen] = useState(true);
  const model = useMemo(() => new ModelMock(), []);
  const [pdfsInfo, setPDFsInfo] = useState<PDFsInfo>();
  const [selectedPDF, setSelectedPDF] = useState<string>();
  const [targetPDF, setTargetPDF] = useState<string>();

  useEffect(() => {
    model
      .getPDFsInfo()
      .then((pdfsInfo) => {
        setPDFsInfo(pdfsInfo);
      })
      .catch(() => undefined);
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
        {pdfsInfo && (
          <FileTreeView
            model={model}
            pdfsInfo={pdfsInfo}
            onSelect={(pdfPath) => {
              setSelectedPDF(pdfPath);
              setOpen(false);
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
        }}
      >
        <IconButton
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            "&:focus": { outline: "none" },
          }}
          color="primary"
          onClick={() => {
            setOpen(true);
          }}
        >
          <FileOpenIcon />
        </IconButton>
      </Box>

      {/* PDFビュー */}
      <Box sx={{ flexGrow: 1 }}>
        <PDFView
          file={selectedPDF}
          onLoadSuccess={(pdfPath) => {
            setTargetPDF(pdfPath);
            setOpen(false);
          }}
        />
      </Box>
    </Box>
  );
}

export default App;
