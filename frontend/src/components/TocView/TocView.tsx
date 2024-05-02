import { FC, useContext } from "react";
import { Box, Drawer } from "@mui/material";
import Settings from "./Settings/Settings";
import { PdfNotesContext } from "@/contexts/PdfNotesContext";
import { grey } from "@mui/material/colors";
import { UiStateContext } from "@/contexts/UiStateContext";
import { MathJax } from "better-react-mathjax";
import ToC from "./Toc";

/**
 * 目次を表示するコンポーネント
 */
const TocView: FC = () => {
  const { pdfNotes, setPdfNotes } = useContext(PdfNotesContext);
  const { openSettingsDrawer, setOpenSettingsDrawer } =
    useContext(UiStateContext);

  return (
    <Box
      sx={{
        background: grey[100],
        position: "relative",
        height: "100vh",
        overflowWrap: "break-word",
        fontSize: "70%",
      }}
    >
      <MathJax hideUntilTypeset={"first"}>
        <Box
          sx={{
            p: 0.5,
            lineHeight: 1,
            overflowY: "auto",
            overflowX: "hidden",
            height: "100vh",
            boxSizing: "border-box",
          }}
        >
          <ToC pdfNotes={pdfNotes} onChanged={setPdfNotes} />
        </Box>
      </MathJax>

      <Drawer
        variant="persistent"
        anchor="bottom"
        open={openSettingsDrawer}
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
        <Settings
          onClose={() => {
            setOpenSettingsDrawer(false);
          }}
        />
      </Drawer>
    </Box>
  );
};

export default TocView;
