import { useContext, useState } from "react";
import { Drawer } from "@mui/material";
import Header from "@/components/statePDFファイル選択/Header";
import FileTreeView from "./FileTreeView/FileTreeView";
import PdfNotesContext from "@/contexts/PdfNotesContext/PdfNotesContext";
import { findTreeItem } from "@/types/FileTree";
import { modelフォルダ } from "../state起動直後/modelフォルダ";
import { useAtom, useAtomValue } from "jotai";
import { modelUi } from "@/components/global/modelUi";
import { WatchPdfInfo } from "./Watch/WatchPdfInfo";
import { WatchPdfPath } from "./Watch/WatchPdfPath";
import { modelPDFファイル } from "./modelPDFファイル";

/**
 * ファイル一覧を表示するドロワー
 */
export default function OpenFileDrawer() {
  const fileTree = useAtomValue(modelPDFファイル.fileTree.atomValue);
  const coverages = useAtomValue(modelPDFファイル.coverages.atom);
  const [openDrawer, setOpenDrawer] = useAtom(
    modelUi.openDrawer.pdfFileTree.atom,
  );

  const readOnly = useAtomValue(modelフォルダ.readOnly.atom);
  const { id } = useContext(PdfNotesContext);
  // FileTreeViewの選択と折り畳み状態（FileTreeViewの内部で保持するとドロワーを閉じたときにアンマウントされて消えてしまう）
  const [selectedPath, setSelectedPath] = useState<string>();
  const [expanded, setExpanded] = useState<string[]>([]);

  // 前回のファイルを選択した状態にする
  if (
    selectedPath === undefined &&
    fileTree &&
    coverages?.recentPath !== undefined
  ) {
    const path = findTreeItem(fileTree, coverages.recentPath)?.path;
    if (path) {
      setSelectedPath(path);
      setExpanded(
        [...path.matchAll(/(?<=[\\/])/g)].map((m) =>
          path.substring(0, (m.index ?? 0) - 1),
        ),
      );
    } else {
      setSelectedPath("");
    }
  }

  return (
    <>
      <Drawer
        anchor="left"
        open={openDrawer}
        onClose={() => {
          if (!id) return;
          setOpenDrawer(false);
        }}
        slotProps={{
          paper: {
            square: false,
            sx: {
              borderRadius: "0 5px 5px 0",
              color: "dimgray",
              maxWidth: 500,
              minWidth: 280,
              overflowX: "hidden",
              background: readOnly
                ? `repeating-linear-gradient(-60deg, #fffcfc, #fffcfc 5px, white 5px, white 10px)`
                : undefined,
            },
          },
        }}
        onWheel={(e) => e.stopPropagation()}
      >
        {/* ヘッダーアイコン */}
        <Header />

        {/* ツリービュー */}
        <FileTreeView
          selectedItemPath={selectedPath}
          expandedItemPaths={expanded}
          setSelectedItemPath={setSelectedPath}
          setExpandedItemPaths={setExpanded}
        />
      </Drawer>
      <WatchPdfInfo />
      <WatchPdfPath />
    </>
  );
}
