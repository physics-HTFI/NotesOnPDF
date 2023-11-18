import { useState } from "react";
import "./App.css";
import { Drawer } from "@mui/material";
import FileTreeView from "./components/FileTreeView";
import ModelMock from "./model/Model.mock";
import ModelContext from "./model/ModelContext";

function App() {
  const [open, setOpen] = useState(true);
  const model = new ModelMock();
  return (
    <>
      <ModelContext.Provider value={model}>
        <Drawer
          anchor={"left"}
          open={open}
          onClose={() => {
            setOpen(false);
          }}
        >
          <FileTreeView />
        </Drawer>
      </ModelContext.Provider>
    </>
  );
}

export default App;
