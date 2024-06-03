import { NoteType } from "@/types/PdfNotes";
import ChipEditor from "./ChipEditor";
import PageLinkEditor from "./PageLinkEditor";
import MemoEditor from "./MemoEditor";
import ArrowEditorIcons from "./ArrowEditorIcons";
import { useContext } from "react";
import MouseContext from "@/contexts/MouseContext";
import Palette from "@/components/common/Palette";
import RectEditorIcons from "./RectEditorIcons";

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
  const { mouse } = useContext(MouseContext);
  if (!open || !params || !mouse) return <></>;
  switch (params.type) {
    case "Arrow":
    case "Bracket":
      return (
        <Palette
          L={40}
          open={open}
          xy={mouse}
          icons={ArrowEditorIcons(40, params, onClose)}
          onCancel={onClose}
        />
      );
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
      return (
        <Palette
          L={40}
          open={open}
          xy={mouse}
          icons={RectEditorIcons(40, params, onClose)}
          onCancel={onClose}
        />
      );
  }
}
