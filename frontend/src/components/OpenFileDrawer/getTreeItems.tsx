import { FileTree } from "@/types/FileTree";
import TreeItemWithInfo from "./TreeItemWithInfo";
import { Coverages } from "@/types/Coverages";

/**
 * `<TreeView>`の中身を取得する。
 * @example
 * <TreeView> {getTreeItems(fileTree, coverages)} </TreeView>
 */
const getTreeItems = (
  fileTree: FileTree,
  coverages?: Coverages,
  id?: string
): JSX.Element | JSX.Element[] => {
  if (fileTree.length === 0) return <></>;

  // ルートディレクトリの場合
  if (id === undefined) {
    return (
      <>
        {fileTree[0]?.children?.map((id) =>
          getTreeItems(fileTree, coverages, id)
        )}
      </>
    );
  }

  const entry = fileTree.find((i) => i.id === id);
  if (entry === undefined) return <></>;

  // PDFファイルの場合
  if (entry.children === null) {
    return (
      <TreeItemWithInfo
        label={getFileName(entry.path)}
        progress={coverages?.PDFs[entry.path]}
        nodeId={entry.path}
        key={entry.path}
      />
    );
  }
  // サブディレクトリの場合
  return (
    <TreeItemWithInfo
      label={getFileName(entry.path)}
      nodeId={entry.path}
      key={entry.path}
    >
      {entry.children.map((id) => getTreeItems(fileTree, coverages, id))}
    </TreeItemWithInfo>
  );

  // "dir/file" => "file", "dir/subdir/" => "subdir"
  function getFileName(path: string): string {
    return path.match(/[^\\/]+(?=[\\/]?$)/)?.[0] ?? "";
  }
};

export default getTreeItems;
