import Svg from "../Svg";
import { useId } from "react";

const INNER_RADIUS = 1 / 3;

/**
 * パレットの背景部分
 */
export default function Background({
  L,
  divisions,
  selected,
  onClose,
}: {
  L: number;
  divisions: number;
  selected?: number;
  onClose: (i: number) => void;
}) {
  const id = useId();
  return (
    <Svg pageRect={new DOMRect(0, 0, 3 * L, 3 * L)}>
      <radialGradient id={id} spreadMethod="repeat">
        <stop offset={INNER_RADIUS} stopColor="#ffff" />
        <stop offset={1.2 * INNER_RADIUS} stopColor="#fff0" />
      </radialGradient>

      {/* 境界線 */}
      <path
        d={[...Array(divisions).keys()]
          .map((i) => getPathD(i, divisions, L))
          .join("")}
        style={{
          stroke: "#bbb",
          fill: "none",
          strokeWidth: 1,
          strokeDasharray: "1,4",
        }}
      />

      {/* 選択の当たり判定 */}
      {[...Array(divisions).keys()].map((i) => (
        <polygon
          key={String(i)}
          points={getPolygonPoints(i, divisions, L)}
          style={{ fill: i === selected ? "#f001" : "transparent" }}
          onMouseEnter={() => {
            onClose(i);
          }}
        />
      ))}

      {/* 中央のグラデーション */}
      <circle
        cx={1.5 * L}
        cy={1.5 * L}
        r={1.5 * L}
        style={{ fill: `url(#${id})`, stroke: "none", pointerEvents: "none" }}
      />
    </Svg>
  );
}

/**
 * `<path d={...}/>`の`d`部分を返す
 */
function getPathD(i: number, divisions: number, L: number) {
  const R = 1.5 * L;
  const [x2, y2] = getPoint(i, divisions, R, R);
  return `M${R},${R}L${x2},${y2}`;
}

/**
 * `<polygon points={...}/>`の`points`部分を返す
 */
function getPolygonPoints(i: number, divisions: number, L: number) {
  const N = 20;
  const [O, r, R] = [1.5 * L, INNER_RADIUS * 1.5 * L, 1.5 * L];
  const points: [number, number][] = [
    getPoint(i, divisions, O, r),
    getPoint(i, divisions, O, R),
    ...[...Array(N).keys()].map((j) => getPoint(i + j / N, divisions, O, R)),
    getPoint(i + 1, divisions, O, R),
    getPoint(i + 1, divisions, O, r),
    ...[...Array(N).keys()].map((j) =>
      getPoint(i + 1 - j / N, divisions, O, r)
    ),
  ];

  return points.map((p) => `${p[0]},${p[1]}`).join(" ");
}

/**
 * 中心`(O, O)`, 半径`R`の円周上の点を返す
 */
function getPoint(
  i: number,
  divisions: number,
  O: number,
  R: number
): [number, number] {
  const Θ = (2 * Math.PI * (i - 0.5)) / divisions;
  return [O + R * Math.cos(Θ), O + R * Math.sin(Θ)];
}
