import { FileTree } from "@/types/FileTree";
import TreeItemWithInfo from "./TreeItemWithInfo";
import { Coverages } from "@/types/Coverages";

/**
 * `<TreeView>`の中身を取得する。
 * @example
 * <TreeView> {getTreeItems(fileTree)} </TreeView>
 */
const getTreeItems = (
  fileTree: FileTree,
  Coverages?: Coverages,
  id?: string
): JSX.Element | JSX.Element[] => {
  if (fileTree.length === 0) return <></>;

  // ルートディレクトリの場合
  if (id === undefined) {
    return (
      <>
        {fileTree[0]?.children?.map((id) =>
          getTreeItems(fileTree, Coverages, id)
        )}
      </>
    );
  }

  return fileTree
    .filter((i) => i.id === id)
    .map((i) => {
      const getFileName = (path: string) =>
        path.match(/[^\\/]+(?=[\\/]?$)/)?.[0] ?? ""; // "dir/file" => "file", "dir/subdir/" => "subdir"

      // PDFファイルの場合
      if (i.children === null) {
        return (
          <TreeItemWithInfo
            label={getFileName(i.path)}
            progress={Coverages?.PDFs[i.path]}
            nodeId={i.id}
            key={i.id}
          />
        );
      }
      // サブディレクトリの場合
      return (
        <TreeItemWithInfo label={getFileName(i.path)} nodeId={i.id} key={i.id}>
          {i.children.map((id) => getTreeItems(fileTree, Coverages, id))}
        </TreeItemWithInfo>
      );
    });
};

export default getTreeItems;
