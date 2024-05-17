import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Folder, Lock, LockOpen } from "@mui/icons-material";
import useModel from "@/hooks/useModel";
import ModelMock from "@/models/Model.Null";
import ModelWeb from "@/models/Model.Web";

/**
 * 文字列を入力するダイアログ
 */
export default function SelectRootDialog() {
  const { setModel, readOnly, setReadOnly } = useModel();
  const [open, setOpen] = useState(true);
  const [dirHandle, setDirHandle] = useState<FileSystemDirectoryHandle>();
  const [draggingColor, setDraggingColor] = useState<string>();

  const ok = dirHandle !== undefined;

  return (
    <Dialog
      open={open}
      fullWidth
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
        set().catch(() => undefined);

        async function set() {
          for (const item of e.dataTransfer.items) {
            const handle = await item.getAsFileSystemHandle();
            if (!handle) continue;
            if (handle.kind === "directory") {
              setDirHandle(handle as FileSystemDirectoryHandle);
            }
          }
        }
      }}
    >
      <DialogTitle>基準フォルダの選択</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label={
            "このフォルダ内のPDFファイルを検索します (ドラッグ＆ドロップも可)"
          }
          value={dirHandle?.name ?? ""}
          fullWidth
          variant="standard"
          spellCheck={false}
          sx={{ background: draggingColor }}
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            readOnly: true,
            endAdornment: (
              <InputAdornment position="start">
                <IconButton
                  sx={{ color: "steelblue" }}
                  onClick={() => {
                    window
                      .showDirectoryPicker()
                      .then((dirHandle) => {
                        setDirHandle(dirHandle);
                      })
                      .catch(() => undefined);
                  }}
                  size="small"
                >
                  <Folder />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Stack direction="row" sx={{ mt: 3, height: 150 }}>
          {/* 読み取り専用 */}
          <IconButton
            sx={{ alignItems: "start", mb: "auto", color: "steelblue" }}
            onClick={() => {
              setReadOnly(!readOnly);
            }}
            size="small"
          >
            {readOnly ? <Lock /> : <LockOpen />}
          </IconButton>
          <div>
            <Typography
              component={
                "span" /* デフォルトだと<P>になってクリック判定が横に伸びてしまう */
              }
              variant="body1"
              sx={{
                height: 24,
                py: "5px",
                display: "inline-block",
                lineHeight: 1.9,
                color: "steelblue",
                cursor: "pointer",
              }}
              onClick={() => {
                setReadOnly(!readOnly);
              }}
            >
              {readOnly ? "読み取り専用モード" : "自動保存モード"}
            </Typography>
            <div>
              {readOnly ? (
                <span>閲覧や編集はできますが、保存は一切されません</span>
              ) : (
                <span>
                  変更が加えられた際に、注釈ファイルを自動保存します
                  <br />
                  注釈ファイル名は &quot;(PDFファイル名).json&quot; です
                  <br />
                  基準フォルダ直下に、設定フォルダ &quot;.NotesOnPdf&quot;
                  が生成されます
                </span>
              )}
            </div>
          </div>
        </Stack>

        <div
          style={{ fontSize: "80%", color: "darkgray", paddingBottom: "20px" }}
        >
          このアプリは Google Chrome または Microsoft Edge で動作します
        </div>
      </DialogContent>

      <DialogActions>
        {/* サンプルを開く */}
        <Button
          variant={ok ? "outlined" : "contained"}
          onClick={() => {
            setModel(new ModelMock());
            setReadOnly(true);
            setOpen(false);
          }}
          sx={{ mr: "auto" }}
        >
          サンプルを開く
        </Button>

        {/* OK */}
        <Button
          disabled={!ok}
          variant="contained"
          onClick={() => {
            setOpen(false);
            if (!dirHandle) return;
            setModel(new ModelWeb(dirHandle));
          }}
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}
