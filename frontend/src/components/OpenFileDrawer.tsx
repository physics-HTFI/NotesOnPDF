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
  onSelect: (pdf: string | File, path: string) => void;
}

/**
 * ファイル一覧を表示するドロワー
 */
const OpenFileDrawer: FC<Props> = ({
  open,
  coverages,
  model,
  onClose,
  onSelect,
}) => {
  const [fileTree, setFileTree] = useState<FileTree>([]);
  const [expanded, setExpanded] = useState<string[]>([]);
  const [selected, setSelected] = useState<string>("");

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
  // TODO 効いていない
  // TODO coveragesの数値が、ファイル名の横につかない
  useEffect(() => {
    if (selected !== "" || !coverages?.recentPath) return;
    const path = coverages.recentPath;
    setSelected(path);
    setExpanded(
      [...path.matchAll(/(?<=[\\/])/g)].map((m) =>
        path.substring(0, m.index ?? 0)
      )
    );
  }, [selected, coverages]);

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
        onOpenFile={(file: File) => {
          onSelect(file, file.name);
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
            const isDirectory = fileTree.some(
              (i) => i.id === nodeIds && i.children !== null
            );
            if (isDirectory) return;
            const path = fileTree.find((f) => f.id === nodeIds)?.path ?? "";
            setSelected(nodeIds);
            onSelect(nodeIds, path);
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
