import { useCallback, useContext, useState } from "react";
import { Drawer } from "@mui/material";
import Header from "@/components/statePDFファイル選択/Header";
import { FORMAT_VERSION, createOrGetPdfNotes } from "@/types/PdfNotes";
import FileTreeView from "./FileTreeView/FileTreeView";
import ModelContext from "@/contexts/ModelContext/ModelContext";
import PdfNotesContext from "@/contexts/PdfNotesContext/PdfNotesContext";
import { findTreeItem } from "@/types/FileTree";
import { modelフォルダ } from "../state起動直後/modelフォルダ";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { modelPDFファイル } from "./modelPDFファイル";
import { modelUi } from "@/global/modelUi";
import { WatchPdfInfo } from "./WatchPdfInfo/WatchPdfInfo";

/**
 * ファイル一覧を表示するドロワー
 */
export default function OpenFileDrawer() {
  const { model, fileTree, coverages } = useContext(ModelContext);
  const [openDrawer, setOpenDrawer] = useAtom(
    modelUi.openDrawer.pdfFileTree.atom,
  );

  const setAlert = modelUi.alert.useSet();
  const setWaiting = useSetAtom(modelUi.waiting.atom);
  const readOnly = useAtomValue(modelフォルダ.readOnly.atom);
  const {
    id,
    setId,
    setPageSize,
    updaters: { assignPdfNotes },
  } = useContext(PdfNotesContext);
  // FileTreeViewの選択と折り畳み状態（FileTreeViewの内部で保持するとドロワーを閉じたときにアンマウントされて消えてしまう）
  const [selectedPath, setSelectedPath] = useState<string>();
  const [expanded, setExpanded] = useState<string[]>([]);
  const selectPath = modelPDFファイル.file.useSelectPath();

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
  // ファイルIDを選択したときの処理。
  // ファイルツリーのアップデートを抑えるためメモ化している。
  const handleSelectPath = useCallback(
    (_id: string) => {
      if (_id === id) {
        setOpenDrawer(false);
        return;
      }
      setWaiting(true);
      setId(undefined);
      assignPdfNotes(undefined);
      setPageSize(undefined);
      selectPath(_id);
      document.title = "NotesOnPDF";
      model
        .getPdfNotes(_id)
        .then((result) => {
          if (result.pdfNotes && result.pdfNotes.version > FORMAT_VERSION) {
            setAlert(
              "error",
              <span>
                NotesOnPDFのバージョンが古すぎます。
                <br />
                新しいNotesOnPDFを使用してください。
              </span>,
            );
            return;
          }
          result.name = result.name.replace(/.pdf$/i, "");
          assignPdfNotes(createOrGetPdfNotes(result));
          setId(_id);
          document.title = result.name;
        })
        .catch(() => {
          setAlert(
            "error",
            "PDFファイル (または注釈ファイル) の読み込みに失敗しました",
          );
          setWaiting(false);
        });
    },
    [
      assignPdfNotes,
      id,
      model,
      selectPath,
      setAlert,
      setId,
      setOpenDrawer,
      setPageSize,
      setWaiting,
    ],
  );

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
        <Header onSelectPath={handleSelectPath} />

        {/* ツリービュー */}
        <FileTreeView
          selectedItemPath={selectedPath}
          expandedItemPaths={expanded}
          setSelectedItemPath={setSelectedPath}
          setExpandedItemPaths={setExpanded}
          onSelectPdf={handleSelectPath}
        />
      </Drawer>
      <WatchPdfInfo />
    </>
  );
}
