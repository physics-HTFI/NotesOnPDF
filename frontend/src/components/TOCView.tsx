import { FC, useContext } from "react";
import { Box, Drawer } from "@mui/material";
import { PdfInfo } from "@/types/PdfInfo";
import Settings from "./TOCView/Settings";
import getTOCData from "./TOCView/getTOCData";
import { PdfInfoContext } from "@/contexts/PdfInfoContext";
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
  const { pdfInfo, setPdfInfo } = useContext(PdfInfoContext);
  const handleChanged = (pdfInfo: PdfInfo) => {
    setPdfInfo?.(pdfInfo);
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
        {getTOCData(pdfInfo, handleChanged)}
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
