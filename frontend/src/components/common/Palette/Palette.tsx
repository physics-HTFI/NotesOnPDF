import { Box, Paper, SxProps } from "@mui/material";
import { Mouse } from "@/contexts/MouseContext";
import { ReactNode } from "react";
import Background from "./Background";

/**
 * パレット型の選択ダイアログ
 */
export default function Palette({
  numIcons,
  renderIcon,
  selected,
  L,
  xy,
  open,
  onClose,
}: {
  /** アイコンの数 */
  numIcons: number;
  /** 右から時計回りに`i`番目のアイコンを返す関数コンポーネント */
  renderIcon: (i: number) => ReactNode;
  /** ハイライトされるアイコンの番号。ない場合は`-1`または`undefined` */
  selected?: number;
  /** アイコンの一辺の長さ（＝パレットの直径の1/3） */
  L: number;
  /** パレットの中心位置 */
  xy: Mouse;
  open: boolean;
  onClose: (i?: number) => void;
}) {
  if (!open || numIcons < 2) return <></>;

  const sx = (i: number): SxProps => {
    const Θ = (2 * Math.PI) / numIcons;
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
        transform: `translate(${xy.pageX}px, ${xy.pageY}px)`,
        cursor: "default",
        zIndex: 1051, // SpeedDialより手前にする：https://mui.com/material-ui/customization/z-index/
      }}
      onMouseLeave={() => {
        onClose();
      }}
      onMouseUp={() => {
        onClose();
      }}
    >
      {[...Array(numIcons).keys()].map((i) => (
        <Box key={String(i)} sx={sx(i)}>
          {renderIcon(i)}
        </Box>
      ))}
      <Background
        L={L}
        divisions={numIcons}
        selected={selected}
        onClose={onClose}
      />
    </Paper>
  );
}
