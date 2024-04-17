import { FC, useState } from "react";
import { Box, Divider, IconButton, Tooltip } from "@mui/material";
import { FolderOpen, Language, Restore } from "@mui/icons-material";
import InputStringDialog from "./InputStringDialog";
import IModel from "@/models/IModel";
import HistoryDialog from "./HIstoryDialog";

const IS_MOCK = import.meta.env.VITE_IS_MOCK === "true";

/**
 * `HeaderIcons`の引数
 */
interface Props {
  model: IModel;
  onSelectPdfById?: (id: string) => void;
  onSelectPdfByFile?: (file: File) => void;
}

const sxButton = { "&:focus": { outline: "none" }, color: "slategray" };

/**
 * ファイルツリーの上部に表示されるボタンコントロール
 */
const HeaderIcons: FC<Props> = ({
  model,
  onSelectPdfById,
  onSelectPdfByFile,
}) => {
  const [openUrl, setOpenUrl] = useState(false);
  const [openHistory, setOpenHistory] = useState(false);

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
        model={model}
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
          {openUrl && !IS_MOCK && (
            <InputStringDialog
              title="URLからPDFファイルを開く"
              label="URL"
              onClose={(url) => {
                setOpenUrl(false);
                if (!url) return;
                model
                  .getIdFromUrl(url)
                  .then((id) => {
                    onSelectPdfById?.(id);
                  })
                  .catch(() => undefined);
              }}
            />
          )}
        </span>
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
    </Box>
  );
};

export default HeaderIcons;
