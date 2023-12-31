import React, { useContext, useState } from "react";
import { Chip as MuiChip } from "@mui/material";
import { Mode } from "../SpeedDial";
import { Chip as ChipType } from "@/types/Notes";
import ChipEditor from "./Editors/ChipEditor";
import { MouseContext } from "@/contexts/MouseContext";

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
  const { setMouse } = useContext(MouseContext);
  const [hover, setHover] = useState(false);
  const [edit, setEdit] = useState(false);
  const outlined = params.outlined ?? false;
  const cursor = !mode ? undefined : mode === "move" ? "move" : "pointer";
  return (
    <>
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
        label={params.text}
        onMouseDown={(e) => {
          if (!mode || e.button !== 0) return;
          e.stopPropagation();
          setMouse?.({ pageX: e.pageX, pageY: e.pageY });
          if (mode === "delete") onDelete();
          if (mode === "edit") setEdit(true);
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
      {/* 編集 */}
      {edit && (
        <ChipEditor
          params={params}
          onClose={() => {
            setEdit(false);
          }}
        />
      )}
    </>
  );
};

export default Chip;
