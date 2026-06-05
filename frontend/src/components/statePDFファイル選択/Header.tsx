import { useContext, useState } from "react";
import { Box } from "@mui/material";
import { Lock, LockOpen, Reply, Restore } from "@mui/icons-material";
import DialogHistory from "./DialogHistory/DialogHistory";
import ModelContext from "@/contexts/ModelContext/ModelContext";
import TooltipIconButton from "@/components/common/TooltipIconButton";
import { model起動直後 } from "@/components/state起動直後/model起動直後";

/**
 * ファイルツリーの上部に表示されるボタンコントロール
 */
export default function Header({
  onSelectPath: onSelectPdfById,
}: {
  onSelectPath?: (id: string) => void;
}) {
  const { initialized } = useContext(ModelContext);
  const [readOnly, setReadOnly] = model起動直後.readOnly.use();
  const [openHistory, setOpenHistory] = useState(false);
  const reset = model起動直後.useReset();

  return (
    <Box
      sx={{
        mb: 0.5,
        borderBottom: "solid 1px gainsboro",
        display: "flex",
        color: "slategray",
      }}
    >
      {/* 読み取り専用 */}
      <TooltipIconButton
        disabled={!initialized}
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

      {/* アクセス履歴からPDFファイルを開く */}
      <TooltipIconButton
        disabled={!initialized}
        icon={<Restore />}
        onClick={() => setOpenHistory(true)}
        tooltipTitle="アクセス履歴からPDFファイルを開きます"
      />
      <DialogHistory
        open={initialized && openHistory}
        onClose={(id) => {
          setOpenHistory(false);
          if (!id) return;
          onSelectPdfById?.(id);
        }}
      />

      {/* ルートフォルダ選択画面に戻る */}
      <TooltipIconButton
        icon={<Reply />}
        onClick={reset}
        tooltipTitle="初期画面に戻ります"
      />
    </Box>
  );
}
