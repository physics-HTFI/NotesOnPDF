import React, { useState } from "react";
import { Chip as MuiChip } from "@mui/material";

/**
 * `Chip`の引数
 */
interface Props {
  x: number;
  y: number;
  label: string;
  outlined: boolean;
  onClick: () => void;
}

/**
 * チップ
 */
const Chip: React.FC<Props> = ({ x, y, label, outlined, onClick }) => {
  const [hover, setHover] = useState(false);
  return (
    <MuiChip
      sx={{
        position: "absolute",
        left: `${100 * x}%`,
        top: `${100 * y}%`,
        cursor: "alias",
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
        setHover(true);
      }}
      onMouseLeave={() => {
        setHover(false);
      }}
    />
  );
};

export default Chip;
