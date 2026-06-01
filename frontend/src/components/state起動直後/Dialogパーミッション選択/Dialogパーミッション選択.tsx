import { DialogContent, DialogTitle, Stack } from "@mui/material";
import { ArrowBack, Lock, LockOpen } from "@mui/icons-material";
import { CardButton } from "./CardButton";
import TooltipIconButton from "@/components/common/TooltipIconButton";

/**
 * 「読み込み専用」か「書き込み可能」かを選択するダイアログ
 */
export default function Dialogパーミッション選択({
  folder,
  onPermissionSelected,
  onCancel,
}: {
  folder: FileSystemDirectoryHandle;
  onPermissionSelected: (mode: "read" | "readwrite" | "denied") => void;
  onCancel: () => void;
}) {
  const handlePermissionDenied = async (mode: "read" | "readwrite") => {
    const result = await folder.requestPermission?.({ mode });
    onPermissionSelected(result === "granted" ? mode : "denied");
  };

  return (
    <>
      <DialogTitle>
        <Stack sx={{ flexDirection: "row", justifyContent: "space-between" }}>
          <span>モード選択： "{folder.name}"</span>
          <TooltipIconButton
            icon={<ArrowBack />}
            onClick={onCancel}
            sx={{ color: "steelblue" }}
            tooltipTitle="前のダイアログに戻ります"
          />
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Stack sx={{ gap: 2 }}>
          {/* 書き込み可能 */}
          <CardButton
            color="steelblue"
            title="自動保存モード（読み取り＆書き込み）"
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
            title="読み取り専用モード（読み取りのみ）"
            Icon={Lock}
            onClick={() => {
              void handlePermissionDenied("read");
            }}
          >
            閲覧や編集はできますが、保存は一切行われません。
          </CardButton>
        </Stack>
      </DialogContent>
    </>
  );
}
