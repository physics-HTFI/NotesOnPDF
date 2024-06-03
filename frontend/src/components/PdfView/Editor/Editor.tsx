import { NoteType } from "@/types/PdfNotes";
import ChipEditor from "./ChipEditor";
import PageLinkEditor from "./PageLinkEditor";
import MemoEditor from "./MemoEditor";
import EditArrowPalette from "./EditArrowPalette";
import EditRectPalette from "./EditRectPalette";

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
    case "Bracket":
      return <EditArrowPalette params={params} open={open} onClose={onClose} />;
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
      return <EditRectPalette params={params} open={open} onClose={onClose} />;
  }
}
