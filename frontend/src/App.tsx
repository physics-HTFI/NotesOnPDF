import { useEffect, useMemo, useState } from "react";
import { Box, Drawer } from "@mui/material";
import FileTreeView from "./components/FileTreeView";
import ModelMock from "./model/Model.Mock";
import { PDFsInfo } from "./types/PDFsInfo";
import PDFView from "./components/PDFView";

function App() {
  const [open, setOpen] = useState(true);
  const model = useMemo(() => new ModelMock(), []);
  const [pdfsInfo, setPDFsInfo] = useState<PDFsInfo>();
  const [openedPDF, setOpenedPDF] = useState<string>();

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
      <Drawer
        anchor={"left"}
        open={open}
        onClose={() => {
          if (!openedPDF) return;
          setOpen(false);
        }}
      >
        {pdfsInfo && (
          <FileTreeView
            model={model}
            pdfsInfo={pdfsInfo}
            onSelect={(pdfPath) => {
              setOpenedPDF(pdfPath);
              setOpen(false);
            }}
          />
        )}
      </Drawer>
      <Box sx={{ width: 300, background: "whitesmoke", minWidth: 300 }} />
      <Box sx={{ flexGrow: 1, background: "gray" }}>
        <PDFView />
      </Box>
    </Box>
  );
}

export default App;
