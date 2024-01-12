import { FC, MouseEvent, useContext, useState } from "react";
import { Chip } from "@mui/material";
import { Shortcut } from "@mui/icons-material";
import {
  Node,
  NoteType,
  PageLink as PageLinkType,
  toDisplayedPage,
} from "@/types/PdfInfo";
import { PdfInfoContext } from "@/contexts/PdfInfoContext";
import { Mode } from "../SpeedDial";
import { MouseContext } from "@/contexts/MouseContext";
import { useCursor } from "./useCursor";

/**
 * `PageLink`の引数
 */
interface Props {
  params: PageLinkType;
  mode?: Mode;
  onMouseDown?: (e: MouseEvent, p: NoteType | Node) => void;
}

/**
 * ページへのリンク
 */
const PageLink: FC<Props> = ({ params, mode, onMouseDown }) => {
  const [hover, setHover] = useState(false);
  const { getCursor } = useCursor(mode);
  const { pdfInfo, setPdfInfo } = useContext(PdfInfoContext);
  const { scale } = useContext(MouseContext);
  const { pageLabel } = toDisplayedPage(pdfInfo, params.page);
  const cursor = getCursor() ?? "pointer";
  if (!pdfInfo || !setPdfInfo) return <></>;
  return (
    <>
      <Chip
        sx={{
          position: "absolute",
          left: `${100 * params.x}%`,
          top: `${100 * params.y}%`,
          cursor,
          opacity: mode && hover ? 0.5 : 1,
          background: !mode && hover ? "mediumseagreen" : "green",
          fontSize: "75%",
          transformOrigin: "top left",
          transform: `scale(${scale}%)`,
        }}
        color="success"
        icon={<Shortcut />}
        label={pageLabel}
        size="small"
        onMouseDown={(e) => {
          e.stopPropagation();
          e.preventDefault();
          if (e.button === 0 && !mode) {
            // ページリンク先へ移動
            if (pdfInfo.currentPage === params.page) return;
            if (params.page < 0 || pdfInfo.numPages <= params.page) return;
            setPdfInfo({ ...pdfInfo, currentPage: params.page });
            return;
          }
          onMouseDown?.(e, params);
        }}
        onMouseEnter={() => {
          setHover(!!cursor);
        }}
        onMouseLeave={() => {
          setHover(false);
        }}
      />
    </>
  );
};

export default PageLink;
