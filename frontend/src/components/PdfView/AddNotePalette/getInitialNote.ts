import { Node, NoteType } from "@/types/PdfNotes";
import { PaletteIconType } from "@/types/AppSettings";

/**
 * `type`に応じた注釈の初期値を返す
 */
export default function getInitialNote(
  x: number,
  y: number,
  page: number,
  type?: PaletteIconType
): NoteType | Node | undefined {
  if (type === "Arrow")
    return {
      type: "Node",
      index: 1,
      target: {
        type: "Arrow",
        x1: x,
        y1: y,
        x2: x,
        y2: y,
        style: "normal",
      },
    };

  if (type === "Bracket")
    return {
      type: "Node",
      index: 1,
      target: {
        type: "Bracket",
        x1: x,
        y1: y,
        x2: x,
        y2: y,
        style: "normal",
      },
    };

  if (type === "Chip")
    return {
      type: "Chip",
      x,
      y,
      text: "",
      style: "filled",
    };

  if (type === "Marker")
    return {
      type: "Node",
      index: 1,
      target: {
        type: "Marker",
        x1: x,
        y1: y,
        x2: x,
        y2: y,
      },
    };

  if (type === "Memo")
    return {
      type: "Memo",
      x,
      y,
      html: "",
    };

  if (type === "PageLink")
    return {
      type: "PageLink",
      x: x,
      y: y,
      page,
    };

  if (type === "Polygon")
    return {
      type: "Node",
      index: 1,
      target: {
        type: "Polygon",
        points: [
          [x, y],
          [x, y],
        ],
        style: "filled",
      },
    };

  if (type === "Rect")
    return {
      type: "Node",
      index: 2,
      target: {
        type: "Rect",
        x: x,
        y: y,
        width: 0,
        height: 0,
        style: "filled",
      },
    };

  return undefined;
}
