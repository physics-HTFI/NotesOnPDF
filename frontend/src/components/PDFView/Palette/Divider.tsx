import { FC } from "react";
import Svg from "../Overlay/Svg";

/**
 * `Divider`の引数
 */
interface Props {
  L: number;
  divisions: number;
}

/**
 * パレットの分割線
 */
const Divider: FC<Props> = ({ L, divisions }) => {
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
};

export default Divider;
