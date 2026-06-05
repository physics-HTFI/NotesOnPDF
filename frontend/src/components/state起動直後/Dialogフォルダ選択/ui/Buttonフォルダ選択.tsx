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
      onClick={() => {
        if (!window.showDirectoryPicker) {
          alertBrowserCannotOpenDirectory();
          return;
        }
        window
          .showDirectoryPicker()
          .then((dirHandle) => {
            onSelect(dirHandle);
          })
          .catch(() => undefined);
      }}
    />
  );
}
