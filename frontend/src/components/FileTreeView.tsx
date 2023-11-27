import React, { useEffect, useState } from "react";
import { ExpandMore, ChevronRight } from "@mui/icons-material";
import { TreeView } from "@mui/x-tree-view";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-regular-svg-icons";
import { FileTree } from "@/types/FileTree";
import { Progresses } from "@/types/Progresses";
import IModel from "@/model/IModel";
import getTreeItems from "./FileTreeView/getTreeItems";

/**
 * `FileTreeView`の引数
 */
interface Props {
  onSelect: (pdfPath: string) => void;
  Progresses: Progresses;
  model?: IModel;
}

/**
 * ファイル一覧を表示するツリービュー
 */
const FileTreeView: React.FC<Props> = ({ model, onSelect, Progresses }) => {
  const [fileTree, setFileTree] = useState<FileTree>([]);

  useEffect(() => {
    model
      ?.getFileTree()
      .then((files) => {
        setFileTree(files);
      })
      .catch(() => {
        setFileTree([]);
      });
  }, [model]);

  const expanded = Progresses.recentPath
    ? [...Progresses.recentPath]
        .map<[string, number]>((c, i) => [c, i])
        .filter((ci) => ci[0].match(/[\\/]/))
        .map((ci) => Progresses.recentPath?.substring(0, ci[1] + 1) ?? "")
    : [];

  return (
    <TreeView
      defaultCollapseIcon={<ExpandMore />}
      defaultEndIcon={<FontAwesomeIcon icon={faFilePdf} />}
      defaultExpanded={expanded}
      defaultExpandIcon={<ChevronRight />}
      defaultSelected={Progresses.recentPath}
      onNodeSelect={(_, nodeIds) => {
        if (nodeIds.match(/[\\/]$/)) return; // フォルダの時は何もしない
        onSelect(nodeIds);
      }}
      sx={{
        overflowX: "hidden",
        minWidth: 300,
        color: "dimgray",
        mt: 1,
      }}
    >
      {getTreeItems(fileTree, Progresses)}
    </TreeView>
  );
};

export default FileTreeView;
