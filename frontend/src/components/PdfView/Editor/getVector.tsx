import { Arrow, Bracket } from "@/types/PdfNotes";

/**
 * 与えられた直線と同じ向きを持つ`Palette`アイコン用ベクトルを返す
 */
export default function getVector(
  params: Arrow | Bracket,
  pageRect: DOMRect,
  scale: number
) {
  const x = (params.x2 - params.x1) * pageRect.width;
  const y = (params.y2 - params.y1) * pageRect.height;
  const l = Math.sqrt(x ** 2 + y ** 2);
  const unitX = x / l;
  const unitY = y / l;
  return {
    x1: 0.5 - scale * 0.5 * unitX,
    y1: 0.5 - scale * 0.5 * unitY,
    x2: 0.5 + scale * 0.5 * unitX,
    y2: 0.5 + scale * 0.5 * unitY,
  };
}
