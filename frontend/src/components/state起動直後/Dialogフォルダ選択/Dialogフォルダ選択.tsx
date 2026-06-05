import { Box, DialogContent, Stack, Typography } from "@mui/material";
import { useHistory } from "./useHistory/useHistory";
import { Buttonフォルダ選択 } from "./ui/Buttonフォルダ選択";
import { Table履歴 } from "./ui/Table履歴";
import { useDirectoryExists } from "./useDirectoryExists/useDirectoryExists";
import { Title } from "./ui/Title";
import { Panelドラッグドロップ } from "./ui/Panelドラッグドロップ";

/**
 * 基準フォルダを選択するダイアログ
 */
export function Dialogフォルダ選択({
  onSelect,
}: {
  onSelect: (folder: FileSystemDirectoryHandle) => void;
}) {
  const historyUse = useHistory();
  const { ifExistsAsync } = useDirectoryExists();

  const handleSelect = async (folder: FileSystemDirectoryHandle) => {
    await ifExistsAsync(folder, () => {
      onSelect(folder);
      void historyUse.addAsync(folder);
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
          folders={historyUse.folders}
          onSelect={handleSelect}
          onRemoveAt={historyUse.removeAtAsync}
        />
      </DialogContent>
    </Box>
  );
}
