import { useMemo } from "react";
import { Box } from "@mui/material";
import SettingsDrawer from "./SettingsDrawer/SettingsDrawer";
import { grey } from "@mui/material/colors";
import ToC from "./Toc/Toc";

/**
 * 目次を表示するコンポーネント
 */
export default function TocView() {
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
        {/* レンダリングコストが高いのでメモ化する */}
        {useMemo(
          () => (
            <ToC />
          ),
          []
        )}
      </Box>

      <SettingsDrawer />
    </Box>
  );
}
