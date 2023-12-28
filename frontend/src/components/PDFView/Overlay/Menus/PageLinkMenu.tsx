import React, { useContext, useRef } from "react";
import { Box, IconButton, TextField } from "@mui/material";
import { Delete, Edit, OpenWith } from "@mui/icons-material";
import { PageLink, fromDisplayedPage } from "@/types/Notes";
import { NotesContext } from "@/contexts/NotesContext";

/**
 * `PageLinkMenu`の引数
 */
interface Props {
  params: PageLink;
  pageNum: number;
  onClose: () => void;
}

/**
 * ページリンクのメニュー
 */
const PageLinkMenu: React.FC<Props> = ({ params, pageNum, onClose }) => {
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

  const handleDelete = () => {
    page.notes = notesTrimmed;
    setNotes({ ...notes });
    onClose();
  };

  return (
    <Box
      sx={{ p: 1 }}
      onMouseLeave={() => {
        if (pageNum === num.current) {
          onClose();
        } else {
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
      <Box>
        <IconButton
          sx={{
            "&:focus": { outline: "none" },
          }}
          onClick={undefined}
        >
          <OpenWith />
        </IconButton>
        <IconButton
          sx={{
            "&:focus": { outline: "none" },
          }}
          onClick={undefined}
        >
          <Edit />
        </IconButton>
        <IconButton
          sx={{
            "&:focus": { outline: "none" },
          }}
          onClick={handleDelete}
        >
          <Delete />
        </IconButton>
      </Box>
      <TextField
        variant="standard"
        defaultValue={pageNum}
        onChange={(e) => {
          num.current = Number(e.target.value);
        }}
        type="number"
        sx={{ width: 80, p: 1 }}
      />
    </Box>
  );
};

export default PageLinkMenu;
