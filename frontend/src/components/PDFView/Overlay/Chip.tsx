import React, { useState } from "react";
import { Chip as MuiChip } from "@mui/material";
import { Mode } from "../SpeedDial";
import { Chip as ChipType } from "@/types/Notes";

/**
 * `Chip`の引数
 */
interface Props {
  params: ChipType;
  mode: Mode;
  onDelete: () => void;
}

/**
 * チップ
 */
const Chip: React.FC<Props> = ({ params, mode, onDelete }) => {
  const [hover, setHover] = useState(false);
  const outlined = params.outlined ?? false;
  const cursor = !mode ? undefined : mode === "move" ? "move" : "pointer";
  return (
    <MuiChip
      sx={{
        position: "absolute",
        left: `${100 * params.x}%`,
        top: `${100 * params.y}%`,
        cursor: cursor,
        opacity: hover ? 0.5 : 1,
      }}
      color="primary"
      variant={outlined ? "outlined" : undefined}
      size="small"
      label={params.label}
      onMouseDown={(e) => {
        if (!mode || e.button !== 0) return;
        if (mode === "delete") onDelete();
        if (mode === "edit") {
          // TODO
        }
        if (mode === "move") {
          // TODO
        }
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
