import { FC } from "react";
import { NoteType } from "@/types/PdfInfo";
import ChipEditor from "./Editor/ChipEditor";
import RectEditor from "./Editor/RectEditor";
import PageLinkEditor from "./Editor/PageLinkEditor";
import NoteEditor from "./Editor/NoteEditor";
import ArrowEditor from "./Editor/ArrowEditor";

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
const Editor: FC<Props> = ({ open, params, onClose }) => {
  if (!open || !params) return <></>;
  switch (params.type) {
    case "Arrow":
      return <ArrowEditor params={params} onClose={onClose} />;
    case "Bracket":
      return <ArrowEditor params={params} onClose={onClose} />;
    case "Chip":
      return <ChipEditor params={params} onClose={onClose} />;
    case "Marker":
      return <></>;
    case "Note":
      return <NoteEditor params={params} onClose={onClose} />;
    case "PageLink":
      return <PageLinkEditor params={params} onClose={onClose} />;
    case "Polygon":
      return <RectEditor params={params} onClose={onClose} />;
    case "Rect":
      return <RectEditor params={params} onClose={onClose} />;
  }
};

export default Editor;
