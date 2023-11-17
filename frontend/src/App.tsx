import { useState } from "react";
import "./App.css";
import { Drawer } from "@mui/material";
import FileTree from "./components/FileTree";

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
        <FileTree />
      </Drawer>
    </>
  );
}

export default App;
