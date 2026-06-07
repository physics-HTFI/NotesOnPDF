import { RichTreeView } from "@mui/x-tree-view";
import { CustomTreeItem } from "./CustomTreeItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-regular-svg-icons";
import { useAtomValue, useSetAtom } from "jotai";
import { modelPDFファイル } from "../modelPDFファイル";

/**
 * ファイル一覧を表示するコンポーネント
 */
export default function FileTreeView({
  selectedItemPath,
  expandedItemPaths: expandedItemPaths,
  setSelectedItemPath,
  setExpandedItemPaths,
}: {
  selectedItemPath?: string;
  expandedItemPaths: string[];
  setSelectedItemPath: (path: string) => void;
  setExpandedItemPaths: (expanded: string[]) => void;
}) {
  const fileTree = useAtomValue(modelPDFファイル.fileTree.atomValue);
  const setPath = useSetAtom(modelPDFファイル.path.atom);

  if (!fileTree) return null;
  return (
    <RichTreeView
      items={fileTree?.children ?? []}
      itemChildrenIndentation={0}
      selectedItems={selectedItemPath ?? null}
      expandedItems={expandedItemPaths}
      getItemId={(item) => item.path}
      isItemSelectionDisabled={(item) => item.type === "folder"}
      getItemLabel={(item) => item.name}
      onSelectedItemsChange={(_, path) => {
        if (!path) return;
        setSelectedItemPath(path);
        setPath(path);
      }}
      onExpandedItemsChange={(_, paths) => setExpandedItemPaths(paths)}
      slots={{
        endIcon: PdfIcon,
        item: CustomTreeItem,
      }}
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

function PdfIcon() {
  return <FontAwesomeIcon icon={faFilePdf} />;
}
