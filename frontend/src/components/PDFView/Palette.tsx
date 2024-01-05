import { FC, useContext } from "react";
import { Paper } from "@mui/material";
import { MouseContext } from "@/contexts/MouseContext";
import { useNotes } from "@/hooks/useNotes";
import { NoteType } from "@/types/Notes";
import {
  ArrowIcon,
  BracketIcon,
  ChipIcon,
  IconProps,
  MarkerIcon,
  NoteIcon,
  PageLinkIcon,
  PolygonIcon,
  RectIcon,
} from "./Palette/Icons";
import Divider from "./Palette/Divider";

/**
 * `Palette`の引数
 */
interface Props {
  open: boolean;
  onClose: () => void;
  onEdit: (note: NoteType) => void;
}

/**
 * PDFビュークリック時に表示されるコントロール
 */
const Palette: FC<Props> = ({ open, onClose, onEdit }) => {
  const { mouse, pageRect } = useContext(MouseContext);
  const { notes, pushNote } = useNotes();
  const L = 50;
  const svgRect = new DOMRect(0, 0, 1.5 * L, 1.5 * L);
  const DIVISIONS = 8;
  const Θ = (2 * Math.PI) / DIVISIONS;
  const sx = (i: number) => {
    return {
      position: "absolute",
      width: L,
      height: L,
      top: L,
      left: L,
      borderRadius: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      transform: `translate(${Math.cos(i * Θ) * L}px, ${
        Math.sin(i * Θ) * L
      }px)`,
    };
  };

  if (!mouse || !pageRect || !notes || !open) return <></>;
  const [x, y] = [
    (mouse.pageX - pageRect.x) / pageRect.width,
    (mouse.pageY - pageRect.y) / pageRect.height,
  ];
  const iconProps: Omit<IconProps, "sx"> = {
    onClose: onClose,
    pushNote: pushNote,
    onEdit,
    x,
    y,
    page: notes.currentPage,
    svgRect: svgRect,
  };
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
        zIndex: 1051, // SpeedDialより手前にする：https://mui.com/material-ui/customization/z-index/
      }}
    >
      {/* 各アイコン */}
      <MarkerIcon sx={sx(0)} {...iconProps} />
      <ArrowIcon sx={sx(1)} {...iconProps} />
      <BracketIcon sx={sx(2)} {...iconProps} />
      <NoteIcon sx={sx(3)} {...iconProps} />
      <ChipIcon sx={sx(4)} {...iconProps} />
      <PageLinkIcon sx={sx(5)} {...iconProps} />
      <PolygonIcon sx={sx(6)} {...iconProps} />
      <RectIcon sx={sx(7)} {...iconProps} />

      {/* 分割線 */}
      <Divider L={L} divisions={DIVISIONS} />
    </Paper>
  );
};

export default Palette;
