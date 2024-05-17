import { useContext, useState } from "react";
import {
  Alert,
  Backdrop,
  Box,
  Divider,
  IconButton,
  Snackbar,
  Tooltip,
} from "@mui/material";
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
import useModel from "@/hooks/useModel";
import UiStateContext from "@/contexts/UiStateContext";

const IS_MOCK = import.meta.env.VITE_IS_WEB === "true";

/**
 * ファイルツリーの上部に表示されるボタンコントロール
 */
export default function Header({
  onSelectPdfById,
  onSelectPdfByFile,
}: {
  onSelectPdfById?: (id: string) => void;
  onSelectPdfByFile?: (file: File) => void;
}) {
  const { model, setAccessFailedReason } = useModel();
  const { readOnly, setReadOnly } = useContext(UiStateContext);
  const [openUrl, setOpenUrl] = useState(false);
  const [openHistory, setOpenHistory] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);

  const handleSelectExternalPdf = IS_MOCK
    ? () => {
        new Promise<File | null>((resolve, reject) => {
          const input = document.createElement("input");
          input.type = "file";
          input.accept = "application/pdf";
          input.onchange = (e) => {
            const target = e.target as HTMLInputElement | null;
            const file = target?.files?.[0];
            if (!file) reject();
            else resolve(file);
          };
          input.click();
        })
          .then((file) => {
            if (!file) return;
            onSelectPdfByFile?.(file);
          })
          .catch(() => undefined);
      }
    : () => {
        setOpenAlert(true);
        model
          .getIdFromExternalFile()
          .then((id) => {
            if (id === "") return;
            onSelectPdfById?.(id);
          })
          .catch(() => {
            setAccessFailedReason("PDFファイルの取得");
          })
          .finally(() => {
            setOpenAlert(false);
          });
      };

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
              編集はできますが、保存は一切されません
            </span>
          ) : (
            <span>
              【自動保存モード】
              <br />
              変更が加えられた際に、注釈ファイルを自動保存します
              <br />
              注釈ファイル名は&quot;(PDFファイル名).json&quot;です
            </span>
          )
        }
      >
        <span style={{ marginRight: "auto" }}>
          <IconButton
            sx={sxButton}
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
      <Tooltip title="ファイルツリー外のPDFファイルを開きます">
        <span>
          <IconButton
            sx={sxButton}
            size="small"
            onClick={handleSelectExternalPdf}
          >
            <FolderOpen />
          </IconButton>
        </span>
      </Tooltip>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openAlert}
      >
        <Snackbar open>
          <Alert
            elevation={6}
            variant="filled"
            severity="info"
            sx={{ width: "100%" }}
          >
            ファイルを選択してください
            <br />
            選択ダイアログは、ブラウザの後ろに隠れていることがあります
          </Alert>
        </Snackbar>
      </Backdrop>

      {/* URLから開く */}
      <Tooltip title="URLからPDFファイルを開きます">
        <span>
          <IconButton
            disabled={IS_MOCK}
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
      {openUrl && !IS_MOCK && (
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
                setAccessFailedReason("PDFファイルのダウンロード");
              })
              .finally(() => {
                setDownloading(false);
              });
          }}
        />
      )}

      {/* 開発ページを開く */}
      <Divider orientation="vertical" variant="middle" flexItem />
      <Tooltip title="アプリ開発ページへのリンクを開きます">
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

      <Waiting isWaiting={downloading} />
    </Box>
  );
}
