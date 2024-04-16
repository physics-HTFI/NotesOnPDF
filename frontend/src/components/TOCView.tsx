import { FC, useContext } from "react";
import { Box, Drawer } from "@mui/material";
import { PdfNotes } from "@/types/PdfNotes";
import Settings from "./TOCView/Settings";
import getTOCData from "./TOCView/getTOCData";
import { PdfNotesContext } from "@/contexts/PdfNotesContext";
import { grey } from "@mui/material/colors";

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
const TOCView: FC<Props> = ({ openDrawer, onCloseDrawer }) => {
  const { pdfNotes, setPdfNotes } = useContext(PdfNotesContext);
  const handleChanged = (pdfNotes: PdfNotes) => {
    setPdfNotes?.(pdfNotes);
  };

  return (
    <Box
      sx={{
        background: grey[100],
        position: "relative",
        height: "100vh",
        overflowWrap: "break-word",
        overflow: "hidden",
        fontSize: "70%",
      }}
    >
      <Box sx={{ p: 0.5, lineHeight: 1 }}>
        {getTOCData(pdfNotes, handleChanged)}
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
            overflow: "visible", // 「閉じるアイコン」を表示する
          },
        }}
        onWheel={(e) => {
          e.stopPropagation();
        }}
      >
        <Settings onClose={onCloseDrawer} />
      </Drawer>
    </Box>
  );
};

export default TOCView;
