import { useContext, useState } from "react";
import { Box } from "@mui/material";
import { Lock, LockOpen, Reply, Restore } from "@mui/icons-material";
import HistoryDialog from "./HistoryDialog";
import UiContext from "@/contexts/UiContext";
import ModelContext from "@/contexts/ModelContext/ModelContext";
import TooltipIconButton from "@/components/common/TooltipIconButton";
import { model起動直後 } from "@/components/state起動直後/model起動直後";

/**
 * ファイルツリーの上部に表示されるボタンコントロール
 */
export default function Header({
  onSelectPdfById,
}: {
  onSelectPdfById?: (id: string) => void;
}) {
  const { initialized } = useContext(ModelContext);
  const { readOnly, setReadOnly } = useContext(UiContext);
  const [openHistory, setOpenHistory] = useState(false);
  const reset = model起動直後.useReset();

  const sxButton = { color: "slategray" };

  return (
    <Box
      sx={{
        mb: 0.5,
        borderBottom: "solid 1px gainsboro",
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      {/* 読み取り専用 */}
      <TooltipIconButton
        disabled={!initialized}
        icon={readOnly ? <Lock /> : <LockOpen />}
        onClick={() => {
          setReadOnly(!readOnly);
        }}
        sx={{
          mr: "auto",
          ...sxButton,
          ...(readOnly ? { color: "firebrick" } : {}),
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
        onClick={() => {
          setOpenHistory(true);
        }}
        sx={sxButton}
        tooltipTitle="アクセス履歴からPDFファイルを開きます"
      />
      <HistoryDialog
        open={initialized && openHistory}
        onClose={(id) => {
          setOpenHistory(false);
          if (!id) return;
          onSelectPdfById?.(id);
        }}
      />

      {/* 基準フォルダ選択画面に戻る */}
      <TooltipIconButton
        disabled={!initialized}
        icon={<Reply />}
        onClick={reset}
        sx={sxButton}
        tooltipTitle="初期画面に戻ります"
      />
    </Box>
  );
}
