import React, { useContext, useRef } from "react";
import { TextField } from "@mui/material";
import { PageLink, fromDisplayedPage } from "@/types/Notes";
import { NotesContext } from "@/contexts/NotesContext";

/**
 * `PageLinkEditor`の引数
 */
interface Props {
  params: PageLink;
  pageNum: number;
  onClose: () => void;
}

/**
 * ページリンクのメニュー
 */
const PageLinkEditor: React.FC<Props> = ({ params, pageNum, onClose }) => {
  const { notes, setNotes } = useContext(NotesContext);
  const num = useRef<number>(pageNum);
  const page = notes?.pages[notes.currentPage];
  const notesTrimmed = page?.notes?.filter((n) => n !== params);
  if (!notes || !setNotes || !page || !notesTrimmed) return <></>;

  const handleEdit = (p: PageLink) => {
    notesTrimmed.push(p);
    page.notes = notesTrimmed;
    setNotes({ ...notes });
    onClose();
  };

  return (
    <TextField
      variant="standard"
      defaultValue={pageNum}
      type="number"
      sx={{ width: 80, p: 1 }}
      inputRef={(ref?: HTMLInputElement) => {
        ref?.focus();
      }}
      onChange={(e) => {
        num.current = Number(e.target.value);
      }}
      onMouseLeave={() => {
        if (pageNum == num.current) onClose();
        else {
          handleEdit({
            ...params,
            page: fromDisplayedPage(notes, num.current),
          });
        }
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
      }}
      onWheel={(e) => {
        e.stopPropagation();
      }}
    />
  );
};

export default PageLinkEditor;
