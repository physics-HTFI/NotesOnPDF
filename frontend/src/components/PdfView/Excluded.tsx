import { Box } from "@mui/material";

/**
 * PDFビュークリック時に表示されるコントロール
 */
export default function Excluded({ excluded }: { excluded: boolean }) {
  return (
    excluded && (
      <Box
        sx={{
          width: "100%",
          height: "100%",
          background: "#0003",
          position: "absolute",
        }}
      />
    )
  );
}
