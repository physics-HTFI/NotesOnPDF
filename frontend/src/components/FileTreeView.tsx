import React from "react";
import { ExpandMore, ChevronRight } from "@mui/icons-material";
import { alpha, styled } from "@mui/material/styles";
import { TreeView, TreeItem, treeItemClasses } from "@mui/x-tree-view";
import { FileTree } from "../types/FileTree";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-regular-svg-icons";

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
  const files: FileTree = [
    [
      "dir1/",
      [
        [
          "dir1/dir2/",
          ["dir1/dir2/file121", "dir1/dir2/file122", "dir1/dir2/file123"],
        ],
        "dir1/file11",
        "dir1/file12",
      ],
    ],
    "file1",
    "file2",
  ];

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
      {getTreeItems(files)}
    </TreeView>
  );
};

export default FileTreeView;
