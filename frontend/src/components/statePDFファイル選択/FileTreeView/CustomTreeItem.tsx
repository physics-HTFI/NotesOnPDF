import type { FileTree, FileTreeItemPdf } from "@/types/FileTree";
import { alpha, styled } from "@mui/material";
import {
  TreeItem,
  treeItemClasses,
  useTreeItemModel,
  type TreeItemProps,
} from "@mui/x-tree-view";
import React from "react";
import { CustomLabel, type CustomLabelProps } from "./CustomLabel";
import { useAtomValue } from "jotai";
import { modelPDFファイル } from "../modelPDFファイル";

/**
 * 「開閉アイコンの下に鉛直線が入る」ようにしたもの
 */
const StyledTreeItem = styled(TreeItem)(({ theme }) => ({
  [`& .${treeItemClasses.groupTransition}`]: {
    marginLeft: 15,
    paddingLeft: 18,
    borderLeft: `1px solid ${alpha(theme.palette.text.primary, 0.15)}`,
  },
}));

/**
 * `TreeView` の `TreeItem` をカスタマイズしたもの
 */
export const CustomTreeItem = React.forwardRef(function CustomTreeItem(
  props: TreeItemProps,
  ref: React.Ref<HTMLLIElement>,
) {
  const coverages = useAtomValue(modelPDFファイル.coverages.atom);

  const path = useTreeItemModel<FileTree | FileTreeItemPdf>(props.itemId)?.path;
  if (!path) return null;
  const coverage = coverages?.pdfs[path];

  return (
    <StyledTreeItem
      {...props}
      ref={ref}
      slots={{
        label: CustomLabel,
      }}
      slotProps={{
        label: { coverage } as CustomLabelProps,
      }}
    />
  );
});
