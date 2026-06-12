import { useState } from "react";
import { Box } from "@mui/material";
import { Reply, Restore } from "@mui/icons-material";
import DialogPdfHistory from "./DialogPdfHistory/DialogPdfHistory";
import TooltipIconButton from "@/components/share/TooltipIconButton";
import { modelフォルダ } from "@/models/modelフォルダ";
import { ButtonToggleReadOnly } from "./ButtonToggleReadOnly/ButtonToggleReadOnly";
import { useAtomValue, useSetAtom } from "jotai";
import { modelファイル } from "../../models/modelファイル";

/**
 * ファイルツリーの上部に表示されるボタンコントロール
 */
export default function Header() {
  const fileTree = useAtomValue(modelファイル.fileTree.atomValue);
  const [openHistory, setOpenHistory] = useState(false);
  const reset = useSetAtom(modelフォルダ.folder.atomReset);

  const disabled = !fileTree;
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
      <ButtonToggleReadOnly disabled={disabled} />

      {/* アクセス履歴からPDFファイルを開く */}
      <TooltipIconButton
        disabled={disabled}
        icon={<Restore />}
        onClick={() => setOpenHistory(true)}
        tooltipTitle="アクセス履歴からPDFファイルを開きます"
      />
      <DialogPdfHistory
        open={!disabled && openHistory}
        onClose={() => setOpenHistory(false)}
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
