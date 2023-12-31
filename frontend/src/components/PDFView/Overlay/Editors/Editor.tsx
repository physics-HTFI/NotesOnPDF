import React from "react";
import { NoteType } from "@/types/Notes";
import ChipEditor from "./ChipEditor";
import PolygonEditor from "./PolygonEditor";
import PageLinkEditor from "./PageLinkEditor";
import NoteEditor from "./NoteEditor";

/**
 * `Editor`の引数
 */
interface Props {
  open: boolean;
  params?: NoteType;
  onClose: () => void;
}

/**
 * 編集ダイアログ
 */
const Editor: React.FC<Props> = ({ open, params, onClose }) => {
  if (!open || !params) return <></>;
  switch (params.type) {
    case "Arrow":
      return <></>;
    case "Bracket":
      return <></>;
    case "Chip":
      return <ChipEditor params={params} onClose={onClose} />;
    case "Marker":
      return <></>;
    case "Note":
      return <NoteEditor params={params} onClose={onClose} />;
    case "PageLink":
      return <PageLinkEditor params={params} onClose={onClose} />;
    case "Polygon":
      return <PolygonEditor params={params} onClose={onClose} />;
    case "Rect":
      return <PolygonEditor params={params} onClose={onClose} />;
  }
};

export default Editor;
