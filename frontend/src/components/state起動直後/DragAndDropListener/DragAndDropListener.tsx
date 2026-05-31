import { Download } from "@mui/icons-material";
import { useDragAndDrop } from "./useDragAndDrop";
import { Paper, Typography } from "@mui/material";

export function DragAndDropListener({
  onSelect,
}: {
  onSelect: (handle: FileSystemDirectoryHandle) => void;
}) {
  const { isDragging } = useDragAndDrop(onSelect);
  return (
    <Paper
      elevation={3}
      sx={{
        height: 150,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: isDragging ? "lavenderblush" : undefined,
        color: isDragging ? "maroon" : "inherit",
        aspectRatio: "1 / 1",
        gap: 1,
      }}
    >
      <Download sx={{ fontSize: 50 }} />
      <Typography variant="caption">ドラッグ&ドロップ</Typography>
    </Paper>
  );
}
