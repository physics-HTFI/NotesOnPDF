import type PdfNotes from "@/types/PdfNotes";
import type Coverages from "@/types/Coverages";
import { GetCoverage } from "@/types/Coverages";
import { findTreeItem, type FileTree } from "@/types/FileTree";

/**
 * `pages` をもとに `coverages` を更新したものを返す。
 * 更新不要の場合は`undefined`。
 */
export function getNewCoveragesOrUndefined(
  pages: PdfNotes["pages"],
  coverages?: Coverages,
  fileTree?: FileTree,
  path?: string,
) {
  if (!path || !coverages || !fileTree || pages.length === 0) return undefined;
  if (!findTreeItem(fileTree, path)) return undefined;

  const oldCov = coverages.pdfs[path];
  const newCov = GetCoverage(pages);
  const unchanged =
    coverages.recentPath === path &&
    oldCov?.allPages === newCov.allPages &&
    oldCov.enabledPages === newCov.enabledPages &&
    oldCov.notedPages === newCov.notedPages;
  if (unchanged) return undefined;
  const newCoverages: Coverages = { ...coverages, recentPath: path };
  newCoverages.pdfs[path] = newCov;
  return newCoverages;
}
