import { Lock, LockOpen } from "@mui/icons-material";
import TooltipIconButton from "../common/TooltipIconButton";
import { modelフォルダ } from "../state起動直後/modelフォルダ";
import { useAtom } from "jotai";

export function ButtonToggleReadOnly({ disabled }: { disabled: boolean }) {
  const [readOnly, setReadOnly] = useAtom(modelフォルダ.readOnly.atom);

  return (
    <TooltipIconButton
      disabled={disabled}
      icon={readOnly ? <Lock /> : <LockOpen />}
      onClick={() => setReadOnly(!readOnly)}
      sx={{
        mr: "auto",
        color: readOnly ? "firebrick" : undefined,
      }}
      tooltipTitle={
        readOnly ? (
          <span>
            【読み取り専用モード】
            <br />
            閲覧・編集はできますが、保存は一切されません
          </span>
        ) : (
          <span>
            【自動保存モード】
            <br />
            変更が加えられた際に、注釈ファイルを自動保存します
            <br />
            注釈ファイル名は &quot;(PDFファイルパス).json&quot; です
          </span>
        )
      }
    />
  );
}
