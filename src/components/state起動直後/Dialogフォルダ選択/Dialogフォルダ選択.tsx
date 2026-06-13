import { Box, DialogContent, Stack, Typography } from "@mui/material";
import { Buttonフォルダ選択 } from "./ui/Buttonフォルダ選択";
import { Table履歴 } from "./ui/Table履歴";
import { useDirectoryExists } from "./use/useDirectoryExists/useDirectoryExists";
import { Title } from "./ui/Title";
import { Panelドラッグドロップ } from "./ui/Panelドラッグドロップ";
import { useFolderHistory } from "./use/useFolderHistory/useFolderHistory";
import { modelフォルダ } from "../../../models/modelフォルダ/modelフォルダ";

/**
 * 基準フォルダを選択するダイアログ
 */
export function Dialogフォルダ選択() {
  const [folder, setFolder] = modelフォルダ.folder.use();
  const historyUse = useFolderHistory();
  const { ifExists } = useDirectoryExists();

  const handleSelect = async (folder: FileSystemDirectoryHandle) => {
    await ifExists(folder, () => {
      setFolder(folder);
      void historyUse.add(folder);
    });
  };

  if (folder) return null;
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
          onRemoveAt={historyUse.removeAt}
        />
      </DialogContent>
    </Box>
  );
}
