import { useContext } from "react";
import { RichTreeView } from "@mui/x-tree-view";
import ModelContext from "@/contexts/ModelContext/ModelContext";

/**
 * ファイル一覧を表示するコンポーネント
 */
export default function FileTreeView({
  selectedItemPath,
  expandedItemPaths: expandedItemPaths,
  setSelectedItemPath,
  setExpandedItemPaths,
  onSelectPdf,
}: {
  selectedItemPath?: string;
  expandedItemPaths: string[];
  setSelectedItemPath: (path: string) => void;
  setExpandedItemPaths: (expanded: string[]) => void;
  onSelectPdf: (path: string) => void;
}) {
  const { fileTree } = useContext(ModelContext);

  if (!fileTree) return null;
  return (
    <RichTreeView
      items={fileTree?.children ?? []}
      itemChildrenIndentation={10}
      selectedItems={selectedItemPath}
      expandedItems={expandedItemPaths}
      getItemId={(item) => item.path}
      isItemSelectionDisabled={(item) => item.type === "folder"}
      getItemLabel={(item) => item.name}
      onSelectedItemsChange={(_, path) => {
        if (!path) return;
        setSelectedItemPath(path);
        onSelectPdf(path);
      }}
      onExpandedItemsChange={(_, paths) => setExpandedItemPaths(paths)}
      //slots={{ item: CustomTreeViewItem }}
      sx={{
        p: 1,
        minWidth: 200,
        position: "sticky", // (1) スクロールしても常に表示する
        top: 0, // (1)
        alignSelf: "flex-start", // (1)
        overflow: "auto", // (2) アイテムが多い場合にスクロール可能にする
        maxHeight: "100vh", // (2)
      }}
    />
  );
}
