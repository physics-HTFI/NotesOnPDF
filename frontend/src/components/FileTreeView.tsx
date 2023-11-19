import React, { useEffect, useState } from "react";
import { ExpandMore, ChevronRight } from "@mui/icons-material";
import { TreeView } from "@mui/x-tree-view";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-regular-svg-icons";
import { FileTree } from "../types/FileTree";
import getTreeItems from "./FileTreeView/getTreeItems";
import { PDFsInfo } from "../types/PDFsInfo";
import IModel from "../model/IModel";

/**
 * `FileTreeView`の引数
 */
interface Props {
  onSelect: (pdfPath: string) => void;
  pdfsInfo: PDFsInfo;
  model: IModel;
}

/**
 * ファイル一覧を表示するツリービュー
 */
const FileTreeView: React.FC<Props> = ({ model, onSelect, pdfsInfo }) => {
  const [fileTree, setFileTree] = useState<FileTree>([]);

  useEffect(() => {
    model
      .getFileTree()
      .then((files) => {
        setFileTree(files);
      })
      .catch(() => {
        setFileTree([]);
      });
  }, [model]);

  const expanded = pdfsInfo.recentPath
    ? [...pdfsInfo.recentPath]
        .map<[string, number]>((c, i) => [c, i])
        .filter((ci) => ci[0].match(/[\\/]/))
        .map((ci) => pdfsInfo.recentPath?.substring(0, ci[1] + 1) ?? "")
    : [];

  return (
    <TreeView
      defaultCollapseIcon={<ExpandMore />}
      defaultEndIcon={<FontAwesomeIcon icon={faFilePdf} />}
      defaultExpanded={expanded}
      defaultExpandIcon={<ChevronRight />}
      defaultSelected={pdfsInfo.recentPath}
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
      {getTreeItems(fileTree, pdfsInfo)}
    </TreeView>
  );
};

export default FileTreeView;
