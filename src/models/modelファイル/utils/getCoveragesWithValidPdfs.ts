import type Coverages from "@/types/Coverages";
import { GetCoverages_empty } from "@/types/Coverages";
import { findTreeItem, type FileTree } from "@/types/FileTree";

export function getCoveragesWithValidPdfs(
  coverages?: Coverages,
  fileTree?: FileTree,
) {
  if (!coverages || !fileTree) return GetCoverages_empty();

  // `fileTree` 内に存在しないファイルの情報を削除する
  const pdfs: Coverages["pdfs"] = {};
  if (fileTree) {
    for (const [path, coverage] of Object.entries(coverages.pdfs)) {
      if (findTreeItem(fileTree, path)?.type !== "file") continue;
      pdfs[path] = coverage;
    }
  }
  coverages.pdfs = pdfs;

  return coverages;
}
