import { FC, useContext } from "react";
import { Chip as MuiChip } from "@mui/material";
import { Mode } from "../SpeedDial";
import { Chip as ChipType, NoteType } from "@/types/Notes";
import { MouseContext } from "@/contexts/MouseContext";

/**
 * `Chip`の引数
 */
interface Props {
  params: ChipType;
  mode?: Mode;
  onDelete?: () => void;
  onEdit?: (edit: NoteType) => void;
  onMove?: (edit: NoteType) => void;
}

/**
 * チップ
 */
const Chip: FC<Props> = ({ params, mode, onDelete, onEdit, onMove }) => {
  const { setMouse } = useContext(MouseContext);
  const outlined = params.outlined ?? false;
  const cursor = !mode ? undefined : mode === "move" ? "move" : "pointer";
  return (
    <MuiChip
      sx={{
        position: "absolute",
        left: `${100 * params.x}%`,
        top: `${100 * params.y}%`,
        cursor: cursor,
        "&:hover": { opacity: 0.5 },
      }}
      color="primary"
      variant={outlined ? "outlined" : undefined}
      size="small"
      label={params.text}
      onMouseDown={(e) => {
        if (!mode || e.button !== 0) return;
        e.stopPropagation();
        e.preventDefault();
        setMouse?.({ pageX: e.pageX, pageY: e.pageY });
        if (mode === "delete") onDelete?.();
        if (mode === "edit") onEdit?.(params);
        if (mode === "move") onMove?.(params);
      }}
    />
  );
};

export default Chip;
