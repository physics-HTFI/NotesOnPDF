import React, { useState } from "react";
import { Chip as MuiChip } from "@mui/material";
import { Mode } from "../Control";

/**
 * `Chip`の引数
 */
interface Props {
  x: number;
  y: number;
  label: string;
  outlined: boolean;
  mode: Mode;
  onClick: () => void;
}

/**
 * チップ
 */
const Chip: React.FC<Props> = ({ x, y, label, outlined, mode, onClick }) => {
  const [hover, setHover] = useState(false);
  const cursor = !mode ? undefined : mode === "move" ? "move" : "pointer";
  return (
    <MuiChip
      sx={{
        position: "absolute",
        left: `${100 * x}%`,
        top: `${100 * y}%`,
        cursor: cursor,
        opacity: hover ? 0.5 : 1,
      }}
      color="primary"
      variant={outlined ? "outlined" : undefined}
      size="small"
      label={label}
      onMouseDown={(e) => {
        if (e.button !== 2) return;
        e.stopPropagation();
        e.preventDefault();
        onClick();
      }}
      onMouseEnter={() => {
        setHover(!!cursor);
      }}
      onMouseLeave={() => {
        setHover(false);
      }}
    />
  );
};

export default Chip;
