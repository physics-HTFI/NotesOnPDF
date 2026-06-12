import { Download } from "@mui/icons-material";
import { useDragAndDrop } from "./use/useDragAndDrop";
import { PanelButton } from "./share/PanelButton";

export function Panelドラッグドロップ({
  onSelect,
}: {
  onSelect: (handle: FileSystemDirectoryHandle) => void;
}) {
  const { isDragging } = useDragAndDrop(onSelect);
  return (
    <PanelButton
      icon={Download}
      label="ドラッグ&ドロップ"
      sx={{
        backgroundColor: isDragging ? "lavenderblush" : undefined,
        color: isDragging ? "maroon" : "inherit",
      }}
    />
  );
}
