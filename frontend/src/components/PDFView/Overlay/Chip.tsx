import { FC, useContext, useState } from "react";
import { Chip as MuiChip } from "@mui/material";
import { Mode } from "../SpeedDial";
import { Chip as ChipType, Node, NoteType } from "@/types/Notes";
import { MouseContext } from "@/contexts/MouseContext";
import { useNotes } from "@/hooks/useNotes";

/**
 * `Chip`の引数
 */
interface Props {
  params: ChipType;
  mode?: Mode;
  onMouseDown?: (p: NoteType | Node) => void;
}

/**
 * チップ
 */
const Chip: FC<Props> = ({ params, mode, onMouseDown }) => {
  const [hover, setHover] = useState(false);
  const { setMouse, scale } = useContext(MouseContext);
  const { notes } = useNotes();
  if (!notes || !scale) return <></>;

  const outlined = params.outlined ?? false;
  const cursor = !mode ? undefined : mode === "move" ? "move" : "pointer";
  return (
    <MuiChip
      sx={{
        position: "absolute",
        left: `${100 * params.x}%`,
        top: `${100 * params.y}%`,
        cursor,
        opacity: hover ? 0.5 : 1,
        fontSize: "75%",
        transformOrigin: "top left",
        transform: `scale(${scale}%)`,
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
        onMouseDown?.(params);
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
