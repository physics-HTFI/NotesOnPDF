import React, { useContext, useEffect, useState } from "react";
import { ExpandMore, ChevronRight } from "@mui/icons-material";
import { TreeView } from "@mui/x-tree-view";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-regular-svg-icons";
import ModelContext from "../model/ModelContext";
import { FileTree } from "../types/FileTree";
import StyledTreeItem from "./FileTreeView/StyledTreeItem";

/**
 * 使用方法：`<TreeView> {getTreeItems(fileTree)} </TreeView>`
 */
const getTreeItems = (fileTree: FileTree) =>
  fileTree.map((i) => {
    const getFileName = (path: string) =>
      path.match(/[^\\/]+(?=[\\/]?$)/) ?? ""; // "dir1/di2/" => "dir2"
    if (typeof i === "string") {
      return <StyledTreeItem label={getFileName(i)} nodeId={i} key={i} />;
    }
    return (
      <StyledTreeItem label={getFileName(i[0])} nodeId={i[0]} key={i[0]}>
        {getTreeItems(i[1])}
      </StyledTreeItem>
    );
  });

/**
 * ファイル一覧を表示するツリービュー
 */
const FileTreeView: React.FC = () => {
  const modelContext = useContext(ModelContext);
  const [fileTree, setFileTree] = useState<FileTree>([]);

  useEffect(() => {
    if (!modelContext) {
      setFileTree([]);
      return;
    }
    modelContext
      .getFiles("")
      .then((files) => {
        setFileTree(files);
      })
      .catch(() => {
        setFileTree([]);
      });
  }, [modelContext]);

  return (
    <TreeView
      defaultCollapseIcon={<ExpandMore />}
      defaultExpandIcon={<ChevronRight />}
      defaultEndIcon={<FontAwesomeIcon icon={faFilePdf} />}
      sx={{
        overflowX: "hidden",
        borderRadius: 3,
        minWidth: 300,
        color: "dimgray",
      }}
    >
      {getTreeItems(fileTree)}
    </TreeView>
  );
};

export default FileTreeView;
