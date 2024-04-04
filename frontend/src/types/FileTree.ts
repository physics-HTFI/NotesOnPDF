export type FileTree = Entry[];

/**
 * ルートフォルダの`id`は`root`。
 * フォルダの`children`は、フォルダ内の要素の`id`。
 * PDFファイルの`children`は`null`。
 * @example
 *  [
 *     { path: "", id: "root", children: ["1", "9", "12"] },
 *     { path: "dummy1/", id: "1", children: ["2"] },
 *     { path: "dummy1/dummy11/", id: "2", children: ["3", "4", "5"] },
 *     { path: "dummy1/dummy11/11A.pdf", id: "3", children: null },
 *     { path: "dummy1/dummy11/11B.pdf", id: "4", children: null },
 *     { path: "dummy1/dummy11/11C.pdf", id: "5", children: null },
 *     { path: "dummy1/dummy11/dummy1A.pdf", id: "6", children: null },
 *     { path: "dummy1/dummy11/dummy1B.pdf", id: "7", children: null },
 *     { path: "dummy1/dummy11/dummy1C.pdf", id: "8", children: null },
 *     { path: "dummy2/dummy2/", id: "9", children: ["10", "11"] },
 *     { path: "dummy2/dummy2A.pdf", id: "10", children: null },
 *     { path: "dummy2/dummy2B.pdf", id: "11", children: null },
 *     { path: "文書1.pdf", id: "12", children: null },
 *   ]
 */
interface Entry {
  path: string;
  id: string;
  children: string[] | null;
}
