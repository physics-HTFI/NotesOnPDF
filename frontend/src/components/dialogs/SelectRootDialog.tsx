import { useContext, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Folder, Lock, LockOpen } from "@mui/icons-material";
import ModelMock from "@/models/Model.Mock";
import ModelWeb from "@/models/Model.Web";
import UiContext from "@/contexts/UiContext";
import ModelContext from "@/contexts/ModelContext/ModelContext";
import TooltipIconButton from "../common/TooltipIconButton";

/**
 * 文字列を入力するダイアログ
 */
export default function SelectRootDialog() {
  const { setModel } = useContext(ModelContext);
  const { readOnly, setReadOnly, setAlert } = useContext(UiContext);
  const [open, setOpen] = useState(true);
  const [dirHandle, setDirHandle] = useState<FileSystemDirectoryHandle>();
  const [draggingColor, setDraggingColor] = useState<string>();

  const ok = dirHandle !== undefined;
  const readOnlyColor = readOnly ? "firebrick" : "steelblue";

  return (
    <>
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
          setHandle().catch(() => undefined);

          async function setHandle() {
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
        <DialogTitle
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "center",
            marginBottom: 1,
          }}
        >
          <img src="favicon.svg" style={{ height: 24 }} />
          NotesOnPDF ウェブ版
          <span
            style={{
              fontSize: "60%",
              marginTop: 10,
              color: "darkgray",
            }}
          >
            (Google Chrome, Microsoft Edge)
          </span>
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label={"基準フォルダ"}
            helperText="このフォルダ内のPDFファイルを検索します (ドラッグ＆ドロップも可)"
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
              startAdornment: (
                <InputAdornment position="start">
                  <TooltipIconButton
                    icon={<Folder />}
                    onClick={() => {
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

          <Stack direction="row" sx={{ mt: 3, height: 120 }}>
            {/* 読み取り専用 */}
            <TooltipIconButton
              icon={readOnly ? <Lock /> : <LockOpen />}
              onClick={() => {
                setReadOnly(!readOnly);
              }}
              sx={{ alignItems: "start", mb: "auto", color: readOnlyColor }}
              tooltipTitle="読み取り専用モード／自動保存モードを切り替えます"
            />
            <div>
              <Typography
                component={
                  "span" /* デフォルトだと<p>になってクリック判定が横に伸びてしまう */
                }
                variant="body1"
                sx={{
                  height: 24,
                  py: "5px",
                  display: "inline-block",
                  lineHeight: 1.9,
                  color: readOnlyColor,
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
                  <span>
                    閲覧や編集はできますが、保存は一切されません
                    <br />
                    ファイルが追加されることもありません
                  </span>
                ) : (
                  <span>
                    変更が加えられた際に、注釈ファイルを自動保存します
                    <br />
                    注釈ファイル名は &quot;(PDFファイルパス).json&quot; です
                    <br />
                    また、基準フォルダ直下に、設定フォルダ
                    &quot;.NotesOnPdf&quot; が生成されます
                  </span>
                )}
              </div>
            </div>
          </Stack>
        </DialogContent>

        <DialogActions>
          {/* サンプルを開く */}
          <Button
            variant={ok ? "outlined" : "contained"}
            onClick={() => {
              setModel(new ModelMock());
              setReadOnly(true);
              setAlert(
                "info",
                <>
                  これはサンプルです。
                  <br />
                  閲覧・編集などは一通りできますが、保存はされません。
                  <br />
                  再読み込みすると元に戻ります。
                </>
              );
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
    </>
  );
}
