import React, { useContext, useEffect, useState } from "react";
import { ExpandMore, ChevronRight } from "@mui/icons-material";
import { alpha, styled } from "@mui/material/styles";
import { TreeView, TreeItem, treeItemClasses } from "@mui/x-tree-view";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-regular-svg-icons";
import ModelContext from "../model/ModelContext";
import { FileTree } from "../types/FileTree";

const StyledTreeItem = styled(TreeItem)(({ theme }) => ({
  [`& .${treeItemClasses.iconContainer}`]: {
    "& .close": {
      opacity: 0.3,
    },
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 15,
    paddingLeft: 18,
    borderLeft: `1px solid ${alpha(theme.palette.text.primary, 0.15)}`,
  },
}));

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

  const getTreeItems = (f: FileTree) =>
    f.map((i) => {
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
