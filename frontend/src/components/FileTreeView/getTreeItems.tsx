import { FileTree } from "../../types/FileTree";
import TreeItemWithInfo from "./../FileTreeView/TreeItemWithInfo";
import { PDFsInfo } from "../../types/PDFsInfo";

/**
 * `<TreeView>`の中身を取得する。
 * @example
 * <TreeView> {getTreeItems(fileTree)} </TreeView>
 */
const getTreeItems = (fileTree: FileTree, pdfsInfo: PDFsInfo) =>
  fileTree.map((i) => {
    const getFileName = (path: string) =>
      path.match(/[^\\/]+(?=[\\/]?$)/)?.[0] ?? ""; // "dir/file" => "file", "dir/subdir/" => "subdir"
    if (typeof i === "string") {
      const pdf = pdfsInfo.PDFs[i];
      const progress =
        pdf &&
        Math.min(
          100,
          Math.max(
            0,
            Math.round((100 * pdf.notedPages) / Math.max(1, pdf.enabledPages))
          )
        );
      return (
        <TreeItemWithInfo
          label={getFileName(i)}
          progress={progress}
          tooltip={
            pdf ? (
              <>
                <div>総ページ： {`${pdf.allPages}`} ページ</div>
                {pdf.allPages === pdf.enabledPages ? undefined : (
                  <div>有効ページ： {`${pdf.enabledPages}`} ページ</div>
                )}
                <div>ノート付き： {`${pdf.notedPages}`} ページ</div>
                <div>ノート率： {`${progress}`}%</div>
              </>
            ) : undefined
          }
          nodeId={i}
          key={i}
        />
      );
    }
    return (
      <TreeItemWithInfo label={getFileName(i[0])} nodeId={i[0]} key={i[0]}>
        {getTreeItems(i[1], pdfsInfo)}
      </TreeItemWithInfo>
    );
  });

export default getTreeItems;
