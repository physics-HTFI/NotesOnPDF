import {
  Box,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import { useHistory } from "./useHistory/useHistory";
import { Panelドラッグドロップ } from "./Panelドラッグドロップ/Panelドラッグドロップ";
import { Buttonフォルダ選択 } from "./Buttonフォルダ選択";
import { Table履歴 } from "./Table履歴";
import { VERSION } from "@/types/CONSTANTS";
import { useDirectoryExists } from "./useDirectoryExists/useDirectoryExists";

/**
 * 基準フォルダを選択するダイアログ
 */
export function Dialogフォルダ選択({
  onSelect,
}: {
  onSelect: (folder: FileSystemDirectoryHandle) => void;
}) {
  const {
    folders,
    addAsync: addToHistoryAsync,
    removeAtAsync: removeHistoryAtAsync,
  } = useHistory();
  const { ifExistsAsync } = useDirectoryExists();

  const handleSelect = async (folder: FileSystemDirectoryHandle) => {
    await ifExistsAsync(folder, () => {
      onSelect(folder);
      void addToHistoryAsync(folder);
    });
  };

  return (
    <Box sx={{ width: 500 }}>
      <Title />
      <DialogContent>
        <Stack
          sx={{ flexDirection: "row", gap: 5, alignItems: "baseline", mx: 2 }}
        >
          <Buttonフォルダ選択 onSelect={handleSelect} />
          <Panelドラッグドロップ onSelect={handleSelect} />
        </Stack>

        {/* 履歴から選択する */}
        <Typography variant="body1" sx={{ mt: 3, mb: 1 }}>
          履歴から開く
        </Typography>
        <Table履歴
          folders={folders}
          onSelect={handleSelect}
          onRemoveAt={removeHistoryAtAsync}
        />
      </DialogContent>
    </Box>
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
        {VERSION}
      </span>
    </DialogTitle>
  );
}
