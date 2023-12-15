import React from "react";
import { Box } from "@mui/material";

/**
 * `Palette`の引数
 */
interface Props {
  /** 表示位置(%) */
  x: number;
  /** 表示位置(%) */
  y: number;
  open: boolean;
}

/**
 * PDFビュークリック時に表示されるコントロール
 */
const Palette: React.FC<Props> = ({ open, x, y }) => {
  const L = 40;
  const props = {
    width: L,
    height: L,
    borderRadius: "100%",
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    m: "auto",
  };
  const translate = (i: number) => {
    const Θ = (2 * Math.PI) / 8;
    return `translate(${Math.cos(i * Θ) * L}px, ${Math.sin(i * Θ) * L}px)`;
  };

  return (
    open && (
      <Box
        sx={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          width: 100,
          height: 100,
          m: "auto",
          transform: `translate(${-50 + x}cqw, ${-50 + y}cqh)`,
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
    )
  );
};

export default Palette;
