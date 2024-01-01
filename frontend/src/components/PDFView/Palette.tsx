import React, { useContext } from "react";
import { Box } from "@mui/material";
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
  const L = 40;
  const props = {
    position: "absolute",
    width: L,
    height: L,
    top: 0,
    left: 0,
    borderRadius: "100%",
  };
  const translate = (i: number) => {
    const Θ = (2 * Math.PI) / 8;
    return `translate(${Math.cos(i * Θ) * L}px, ${Math.sin(i * Θ) * L}px)`;
  };

  if (!mouse || !open) return <></>;
  return (
    <Box
      sx={{
        position: "fixed",
        top: -L / 2,
        left: -L / 2,
        width: L,
        height: L,
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
      />
      <Box
        sx={{
          ...props,
          background: "green",
          transform: translate(1),
        }}
      />
      <Box
        sx={{
          ...props,
          background: "blue",
          transform: translate(2),
        }}
      />
      <Box
        sx={{
          ...props,
          background: "gray",
          transform: translate(3),
        }}
      />
      <Box
        sx={{
          ...props,
          background: "darkgray",
          transform: translate(4),
        }}
      />
      <Box
        sx={{
          ...props,
          background: "red",
          transform: translate(5),
        }}
      />
      <Box
        sx={{
          ...props,
          background: "green",
          transform: translate(6),
        }}
      />
      <Box
        sx={{
          ...props,
          background: "blue",
          transform: translate(7),
        }}
      />
    </Box>
  );
};

export default Palette;
