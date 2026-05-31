import { useContext } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import ModelWeb from "@/models/Model.Web";
import ModelContext from "@/contexts/ModelContext/ModelContext";
import { useHistory } from "./useHistory/useHistory";
import { History } from "./History";
import { Panelドラッグドロップ } from "./Panelドラッグドロップ/Panelドラッグドロップ";
import { Buttonフォルダ選択 } from "./Buttonフォルダ選択";

/**
 * 基準フォルダを選択するダイアログ
 */
export default function SelectRootDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { setModel } = useContext(ModelContext);
  const history = useHistory();

  const handleSelect = (handle: FileSystemDirectoryHandle) => {
    onClose();
    setModel(new ModelWeb(handle));
    history.add(handle);
  };

  return (
    <>
      <Dialog open={open}>
        <Title />
        <DialogContent>
          <Stack direction="row" gap={1} alignItems="baseline">
            <Buttonフォルダ選択 onSelect={handleSelect} />
            <Panelドラッグドロップ onSelect={handleSelect} />
          </Stack>

          {/* 履歴から選択する */}
          <Typography variant="body1" sx={{ mt: 3, mb: 1 }}>
            履歴から開く
          </Typography>
          <History
            folders={history.folders}
            onSelect={handleSelect}
            onRemoveAt={history.removeAt}
          />
        </DialogContent>
      </Dialog>
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
