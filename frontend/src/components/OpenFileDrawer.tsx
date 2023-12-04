import React, { useEffect, useState } from "react";
import { Drawer } from "@mui/material";
import { Progresses } from "@/types/Progresses";
import IModel from "@/models/IModel";
import { FileTree } from "@/types/FileTree";
import { TreeView } from "@mui/x-tree-view";
import { KeyboardArrowDown, KeyboardArrowRight } from "@mui/icons-material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-regular-svg-icons";
import getTreeItems from "./OpenFileDrawer/getTreeItems";
import IconButtons from "./OpenFileDrawer/IconButtons";

/**
 * `OpenFileDrawer`の引数
 */
interface Props {
  open: boolean;
  progresses?: Progresses;
  model: IModel;
  onClose: () => void;
  onSelect: (pdfPath: string) => void;
}

/**
 * ファイル一覧を表示するドロワー
 */
const OpenFileDrawer: React.FC<Props> = ({
  open,
  progresses,
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
      <IconButtons
        onOpenFile={(file) => {
          console.log(file?.name);
        }}
        onOpenURL={(url) => {
          console.log(url);
        }}
      />
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
    </Drawer>
  );
};

export default OpenFileDrawer;
