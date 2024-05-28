import { useContext } from "react";
import { Paper } from "@mui/material";
import MouseContext from "@/contexts/MouseContext";
import usePdfNotes from "@/hooks/usePdfNotes";
import { Node, NoteType } from "@/types/PdfNotes";
import {
  ArrowIcon,
  BracketIcon,
  ChipIcon,
  IconProps,
  MarkerIcon,
  MemoIcon,
  PageLinkIcon,
  PolygonIcon,
  RectIcon,
} from "./Icons";
import Divider from "./Divider";

/**
 * PDFビュークリック時に表示されるパレット型コントロール
 */
export default function Palette({
  open,
  onClose,
}: {
  open: boolean;
  onClose: (note: NoteType | Node) => void;
}) {
  const { mouse, pageRect } = useContext(MouseContext);
  const { pdfNotes } = usePdfNotes();
  if (!mouse || !pageRect || !pdfNotes || !open) return <></>;

  const [L, DIVISIONS] = [50, 8];
  const sx = (i: number) => {
    const Θ = (2 * Math.PI) / DIVISIONS;
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

  const iconProps: Omit<IconProps, "sx"> = {
    onClose,
    x: (mouse.pageX - pageRect.x) / pageRect.width,
    y: (mouse.pageY - pageRect.y) / pageRect.height,
    page: pdfNotes.currentPage,
    svgRect: new DOMRect(0, 0, 1.5 * L, 1.5 * L),
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
      <PolygonIcon sx={sx(3)} {...iconProps} />
      <ChipIcon sx={sx(4)} {...iconProps} />
      <PageLinkIcon sx={sx(5)} {...iconProps} />
      <MemoIcon sx={sx(6)} {...iconProps} />
      <RectIcon sx={sx(7)} {...iconProps} />

      {/* 分割線 */}
      <Divider L={L} divisions={DIVISIONS} />
    </Paper>
  );
}
