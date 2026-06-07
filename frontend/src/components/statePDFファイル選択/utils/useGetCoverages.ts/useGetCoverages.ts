import { modelフォルダ } from "@/components/state起動直後/modelフォルダ";
import { PATH_COVERAGES } from "@/types/CONSTANTS";
import type Coverages from "@/types/Coverages";
import { findTreeItem, type FileTree } from "@/types/FileTree";

export function useGetCoverages() {
  const read = modelフォルダ.json.useRead();

  return async (fileTree?: FileTree): Promise<Coverages> => {
    const coverages = await read<Coverages>(PATH_COVERAGES, false);
    if (!coverages || !fileTree) return { pdfs: {} };

    // `fileTree` 内に存在しないファイルの情報を削除する
    const pdfs: Coverages["pdfs"] = {};
    if (fileTree) {
      for (const [path, coverage] of Object.entries(coverages.pdfs)) {
        console.log(path);
        if (findTreeItem(fileTree, path)?.type !== "file") continue;
        pdfs[path] = coverage;
      }
    }
    coverages.pdfs = pdfs;

    return coverages;
  };
}
