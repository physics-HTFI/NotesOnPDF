import { useState } from "react";
import { Drawer } from "@mui/material";
import Header from "@/components/statePDFファイル選択/Header";
import FileTreeView from "./FileTreeView/FileTreeView";
import { findTreeItem } from "@/types/FileTree";
import { modelフォルダ } from "../../models/modelフォルダ";
import { useAtom, useAtomValue } from "jotai";
import { modelUI } from "@/models/modelUI";
import { modelファイル } from "../../models/modelファイル";

/**
 * ファイル一覧を表示するドロワー
 */
export default function OpenFileDrawer() {
  const fileTree = useAtomValue(modelファイル.fileTree.atomValue);
  const recentPath = useAtomValue(modelファイル.coverages.atom)?.recentPath;
  const [openDrawer, setOpenDrawer] = useAtom(
    modelUI.openDrawer.pdfFileTree.atom,
  );

  const readOnly = useAtomValue(modelフォルダ.readOnly.atom);
  const [selectedPath, setSelectedPath] = useState<string>();
  const [expanded, setExpanded] = useState<string[]>([]);

  // 前回のファイルを選択した状態にする
  if (selectedPath === undefined && fileTree && recentPath) {
    const path = findTreeItem(fileTree, recentPath)?.path;
    if (path) {
      setSelectedPath(path);
      setExpanded(
        [...path.matchAll(/(?<=[\\/])/g)].map((m) =>
          path.substring(0, (m.index ?? 0) - 1),
        ),
      );
    } else {
      setSelectedPath(undefined);
    }
  }

  return (
    <>
      <Drawer
        anchor="left"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
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
    </>
  );
}
