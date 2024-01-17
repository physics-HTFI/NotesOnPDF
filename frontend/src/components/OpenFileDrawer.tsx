import { FC, useContext, useEffect, useState } from "react";
import { Box, Drawer, IconButton, Tooltip } from "@mui/material";
import { Progresses } from "@/types/Progresses";
import IModel from "@/models/IModel";
import { FileTree } from "@/types/FileTree";
import { TreeView } from "@mui/x-tree-view";
import {
  KeyboardArrowDown,
  KeyboardArrowRight,
  Settings,
} from "@mui/icons-material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-regular-svg-icons";
import getTreeItems from "@/components/OpenFileDrawer/getTreeItems";
import HeaderIcons from "@/components/OpenFileDrawer/HeaderIcons";
import InputStringDialog from "./Fullscreen/InputStringDialog";
import { AppSettingsContext } from "@/contexts/AppSettingsContext";

/**
 * `OpenFileDrawer`の引数
 */
interface Props {
  open: boolean;
  progresses?: Progresses;
  model: IModel;
  rootPath?: string;
  onClose: () => void;
  onSelect: (pdf: string | File) => void;
}

/**
 * ファイル一覧を表示するドロワー
 */
const OpenFileDrawer: FC<Props> = ({
  open,
  progresses,
  model,
  rootPath,
  onClose,
  onSelect,
}) => {
  const [fileTree, setFileTree] = useState<FileTree>([]);
  const [expanded, setExpanded] = useState<string[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [openChangeRoot, setOpenChangeRoot] = useState(false);
  const { appSettings, setAppSettings } = useContext(AppSettingsContext);

  // ファイル一覧を取得
  useEffect(() => {
    if (!rootPath) return;
    model
      .getFileTree(rootPath)
      .then((files) => {
        setFileTree(files);
      })
      .catch(() => undefined);
  }, [model, rootPath]);

  // 前回のファイルを選択した状態にする
  useEffect(() => {
    if (selected !== "" || !progresses?.recentPath) return;
    const path = progresses.recentPath;
    setSelected(path);
    setExpanded(
      [...path.matchAll(/(?<=[\\/])/g)].map((m) =>
        path.substring(0, m.index ?? 0)
      )
    );
  }, [selected, progresses]);

  return (
    <Drawer
      anchor={"left"}
      open={open}
      onClose={onClose}
      PaperProps={{
        square: false,
        sx: {
          borderRadius: "0 5px 5px 0",
          color: "dimgray",
          maxWidth: 500,
          minWidth: 280,
          overflowX: "hidden",
        },
      }}
      onWheel={(e) => {
        e.stopPropagation();
      }}
    >
      {/* ヘッダーアイコン */}
      <HeaderIcons
        onOpenFile={(file: string | File) => {
          onSelect(file);
        }}
      />

      <Box sx={{ position: "relative" }}>
        {/* ツリービュー */}
        <TreeView
          expanded={expanded}
          selected={selected}
          defaultCollapseIcon={<KeyboardArrowDown />}
          defaultEndIcon={<FontAwesomeIcon icon={faFilePdf} />}
          defaultExpandIcon={<KeyboardArrowRight />}
          onNodeSelect={(_, nodeIds) => {
            if (nodeIds.match(/[\\/]$/)) return; // フォルダの時は何もしない
            setSelected(nodeIds);
            onSelect(nodeIds);
          }}
          onNodeToggle={(_, nodeIds) => {
            setExpanded(nodeIds);
          }}
        >
          {getTreeItems(fileTree, progresses)}
        </TreeView>

        {/* ルートフォルダの設定 */}
        <Tooltip title="ファイルツリーのルートフォルダを設定します">
          <IconButton
            sx={{
              "&:focus": { outline: "none" },
              color: "slategray",
              position: "absolute",
              right: 0,
              top: -2,
            }}
            onClick={() => {
              setOpenChangeRoot(true);
            }}
            size="small"
          >
            <Settings fontSize="small" />
          </IconButton>
        </Tooltip>
        {openChangeRoot && (
          <InputStringDialog
            defaultValue={appSettings?.rootPath ?? ""}
            title="ルートディレクトリを変更する"
            label="ディレクトリのパス"
            onClose={(rootPath) => {
              setOpenChangeRoot(false);
              if (!rootPath || !setAppSettings || !appSettings) return;
              setAppSettings({ ...appSettings, rootPath });
            }}
          />
        )}
      </Box>
    </Drawer>
  );
};

export default OpenFileDrawer;
