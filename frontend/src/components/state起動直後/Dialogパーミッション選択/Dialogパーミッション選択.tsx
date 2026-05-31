import { Dialog, DialogContent, DialogTitle, Stack } from "@mui/material";
import { Lock, LockOpen } from "@mui/icons-material";
import { CardButton } from "./CardButton";

/**
 * 「読み込み専用」か「書き込み可能」かを選択するダイアログ
 */
export default function Dialogパーミッション選択({
  folder,
  onPermissionSelected,
}: {
  folder: FileSystemDirectoryHandle;
  onPermissionSelected: (mode: "read" | "readwrite" | "denied") => void;
}) {
  const handlePermissionDenied = async (mode: "read" | "readwrite") => {
    const result = await folder.requestPermission?.({ mode });
    onPermissionSelected(result === "granted" ? mode : "denied");
  };

  return (
    <Dialog open>
      <DialogTitle>モードの選択： {folder.name}</DialogTitle>
      <DialogContent>
        <Stack direction="column" gap={2}>
          {/* 書き込み可能 */}
          <CardButton
            color="steelblue"
            title="自動保存モード（読み込み＆書き込み）"
            Icon={LockOpen}
            onClick={() => {
              void handlePermissionDenied("readwrite");
            }}
          >
            変更が加えられた際に、注釈ファイルを自動保存します。
            <br />
            注釈ファイル名は &quot;(PDFファイルパス).json&quot; です。
            <br />
            また、選択フォルダ直下に、設定フォルダ &quot;.NotesOnPdf&quot;
            が生成されます。
          </CardButton>

          {/* 読み取り専用 */}
          <CardButton
            color="firebrick"
            title="読み取り専用モード（読み込みのみ）"
            Icon={Lock}
            onClick={() => {
              void handlePermissionDenied("read");
            }}
          >
            閲覧や編集はできますが、保存は一切行われません。
          </CardButton>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
