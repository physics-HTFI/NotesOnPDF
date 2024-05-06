import { FC, useContext, useState } from "react";
import { Box, Divider, IconButton, Tooltip } from "@mui/material";
import { FolderOpen, Language, Restore, Sync } from "@mui/icons-material";
import { InputStringDialog } from "./InputStringDialog";
import { HistoryDialog } from "./HistoryDialog";
import Waiting from "../../Fullscreen/Waiting";
import { ModelContext } from "@/contexts/ModelContext";
import useFileTree from "@/hooks/useFileTree";

const IS_MOCK = import.meta.env.VITE_IS_MOCK === "true";

/**
 * `Header`の引数
 */
interface Props {
  onSelectPdfById?: (id: string) => void;
  onSelectPdfByFile?: (file: File) => void;
}

/**
 * ファイルツリーの上部に表示されるボタンコントロール
 */
export const Header: FC<Props> = ({ onSelectPdfById, onSelectPdfByFile }) => {
  const { model } = useContext(ModelContext);
  const { reloadFileTree } = useFileTree();
  const [openUrl, setOpenUrl] = useState(false);
  const [openHistory, setOpenHistory] = useState(false);
  const [downloading, setDownloading] = useState(false);

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
        model
          .getIdFromExternalFile()
          .then((id) => {
            onSelectPdfById?.(id);
          })
          .catch(() => undefined);
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
      <Divider orientation="vertical" variant="middle" flexItem />

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
              .catch(() => undefined)
              .finally(() => {
                setDownloading(false);
              });
          }}
        />
      )}

      <Divider orientation="vertical" variant="middle" flexItem />
      <Tooltip title="ファイルツリーを更新します">
        <IconButton size="small" sx={sxButton} onClick={reloadFileTree}>
          <Sync />
        </IconButton>
      </Tooltip>

      {/* 開発ページを開く */}
      {/*
      <Divider orientation="vertical" variant="middle" flexItem />
      <Tooltip title="アプリ開発ページへのリンクを開く">
        <IconButton
          size="small"
          sx={sxButton}
          onClick={() => {
            open("https://github.com/physics-HTFI/NotesOnPDF");
          }}
        >
          <MenuBook />
        </IconButton>
      </Tooltip>
      */}
      <Waiting isWaiting={downloading} />
    </Box>
  );
};
