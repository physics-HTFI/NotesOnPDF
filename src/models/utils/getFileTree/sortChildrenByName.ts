import type { FileTree, FileTreeItemPdf } from "@/types/FileTree";

export function sortChildrenByName(
  a: FileTree | FileTreeItemPdf,
  b: FileTree | FileTreeItemPdf,
) {
  if (a.type === b.type) {
    return a.name.localeCompare(b.name, undefined, { numeric: true });
  }
  return a.type === "folder" ? -1 : 1;
}
