import { useContext, useState } from "react";
import { Box } from "@mui/material";
import { Reply, Restore } from "@mui/icons-material";
import DialogPdfHistory from "./DialogPdfHistory/DialogPdfHistory";
import ModelContext from "@/contexts/ModelContext/ModelContext";
import TooltipIconButton from "@/components/common/TooltipIconButton";
import { modelフォルダ } from "@/components/state起動直後/modelフォルダ";
import { ButtonToggleReadOnly } from "./ButtonToggleReadOnly/ButtonToggleReadOnly";

/**
 * ファイルツリーの上部に表示されるボタンコントロール
 */
export default function Header({
  onSelectPath: onSelectPdfById,
}: {
  onSelectPath?: (id: string) => void;
}) {
  const { initialized } = useContext(ModelContext);
  const [openHistory, setOpenHistory] = useState(false);
  const reset = modelフォルダ.folder.useReset();

  return (
    <Box
      sx={{
        mb: 0.5,
        borderBottom: "solid 1px gainsboro",
        display: "flex",
        color: "slategray",
      }}
    >
      {/* パーミッション切替ボタン */}
      <ButtonToggleReadOnly disabled={!initialized} />

      {/* アクセス履歴からPDFファイルを開く */}
      <TooltipIconButton
        disabled={!initialized}
        icon={<Restore />}
        onClick={() => setOpenHistory(true)}
        tooltipTitle="アクセス履歴からPDFファイルを開きます"
      />
      <DialogPdfHistory
        open={initialized && openHistory}
        onClose={(id) => {
          setOpenHistory(false);
          if (!id) return;
          onSelectPdfById?.(id);
        }}
      />

      {/* 初期画面に戻るボタン */}
      <TooltipIconButton
        icon={<Reply />}
        onClick={reset}
        tooltipTitle="初期画面に戻ります"
      />
    </Box>
  );
}
