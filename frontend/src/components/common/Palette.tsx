import { Box, Paper, SxProps } from "@mui/material";
import { Mouse } from "@/contexts/MouseContext";
import Svg from "./Svg";
import { ReactNode } from "react";
import { red } from "@mui/material/colors";

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
  onCancel,
}: {
  numIcons: number;
  /** アイコンを返す関数コンポーネント */
  renderIcon: (i: number) => ReactNode;
  /** 選択されているアイコンの番号。ない場合は`-1`または`undefined` */
  selected?: number;
  /** アイコンの一辺の長さ（＝パレットの直径の1/3） */
  L: number;
  /** パレットの中心位置 */
  xy: Mouse;
  open: boolean;
  onCancel?: () => void;
}) {
  if (!open) return <></>;

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
        zIndex: 1051, // SpeedDialより手前にする：https://mui.com/material-ui/customization/z-index/
      }}
      onMouseLeave={onCancel}
      onMouseUp={onCancel}
    >
      {new Array(numIcons).fill(0).map((_, i) => (
        <Box
          key={String(i)}
          sx={{ ...sx(i), background: i === selected ? red[50] : undefined }}
        >
          {renderIcon(i)}
        </Box>
      ))}
      <Divider L={L} divisions={numIcons} />
    </Paper>
  );
}

/**
 * パレットの分割線
 */
function Divider({ L, divisions }: { L: number; divisions: number }) {
  const Θ = (2 * Math.PI) / divisions;
  return (
    <Svg pageRect={new DOMRect(0, 0, 3 * L, 3 * L)} noPointerEvents>
      <radialGradient id="rg" spreadMethod="pad">
        <stop offset="30%" stopColor="#fff" />
        <stop offset="50%" stopColor="#bbb" />
      </radialGradient>
      <path
        d={[...Array(divisions).keys()]
          .map((i) => {
            const [dx, dy] = [
              L * Math.cos((i + 0.5) * Θ),
              L * Math.sin((i + 0.5) * Θ),
            ];
            const [p1, p2] = [
              `${1.5 * L},${1.5 * L}`,
              `${1.5 * L + 1.5 * dx},${1.5 * L + 1.5 * dy}`,
            ];
            return `M${p1}L${p2}`;
          })
          .join("")}
        style={{
          stroke: "url(#rg)",
          fill: "none",
          strokeWidth: 1,
          strokeDasharray: "1,4",
        }}
      />
    </Svg>
  );
}
