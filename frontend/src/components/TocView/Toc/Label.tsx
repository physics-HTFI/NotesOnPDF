import PdfNotesContext from "@/contexts/PdfNotesContext/PdfNotesContext";
import { Page } from "@/types/PdfNotes";
import { Typography } from "@mui/material";
import { useContext, useState } from "react";
import LabelEditor from "./LabelEditor";

/**
 * 巻名、部名、章名要素
 */
export default function Label({
  type,
  page,
  pageNum,
  highlight,
}: {
  type: "volume" | "part" | "chapter";
  page: Page;
  pageNum: number;
  highlight?: boolean;
}) {
  const {
    updaters: { jumpPage, updatePageSettings },
  } = useContext(PdfNotesContext);
  const [xy, setXy] = useState<{ x: number; y: number }>();

  const label =
    type === "volume"
      ? page.volume
      : type === "part"
      ? page.part
      : page.chapter;

  if (label === undefined) return undefined;
  return (
    <Typography
      variant={type === "volume" ? "body1" : "body2"}
      sx={{
        whiteSpace: "nowrap",
        color: highlight ? "crimson" : "gray",
        ...(type === "volume"
          ? {
              "&:not(:first-of-type)": { pt: 1 },
            }
          : type === "part"
          ? { pt: 0.8 }
          : {
              pt: 0.5,
              fontSize: "110%",
              lineHeight: 1,
              minHeight: 6,
            }),
      }}
    >
      <span
        style={{ cursor: "pointer" }}
        onClick={(e) => {
          if (e.ctrlKey || e.shiftKey) {
            setXy({ x: e.clientX, y: e.clientY });
          } else {
            jumpPage(pageNum);
          }
        }}
      >
        {label}
      </span>
      {xy && (
        <LabelEditor
          initLabel={label}
          x={xy.x}
          y={xy.y}
          onClose={(label) => {
            if (label) {
              updatePageSettings({ [type]: label }, pageNum);
            }
            setXy(undefined);
          }}
        />
      )}
    </Typography>
  );
}
