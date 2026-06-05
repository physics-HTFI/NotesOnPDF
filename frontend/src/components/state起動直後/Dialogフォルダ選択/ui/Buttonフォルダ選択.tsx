import { Folder } from "@mui/icons-material";
import { PanelButton } from "./share/PanelButton";
import { alertBrowserCannotOpenDirectory } from "./share/alertBrowserCannotOpenDirectory";

export function Buttonフォルダ選択({
  onSelect,
}: {
  onSelect: (folder: FileSystemDirectoryHandle) => void;
}) {
  return (
    <PanelButton
      icon={Folder}
      label="フォルダを選択"
      onClick={async () => {
        if (!window.showDirectoryPicker) {
          alertBrowserCannotOpenDirectory();
          return;
        }
        const dirHandle = await window.showDirectoryPicker();
        onSelect(dirHandle);
      }}
    />
  );
}
