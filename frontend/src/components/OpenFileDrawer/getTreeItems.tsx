import { FileTree } from "@/types/FileTree";
import TreeItemWithInfo from "./TreeItemWithInfo";
import { Progresses } from "@/types/Progresses";

/**
 * `<TreeView>`の中身を取得する。
 * @example
 * <TreeView> {getTreeItems(fileTree)} </TreeView>
 */
const getTreeItems = (fileTree: FileTree, Progresses?: Progresses) =>
  fileTree.map((i) => {
    const getFileName = (path: string) =>
      path.match(/[^\\/]+(?=[\\/]?$)/)?.[0] ?? ""; // "dir/file" => "file", "dir/subdir/" => "subdir"
    if (typeof i === "string") {
      return (
        <TreeItemWithInfo
          label={getFileName(i)}
          progress={Progresses?.PDFs[i]}
          nodeId={i}
          key={i}
        />
      );
    }
    return (
      <TreeItemWithInfo label={getFileName(i[0])} nodeId={i[0]} key={i[0]}>
        {getTreeItems(i[1], Progresses)}
      </TreeItemWithInfo>
    );
  });

export default getTreeItems;
