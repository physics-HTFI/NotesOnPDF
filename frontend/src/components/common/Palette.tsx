import React from "react";
import { Paper, SxProps } from "@mui/material";
import { Mouse } from "@/contexts/MouseContext";
import Svg from "./Svg";

/**
 * パレット型の選択ダイアログ
 */
export default function Palette({
  icons,
  L,
  xy,
  open,
  onCancel,
}: {
  /** アイコンを返す関数コンポーネントの配列 */
  icons: (({ sx }: { sx: SxProps }) => JSX.Element)[];
  /** アイコンの一辺の長さ（＝パレットの直径の1/3） */
  L: number;
  /** パレットの中心位置 */
  xy: Mouse;
  open: boolean;
  onCancel?: () => void;
}) {
  if (!open) return <></>;

  const sx = (i: number) => {
    const Θ = (2 * Math.PI) / icons.length;
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
      {icons.map((icon, i) =>
        React.createElement<{ sx: SxProps }>(icon, {
          sx: sx(i),
          key: String(i),
        })
      )}
      <Divider L={L} divisions={icons.length} />
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
