import { useContext, useState } from "react";
import { Box, Divider, IconButton, Tooltip } from "@mui/material";
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
import Waiting from "../../Fullscreen/Waiting";
import UiStateContext from "@/contexts/UiStateContext";
import ModelContext from "@/contexts/ModelContext";
import FileTreeContext from "@/contexts/FileTreeContext";

/**
 * ファイルツリーの上部に表示されるボタンコントロール
 */
export default function Header({
  onSelectPdfById,
}: {
  onSelectPdfById?: (id: string) => void;
}) {
  const { model, modelFlags } = useContext(ModelContext);
  const { readOnly, setReadOnly, setErrorMessage, setInfoMessage } =
    useContext(UiStateContext);
  const { initialized } = useContext(FileTreeContext);
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
      <Tooltip
        title={
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
      >
        <span style={{ marginRight: "auto" }}>
          <IconButton
            disabled={!initialized || !modelFlags.canToggleReadOnly}
            sx={readOnly ? { color: "firebrick" } : sxButton}
            onClick={() => {
              setReadOnly(!readOnly);
            }}
            size="small"
          >
            {readOnly ? <Lock /> : <LockOpen />}
          </IconButton>
        </span>
      </Tooltip>

      {/* アクセス履歴からPDFファイルを開く */}
      <Tooltip title="アクセス履歴からPDFファイルを開きます">
        <span>
          <IconButton
            disabled={!initialized || !modelFlags.canOpenHistory}
            sx={sxButton}
            onClick={() => {
              setOpenHistory(true);
            }}
            size="small"
          >
            <Restore />
          </IconButton>
        </span>
      </Tooltip>
      <HistoryDialog
        open={openHistory}
        onClose={(id) => {
          setOpenHistory(false);
          if (!id) return;
          onSelectPdfById?.(id);
        }}
      />

      {/* PC内のPDFファイルを開く */}
      <Tooltip
        title={
          <span>
            ファイルツリー外のPDFファイルを開きます
            {modelFlags.isWeb && <br />}
            {modelFlags.isWeb && "(ウェブ版では使用できません)"}
          </span>
        }
      >
        <span>
          <IconButton
            disabled={!initialized || !modelFlags.canOpenFileDialog}
            sx={sxButton}
            size="small"
            onClick={() => {
              setInfoMessage(
                <span>
                  ファイルを選択してください
                  <br />
                  選択ダイアログは、ブラウザの後ろに隠れていることがあります
                </span>
              );
              model
                .getIdFromExternalFile()
                .then((id) => {
                  if (id === "") return;
                  onSelectPdfById?.(id);
                })
                .catch(() => {
                  setErrorMessage(model.getMessage("PDFファイルの取得"));
                })
                .finally(() => {
                  setInfoMessage(undefined);
                });
            }}
          >
            <FolderOpen />
          </IconButton>
        </span>
      </Tooltip>

      {/* URLから開く */}
      <Tooltip
        title={
          <span>
            URLからPDFファイルを開きます
            {modelFlags.isWeb && <br />}
            {modelFlags.isWeb && "(ウェブ版では使用できません)"}
          </span>
        }
      >
        <span>
          <IconButton
            disabled={!initialized || !modelFlags.canOpenFileDialog}
            sx={sxButton}
            size="small"
            onClick={() => {
              setOpenUrl(true);
            }}
          >
            <Language />
          </IconButton>
        </span>
      </Tooltip>
      {openUrl && modelFlags.canOpenFileDialog && (
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
                setErrorMessage(model.getMessage("PDFファイルのダウンロード"));
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
          <Tooltip title="NotesOnPdf 開発ページへのリンクを開きます">
            <IconButton
              size="small"
              sx={sxButton}
              onClick={() => {
                open("https://github.com/physics-HTFI/NotesOnPDF");
              }}
            >
              <GitHub />
              {/* <MenuBook /> */}
            </IconButton>
          </Tooltip>
        </>
      )}

      <Waiting isWaiting={downloading} />
    </Box>
  );
}
