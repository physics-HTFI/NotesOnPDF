import { useContext, useState } from "react";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  InputAdornment,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Delete, DoubleArrow, Folder } from "@mui/icons-material";
import ModelWeb from "@/models/Model.Web";
import ModelContext from "@/contexts/ModelContext/ModelContext";
import TooltipIconButton from "../../common/TooltipIconButton";
import { useHistory } from "./useHistory/useHistory";

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
  const { folders, removeAtAsync, addFolderHandleAsync } = useHistory();

  const handleSelect = async (handle: FileSystemDirectoryHandle) => {
    onClose();
    await addFolderHandleAsync(handle);
    await handle.requestPermission?.({ mode: "read" }); // 履歴から開く際に必要
    setModel(new ModelWeb(handle));
  };

  const alertBrowserCannotOpenDirectory = () => {
    alert(
      "このブラウザは、フォルダの読み込みに対応していません。\nGoogle Chrome または Microsoft Edge を使用してください。",
    );
  };

  return (
    <>
      <Dialog
        open={open}
        onDragOver={(e) => {
          e.preventDefault();
          setDraggingColor("mistyrose");
        }}
        onDragLeave={() => {
          setDraggingColor(undefined);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setDraggingColor(undefined);
          setDirHandle(undefined);
          void setHandle();

          async function setHandle() {
            for (const item of e.dataTransfer.items) {
              if (!item.getAsFileSystemHandle) {
                alertBrowserCannotOpenDirectory();
                return;
              }
              const handle = await item.getAsFileSystemHandle();
              if (!handle) continue;
              if (handle.kind === "directory") {
                setDirHandle(handle as FileSystemDirectoryHandle);
              }
            }
          }
        }}
      >
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
            <TooltipIconButton
              icon={<DoubleArrow sx={{ fontSize: 40 }} />}
              onClick={() => {
                if (!dirHandle) return;
                void handleSelect(dirHandle);
              }}
              disabled={!dirHandle}
              sx={{ color: "steelblue" }}
              tooltipTitle="このフォルダを開きます"
            />
          </Stack>

          {/* 履歴から選択する */}
          <Typography variant="body1" sx={{ mt: 3, mb: 1 }}>
            履歴から開く
          </Typography>
          <History
            folders={folders}
            removeAtAsync={removeAtAsync}
            onSelect={(folder) => {
              void handleSelect(folder);
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

/**
 * 履歴を表示するコンポーネント
 */
function History({
  folders,
  removeAtAsync,
  onSelect,
}: {
  folders: FileSystemDirectoryHandle[];
  removeAtAsync: (index: number) => Promise<void>;
  onSelect: (folder: FileSystemDirectoryHandle) => void;
}) {
  if (folders.length === 0) return "なし";
  return (
    <TableContainer
      component={Box}
      sx={{
        background: "white",
        borderRadius: 2,
      }}
    >
      <Table size="small">
        <TableBody>
          {folders.map((folder) => (
            <TableRow
              hover
              key={folder.name}
              sx={{ cursor: "pointer" }}
              onClick={() => {
                onSelect(folder);
              }}
            >
              <TableCell component="th" scope="row">
                {folder.name}
              </TableCell>
              <TableCell sx={{ width: 30 }}>
                <TooltipIconButton
                  icon={<Delete />}
                  onClick={(e) => {
                    e.stopPropagation();
                    void removeAtAsync(folders.indexOf(folder));
                  }}
                  sx={{ color: "steelblue" }}
                  tooltipTitle="この履歴を削除します"
                  tooltipPlacement="right"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
