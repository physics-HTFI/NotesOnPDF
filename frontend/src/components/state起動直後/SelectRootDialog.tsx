import { useContext, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DoubleArrow, Folder } from "@mui/icons-material";
import ModelWeb from "@/models/Model.Web";
import ModelContext from "@/contexts/ModelContext/ModelContext";
import TooltipIconButton from "../common/TooltipIconButton";
import { useHistory } from "./useHistory/useHistory";
import { History } from "./History";
import { alertBrowserCannotOpenDirectory } from "./utils/alertBrowserCannotOpenDirectory";
import { DragAndDropListener } from "./DragAndDropListener/DragAndDropListener";

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
  const [dirHandle, setDirHandle] = useState<FileSystemDirectoryHandle>();
  const [draggingColor, setDraggingColor] = useState<string>();
  const history = useHistory();

  const handleSelect = async (handle: FileSystemDirectoryHandle) => {
    onClose();
    await history.addAsync(handle);
    await handle.requestPermission?.({ mode: "read" }); // 履歴から開く際に必要
    setModel(new ModelWeb(handle));
  };

  return (
    <>
      <Dialog open={open}>
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
        <DialogContent>
          <Stack direction="row" gap={1} alignItems="baseline">
            <TextField
              margin="dense"
              label="PDFファイルを含むフォルダ"
              helperText="ドラッグ＆ドロップも可"
              value={dirHandle?.name ?? ""}
              fullWidth
              variant="standard"
              spellCheck={false}
              sx={{ background: draggingColor, minWidth: 350 }}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                readOnly: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <TooltipIconButton
                      icon={<Folder />}
                      onClick={() => {
                        if (!window.showDirectoryPicker) {
                          alertBrowserCannotOpenDirectory();
                          return;
                        }
                        window
                          .showDirectoryPicker()
                          .then((dirHandle) => {
                            setDirHandle(dirHandle);
                          })
                          .catch(() => undefined);
                      }}
                      sx={{ color: "steelblue" }}
                      tooltipTitle="基準フォルダを選択します"
                    />
                  </InputAdornment>
                ),
              }}
            />
            <DragAndDropListener
              onSelect={(handle) => {
                void handleSelect(handle);
              }}
            />
          </Stack>

          {/* 履歴から選択する */}
          <Typography variant="body1" sx={{ mt: 3, mb: 1 }}>
            履歴から開く
          </Typography>
          <History
            folders={history.folders}
            onRemoveAt={(index) => {
              void history.removeAtAsync(index);
            }}
            onSelect={(folder) => {
              void handleSelect(folder);
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
