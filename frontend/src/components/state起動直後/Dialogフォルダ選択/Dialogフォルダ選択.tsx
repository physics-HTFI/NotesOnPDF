import {
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import { useHistory } from "./useHistory/useHistory";
import { Panelドラッグドロップ } from "./Panelドラッグドロップ/Panelドラッグドロップ";
import { Buttonフォルダ選択 } from "./Buttonフォルダ選択";
import { Table履歴 } from "./Table履歴";

/**
 * 基準フォルダを選択するダイアログ
 */
export function Dialogフォルダ選択({
  onSelect,
}: {
  onSelect: (folder: FileSystemDirectoryHandle) => void;
}) {
  const history = useHistory();

  const handleSelect = (folder: FileSystemDirectoryHandle) => {
    onSelect(folder);
    history.add(folder);
  };

  return (
    <>
      <Title />
      <DialogContent>
        <Stack sx={{ flexDirection: "row", gap: 2, alignItems: "baseline" }}>
          <Buttonフォルダ選択 onSelect={handleSelect} />
          <Panelドラッグドロップ onSelect={handleSelect} />
        </Stack>

        {/* 履歴から選択する */}
        <Typography variant="body1" sx={{ mt: 3, mb: 1 }}>
          履歴から開く
        </Typography>
        <Table履歴
          folders={history.folders}
          onSelect={handleSelect}
          onRemoveAt={history.removeAt}
        />
      </DialogContent>
    </>
  );
}

function Title() {
  return (
    <DialogTitle
      sx={{
        display: "flex",
        gap: 1,
        alignItems: "center",
        marginBottom: 1,
      }}
    >
      <img src="favicon.svg" style={{ height: 24 }} />
      NotesOnPDF
      <span style={{ color: "darkgray", fontSize: "75%", marginTop: 5 }}>
        {import.meta.env.VITE_VERSION}
      </span>
    </DialogTitle>
  );
}
