import React, { useContext, useRef } from "react";
import { Paper, TextField } from "@mui/material";
import { PageLink, fromDisplayedPage } from "@/types/Notes";
import { NotesContext } from "@/contexts/NotesContext";
import { MouseContext } from "@/contexts/MouseContext";

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
  const { mouse, pageRect } = useContext(MouseContext);
  const num = useRef<number>(pageNum);
  const page = notes?.pages[notes.currentPage];
  if (!notes || !setNotes || !page || !mouse || !pageRect) return <></>;

  const handleEdit = (p: PageLink) => {
    const notesTrimmed = page.notes?.filter((n) => n !== params);
    if (notesTrimmed) {
      notesTrimmed.push(p);
      page.notes = notesTrimmed;
      setNotes({ ...notes });
    }
    onClose();
  };
  const x = (100 * (mouse.pageX - pageRect.left)) / pageRect.width;
  const y = (100 * (mouse.pageY - pageRect.top)) / pageRect.height;
  return (
    <Paper
      sx={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        width: 100,
        height: 50,
        m: "auto",
        transform: `translate(${-50 + x}cqw, ${-50 + y}cqh)`,
        background: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "default",
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
    >
      <TextField
        variant="standard"
        defaultValue={pageNum}
        type="number"
        sx={{ p: 1 }}
        inputRef={(ref?: HTMLInputElement) => {
          ref?.focus();
        }}
        onChange={(e) => {
          num.current = Number(e.target.value);
        }}
      />
    </Paper>
  );
};

export default PageLinkEditor;
