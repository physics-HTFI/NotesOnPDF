import { FileTree } from "@/types/FileTree";
import TreeItemWithInfo from "./TreeItemWithInfo";
import { Progresses } from "@/types/Progresses";

/**
 * `<TreeView>`の中身を取得する。
 * @example
 * <TreeView> {getTreeItems(fileTree)} </TreeView>
 */
const getTreeItems = (
  fileTree: FileTree,
  Progresses?: Progresses,
  id?: string
): JSX.Element | JSX.Element[] => {
  if (fileTree.length === 0) return <></>;

  // ルートディレクトリの場合
  if (id === undefined) {
    return (
      <>
        {fileTree[0]?.children?.map((id) =>
          getTreeItems(fileTree, Progresses, id)
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
            progress={Progresses?.PDFs[i.path]}
            nodeId={i.id}
            key={i.id}
          />
        );
      }
      // サブディレクトリの場合
      return (
        <TreeItemWithInfo label={getFileName(i.path)} nodeId={i.id} key={i.id}>
          {i.children.map((id) => getTreeItems(fileTree, Progresses, id))}
        </TreeItemWithInfo>
      );
    });
};

export default getTreeItems;
