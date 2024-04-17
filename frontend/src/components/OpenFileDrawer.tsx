import { FC, useEffect, useState } from "react";
import { Box, Drawer } from "@mui/material";
import { Coverages } from "@/types/Coverages";
import IModel from "@/models/IModel";
import { FileTree } from "@/types/FileTree";
import { TreeView } from "@mui/x-tree-view";
import { KeyboardArrowDown, KeyboardArrowRight } from "@mui/icons-material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-regular-svg-icons";
import getTreeItems from "@/components/OpenFileDrawer/getTreeItems";
import HeaderIcons from "@/components/OpenFileDrawer/HeaderIcons";

/**
 * `OpenFileDrawer`の引数
 */
interface Props {
  open: boolean;
  coverages?: Coverages;
  model: IModel;
  onClose: () => void;
  onSelectPdfById?: (id: string) => void;
  onSelectPdfByFile?: (file: File) => void;
}

/**
 * ファイル一覧を表示するドロワー
 */
const OpenFileDrawer: FC<Props> = ({
  open,
  coverages,
  model,
  onClose,
  onSelectPdfById,
  onSelectPdfByFile,
}) => {
  const [fileTree, setFileTree] = useState<FileTree>([]);
  const [expanded, setExpanded] = useState<string[]>([]);
  const [selectedPath, setSelectedPath] = useState<string>("");

  // ファイル一覧を取得
  useEffect(() => {
    model
      .getFileTree()
      .then((files) => {
        setFileTree(files);
      })
      .catch(() => undefined);
  }, [model]);

  // 前回のファイルを選択した状態にする
  // TODO coveragesの数値が、ファイル名の横につかない
  // TODO coveragesからfileTreeにないファイルを消去する
  useEffect(() => {
    const path = coverages?.recentPath;
    if (path === undefined) return;
    setSelectedPath(path);
    setExpanded(
      [...path.matchAll(/(?<=[\\/])/g)].map((m) =>
        path.substring(0, m.index - 1)
      )
    );
  }, [fileTree, selectedPath, coverages]);

  return (
    <Drawer
      anchor="left"
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
        model={model}
        onSelectPdfByFile={onSelectPdfByFile}
        onSelectPdfById={onSelectPdfById}
      />

      <Box sx={{ position: "relative" }}>
        {/* ツリービュー */}
        <TreeView
          expanded={expanded}
          selected={selectedPath}
          defaultCollapseIcon={<KeyboardArrowDown />}
          defaultEndIcon={<FontAwesomeIcon icon={faFilePdf} />}
          defaultExpandIcon={<KeyboardArrowRight />}
          onNodeSelect={(_, path) => {
            const isDirectory = fileTree.some(
              (i) => i.path === path && i.children !== null
            );
            if (isDirectory) return;
            setSelectedPath(path);
            const id = fileTree.find((i) => i.path === path)?.id;
            if (id === undefined) return;
            onSelectPdfById?.(path);
          }}
          onNodeToggle={(_, nodeIds) => {
            setExpanded(nodeIds);
          }}
        >
          {getTreeItems(fileTree, coverages)}
        </TreeView>
      </Box>
    </Drawer>
  );
};

export default OpenFileDrawer;
