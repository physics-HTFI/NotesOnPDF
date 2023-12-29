import React, { useContext } from "react";
import { Box, Drawer, IconButton } from "@mui/material";
import { Notes } from "@/types/Notes";
import Settings from "./TOCView/Settings";
import getTOCData from "./TOCView/getTOCData";
import { NotesContext } from "@/contexts/NotesContext";
import { ExpandMore } from "@mui/icons-material";

/**
 * `TOCView`の引数
 */
interface Props {
  openDrawer: boolean;
  onCloseDrawer: () => void;
}

/**
 * 目次を表示するコンポーネント
 */
const TOCView: React.FC<Props> = ({ openDrawer, onCloseDrawer }) => {
  const { notes, setNotes } = useContext(NotesContext);
  const handleChanged = (notes: Notes) => {
    setNotes?.(notes);
  };

  return (
    <Box
      sx={{
        background: "whitesmoke",
        position: "relative",
        height: "100vh",
        overflowWrap: "break-word",
        overflow: "hidden",
        fontSize: "70%",
      }}
    >
      <Box sx={{ p: 0.5, lineHeight: 1 }}>
        {getTOCData(notes, handleChanged)}
      </Box>

      <Drawer
        variant="persistent"
        anchor="bottom"
        open={openDrawer}
        PaperProps={{
          square: false,
          sx: {
            position: "absolute",
            borderRadius: "10px 10px 0 0",
            overflow: "visible",
          },
        }}
        onWheel={(e) => {
          e.stopPropagation();
        }}
      >
        <Settings />
        <IconButton
          sx={{
            position: "absolute",
            right: 0,
            top: "-35px",
          }}
          onClick={onCloseDrawer}
          size="small"
        >
          <ExpandMore />
        </IconButton>
      </Drawer>
    </Box>
  );
};

export default TOCView;
