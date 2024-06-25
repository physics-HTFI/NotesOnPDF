import { useCallback, useContext, useState } from "react";
import { Drawer } from "@mui/material";
import Header from "@/components/OpenFileDrawer/Header/Header";
import { VERSION, createOrGetPdfNotes } from "@/types/PdfNotes";
import UiContext from "@/contexts/UiContext";
import FileTreeView from "./FileTreeView/FileTreeView";
import ModelContext from "@/contexts/ModelContext/ModelContext";
import PdfNotesContext from "@/contexts/PdfNotesContext/PdfNotesContext";

/**
 * ファイル一覧を表示するドロワー
 */
export default function OpenFileDrawer() {
  const { model, fileTree, coverages } = useContext(ModelContext);
  const {
    readOnly,
    setAlert,
    setWaiting,
    openFileTreeDrawer,
    setOpenFileTreeDrawer,
  } = useContext(UiContext);
  const { id, setId, setPdfNotes, setPageSizes } = useContext(PdfNotesContext);
  // FileTreeViewの選択と折り畳み状態（FileTreeViewの内部で保持するとドロワーを閉じたときにアンマウントされて消えてしまう）
  const [selectedPath, setSelectedPath] = useState<string>();
  const [expanded, setExpanded] = useState<string[]>([]);

  // 前回のファイルを選択した状態にする
  if (
    selectedPath === undefined &&
    fileTree &&
    coverages?.recentId !== undefined
  ) {
    const path = fileTree.find((i) => i.id === coverages.recentId)?.path;
    if (path) {
      setSelectedPath(path);
      setExpanded(
        [...path.matchAll(/(?<=[\\/])/g)].map((m) =>
          path.substring(0, (m.index ?? 0) - 1)
        )
      );
    } else {
      setSelectedPath("");
    }
  }
  // ファイルIDを選択したときの処理。
  // ファイルツリーのアップデートを抑えるためメモ化している。
  const handleSelectPdfById = useCallback(
    (_id: string) => {
      if (_id === id) {
        setOpenFileTreeDrawer(false);
        return;
      }
      setWaiting(true);
      setId(undefined);
      setPdfNotes(undefined);
      setPageSizes(undefined);
      document.title = "NotesOnPDF";
      model
        .getPdfNotes(_id)
        .then((result) => {
          if (result.pdfNotes && result.pdfNotes.version > VERSION) {
            setAlert(
              "error",
              <span>
                NotesOnPDFのバージョンが古すぎます。
                <br />
                新しいNotesOnPDFを使用してください。
              </span>
            );
            return;
          }
          setPdfNotes(createOrGetPdfNotes(result));
          setPageSizes(result.pageSizes);
          setId(_id);
          document.title = result.name.replace(/.pdf$/i, "");
          if (import.meta.env.MODE !== "web") {
            setOpenFileTreeDrawer(false);
            // ウェブ版では、ここではなく<PdfImageWeb>で行う
          }
        })
        .catch(() => {
          setAlert(
            "error",
            "PDFファイル (または注釈ファイル) の読み込みに失敗しました"
          );
          setWaiting(false);
        })
        .finally(() => {
          if (import.meta.env.MODE !== "web") {
            setWaiting(false);
            // ウェブ版の場合はPDFの初期表示でもプログレスインジケータが出るので、
            // ここで消すとちらついてしまう。
            // そのため、ここではなく<PdfImageWeb>の読み込みが終わった時にsetWaiting(false)する
          }
        });
    },
    [
      id,
      model,
      setId,
      setOpenFileTreeDrawer,
      setPdfNotes,
      setPageSizes,
      setWaiting,
      setAlert,
    ]
  );

  return (
    <Drawer
      anchor="left"
      open={openFileTreeDrawer}
      onClose={() => {
        if (!id) return;
        setOpenFileTreeDrawer(false);
      }}
      PaperProps={{
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
      }}
      onWheel={(e) => {
        e.stopPropagation();
      }}
    >
      {/* ヘッダーアイコン */}
      <Header onSelectPdfById={handleSelectPdfById} />

      {/* ツリービュー */}
      <FileTreeView
        selectedPath={selectedPath}
        expanded={expanded}
        setSelectedPath={setSelectedPath}
        setExpanded={setExpanded}
        onSelectPdfById={handleSelectPdfById}
      />
    </Drawer>
  );
}
