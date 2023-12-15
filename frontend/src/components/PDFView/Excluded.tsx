import React from "react";
import { Box } from "@mui/material";

/**
 * `Excluded`の引数
 */
interface Props {
  excluded: boolean;
}

/**
 * PDFビュークリック時に表示されるコントロール
 */
const Excluded: React.FC<Props> = ({ excluded }) => {
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
};

export default Excluded;
