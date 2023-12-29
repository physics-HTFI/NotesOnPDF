import {
  Arrow,
  Bracket,
  Chip,
  Marker,
  Note,
  Notes,
  PageLink,
  Polygon,
  Rect,
} from "@/types/Notes";

export const deleteNotes = (
  p: PageLink | Rect | Polygon | Arrow | Bracket | Marker | Note | Chip,
  notes: Notes,
  setNotes: (notes: Notes) => void
) => {
  const page = notes.pages[notes.currentPage];
  if (!page) return;
  page.notes = page.notes?.filter((n) => n !== p);
  setNotes({ ...notes });
};
