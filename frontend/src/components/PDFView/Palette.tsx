import React, { useContext } from "react";
import { Box, Paper } from "@mui/material";
import { MouseContext } from "@/contexts/MouseContext";

/**
 * `Palette`の引数
 */
interface Props {
  open: boolean;
}

/**
 * PDFビュークリック時に表示されるコントロール
 */
const Palette: React.FC<Props> = ({ open }) => {
  const { mouse } = useContext(MouseContext);
  const L = 50;
  const props = {
    position: "absolute",
    width: L,
    height: L,
    top: L,
    left: L,
    borderRadius: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };
  const translate = (i: number) => {
    const Θ = (2 * Math.PI) / 8;
    return `translate(${Math.cos(i * Θ) * L}px, ${Math.sin(i * Θ) * L}px)`;
  };

  if (!mouse || !open) return <></>;
  return (
    <Paper
      elevation={3}
      sx={{
        position: "fixed",
        top: (-3 * L) / 2,
        left: (-3 * L) / 2,
        width: 3 * L,
        height: 3 * L,
        borderRadius: "100%",
        transform: `translate(${mouse.pageX}px, ${mouse.pageY}px)`,
        zIndex: 1050, // SpeedDialより手前にする：https://mui.com/material-ui/customization/z-index/
      }}
    >
      <Box
        sx={{
          ...props,
          background: "red",
          transform: translate(0),
        }}
      >
        Marker
      </Box>
      <Box
        sx={{
          ...props,
          background: "green",
          transform: translate(1),
        }}
      >
        Arrow
      </Box>
      <Box
        sx={{
          ...props,
          background: "blue",
          transform: translate(2),
        }}
      >
        Bracket
      </Box>
      <Box
        sx={{
          ...props,
          background: "gray",
          transform: translate(3),
        }}
      >
        Note
      </Box>
      <Box
        sx={{
          ...props,
          background: "darkgray",
          transform: translate(4),
        }}
      >
        Chip
      </Box>
      <Box
        sx={{
          ...props,
          background: "red",
          transform: translate(5),
        }}
      >
        PageLink
      </Box>
      <Box
        sx={{
          ...props,
          background: "green",
          transform: translate(6),
        }}
      >
        Poligon
      </Box>
      <Box
        sx={{
          ...props,
          background: "blue",
          transform: translate(7),
        }}
      >
        Rect
      </Box>
    </Paper>
  );
};

export default Palette;
