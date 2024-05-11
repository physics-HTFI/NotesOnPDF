import { NoteType } from "@/types/PdfNotes";
import ChipEditor from "./ChipEditor";
import RectEditor from "./RectEditor";
import PageLinkEditor from "./PageLinkEditor";
import NoteEditor from "./NoteEditor";
import ArrowEditor from "./ArrowEditor";

/**
 * 編集ダイアログ
 */
export default function Editor({
  open,
  params,
  onClose,
}: {
  open: boolean;
  params?: NoteType;
  onClose: () => void;
}) {
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
}
