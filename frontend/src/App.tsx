import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { Drawer } from "@mui/material";
import FileTreeView from "./components/FileTreeView";
import ModelMock from "./model/Model.Mock";
import { PDFsInfo } from "./types/PDFsInfo";

function App() {
  const [open, setOpen] = useState(true);
  const model = useMemo(() => new ModelMock(), []);
  const [pdfsInfo, setPDFsInfo] = useState<PDFsInfo>();
  const [openedPDF] = useState<string>();

  useEffect(() => {
    model
      .getPDFsInfo()
      .then((pdfsInfo) => {
        setPDFsInfo(pdfsInfo);
      })
      .catch(() => undefined);
  }, [model]);

  return (
    <>
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
            onSelect={(path) => {
              // TODO
              console.log(path);
            }}
          />
        )}
      </Drawer>
    </>
  );
}

export default App;
