import { DialogContent, DialogTitle, Stack } from "@mui/material";
import { Lock, LockOpen, Reply } from "@mui/icons-material";
import { CardButton } from "./ui/CardButton";
import TooltipIconButton from "@/components/share/TooltipIconButton";
import { modelフォルダ } from "../../../models/modelフォルダ";
import { useAtomValue } from "jotai";

/**
 * `folder` に対し、「読み込み専用」か「書き込み可能」かを選択するダイアログ
 */
export default function Dialogパーミッション選択() {
  const folder = useAtomValue(modelフォルダ.folder.atomValue);
  const reset = modelフォルダ.folder.useReset();
  const setPermission = modelフォルダ.folder.useSetPermission();

  if (!folder) return null;

  const handlePermissionSelected = async (mode: "read" | "readwrite") => {
    await setPermission(mode);
  };

  return (
    <>
      <DialogTitle>
        <Stack sx={{ flexDirection: "row", justifyContent: "space-between" }}>
          <span>モード選択： "{folder.name}"</span>
          <TooltipIconButton
            icon={<Reply />}
            onClick={reset}
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
            onClick={() => handlePermissionSelected("readwrite")}
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
            onClick={() => handlePermissionSelected("read")}
          >
            閲覧や編集はできますが、保存は一切行われません。
          </CardButton>
        </Stack>
      </DialogContent>
    </>
  );
}
