export interface FileTreeItemPdf {
  type: "file";
  path: string;
  name: string;
  handle: FileSystemFileHandle;
}

export interface FileTree {
  type: "folder";
  path: string;
  name: string;
  handle: FileSystemDirectoryHandle;
  children: (FileTree | FileTreeItemPdf)[];
}

export function findTreeItem(
  fileTree: FileTree,
  path: string,
): FileTree | FileTreeItemPdf | undefined {
  if (fileTree.path === path) return fileTree;
  for (const child of fileTree.children) {
    if (child.type === "file") {
      if (child.path === path) return child;
    } else {
      if (!path.startsWith(child.path)) continue;
      const found = findTreeItem(child, path);
      if (found) return found;
    }
  }
  return undefined;
}
