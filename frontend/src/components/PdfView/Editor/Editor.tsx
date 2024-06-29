import { NoteType } from "@/types/PdfNotes";
import ChipEditor from "./ChipEditor";
import PageLinkEditor from "./PageLinkEditor";
import MemoEditor from "./MemoEditor";
import EditArrowPalette from "./EditArrowPalette";
import EditRectPalette from "./EditRectPalette";
import EditBracketPalette from "./EditBracketPalette";

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
      return <EditArrowPalette params={params} onClose={onClose} />;
    case "Bracket":
      return <EditBracketPalette params={params} onClose={onClose} />;
    case "Chip":
      return <ChipEditor params={params} onClose={onClose} />;
    case "Marker":
      return <></>;
    case "Memo":
      return <MemoEditor params={params} onClose={onClose} />;
    case "PageLink":
      return <PageLinkEditor params={params} onClose={onClose} />;
    case "Polygon":
    case "Rect":
      return <EditRectPalette params={params} onClose={onClose} />;
  }
}
