import { useState } from "react";
import "./App.css";
import { Drawer } from "@mui/material";
import FileTreeView from "./components/FileTreeView";

function App() {
  const [open, setOpen] = useState(true);

  return (
    <>
      <Drawer
        anchor={"left"}
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <FileTreeView />
      </Drawer>
    </>
  );
}

export default App;
