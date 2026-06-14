import { atom } from "jotai";
import { atomsファイル } from "./atomsファイル";
import { findTreeItem } from "@/types/FileTree";
import { atomsフォルダ } from "../modelフォルダ/atomsフォルダ";
import { getFileTree } from "./utils/getFileTree/getFileTree";

const {
  pdf: { info },
} = atomsファイル;
const atomFileTreeValue = atom((get) => getFileTree(get(atomsフォルダ.folder)));

export const derivsファイル = {
  fileTreeValue: atomFileTreeValue,

  jsonPathValue: atom((get) => {
    const pdf = get(info);
    if (pdf.status !== "loaded") return undefined;
    return pdf.path + ".json";
  }),

  /** `path` からタイトルを取得する（path/to/title.pdf => title） */
  titleValue: atom((get) => {
    const pdf = get(info);
    if (pdf.status !== "loaded") return undefined;
    return pdf.path.match(/([^/\\]*)\.[^.]*$/)?.[1];
  }),

  /** 選択されている PDF へのハンドルを取得する */
  pdfHandleValue: atom(async (get) => {
    const tree = await get(atomFileTreeValue);
    const pdf = get(info);
    if (!tree || pdf.status !== "loaded") return undefined;
    const item = findTreeItem(tree, pdf.path);
    if (!item || item.type !== "file") return undefined;
    return item.handle;
  }),
};
