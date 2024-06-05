import { useContext, useState } from "react";
import { Box, Divider } from "@mui/material";
import {
  FolderOpen,
  GitHub,
  Language,
  Lock,
  LockOpen,
  Restore,
} from "@mui/icons-material";
import InputStringDialog from "./InputStringDialog";
import HistoryDialog from "./HistoryDialog";
import Waiting from "../../dialogs/Waiting";
import UiContext from "@/contexts/UiContext";
import ModelContext from "@/contexts/ModelContext/ModelContext";
import TooltipIconButton from "@/components/common/TooltipIconButton";

/**
 * ファイルツリーの上部に表示されるボタンコントロール
 */
export default function Header({
  onSelectPdfById,
}: {
  onSelectPdfById?: (id: string) => void;
}) {
  const { model, modelFlags, initialized } = useContext(ModelContext);
  const { readOnly, setReadOnly, setAlert } = useContext(UiContext);
  const [openUrl, setOpenUrl] = useState(false);
  const [openHistory, setOpenHistory] = useState(false);
  const [downloading, setDownloading] = useState(false);

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
        disabled={!initialized || !modelFlags.canToggleReadOnly}
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
        disabled={!initialized || !modelFlags.canOpenHistory}
        icon={<Restore />}
        onClick={() => {
          setOpenHistory(true);
        }}
        sx={sxButton}
        tooltipTitle="アクセス履歴からPDFファイルを開きます"
      />
      <HistoryDialog
        open={!!initialized && openHistory}
        onClose={(id) => {
          setOpenHistory(false);
          if (!id) return;
          onSelectPdfById?.(id);
        }}
      />

      {/* PC内のPDFファイルを開く */}
      <TooltipIconButton
        disabled={!initialized || !modelFlags.canOpenFileDialog}
        icon={<FolderOpen />}
        onClick={() => {
          setAlert(
            "info",
            <span>
              ファイルを選択してください
              <br />
              選択ダイアログは、ブラウザの後ろに隠れていることがあります
            </span>
          );
          model
            .getIdFromExternalFile()
            .then((id) => {
              setAlert();
              if (id === "") return;
              onSelectPdfById?.(id);
            })
            .catch(() => {
              setAlert("error", "PDFファイルの取得に失敗しました");
            });
        }}
        sx={sxButton}
        tooltipTitle={
          <span>
            ファイルツリー外のPDFファイルを開きます
            {modelFlags.isWeb && <br />}
            {modelFlags.isWeb && "(ウェブ版では使用できません)"}
          </span>
        }
      />

      {/* URLから開く */}
      <TooltipIconButton
        disabled={!initialized || !modelFlags.canOpenFileDialog}
        icon={<Language />}
        onClick={() => {
          setOpenUrl(true);
        }}
        sx={sxButton}
        tooltipTitle={
          <span>
            URLからPDFファイルを開きます
            {modelFlags.isWeb && <br />}
            {modelFlags.isWeb && "(ウェブ版では使用できません)"}
          </span>
        }
      />
      {initialized && openUrl && modelFlags.canOpenFileDialog && (
        <InputStringDialog
          title="URLからPDFファイルを開く"
          label="URL"
          onClose={(url) => {
            setOpenUrl(false);
            if (!url) return;
            setDownloading(true);
            model
              .getIdFromUrl(url)
              .then((id) => {
                onSelectPdfById?.(id);
              })
              .catch(() => {
                setAlert("error", "PDFファイルのダウンロードに失敗しました");
              })
              .finally(() => {
                setDownloading(false);
              });
          }}
        />
      )}

      {/* 開発ページを開く */}
      {modelFlags.canOpenGithub && (
        <>
          <Divider orientation="vertical" variant="middle" flexItem />
          <TooltipIconButton
            icon={<GitHub />}
            onClick={() => {
              open("https://github.com/physics-HTFI/NotesOnPDF");
            }}
            sx={sxButton}
            tooltipTitle="NotesOnPdf 開発ページへのリンクを開きます"
          />
        </>
      )}

      <Waiting isWaiting={downloading} />
    </Box>
  );
}
