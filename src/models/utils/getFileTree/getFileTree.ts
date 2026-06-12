import type { FileTree, FileTreeItemPdf } from "@/types/FileTree";
import { sortChildrenByName } from "./sortChildrenByName";

export async function getFileTree(folder?: FileSystemDirectoryHandle) {
  if (!folder) return undefined;
  const fileTree: FileTree = {
    type: "folder",
    path: "",
    name: "root",
    handle: folder,
    children: [],
  };
  try {
    await addEntries(fileTree, folder);
    return fileTree;
  } catch (_) {
    return undefined;
  }

  async function addEntries(
    fileTree: FileTree,
    folder: FileSystemDirectoryHandle,
  ) {
    // フォルダを追加
    for await (const [name, handle] of folder) {
      if (handle.kind === "directory") {
        const path = fileTree.path ? `${fileTree.path}/${name}` : name;
        const entry: FileTree = {
          type: "folder",
          path,
          name,
          handle,
          children: [],
        };
        await addEntries(entry, handle);
        if (entry.children.length === 0) continue; // 空ディレクトリは、ファイルツリー上でPDFファイルとして表示されてしまうので取り除く
        fileTree.children.push(entry);
      }
    }
    // ファイルを追加
    for await (const [name, handle] of folder) {
      if (handle.kind === "file") {
        if (!name.toLowerCase().endsWith(".pdf")) continue;
        const path = fileTree.path ? `${fileTree.path}/${name}` : name;
        const entry: FileTreeItemPdf = { type: "file", path, name, handle };
        fileTree.children.push(entry);
      }
    }

    // 👆のままだと名前順にならないのでソートする
    fileTree.children.sort(sortChildrenByName);
  }
}
