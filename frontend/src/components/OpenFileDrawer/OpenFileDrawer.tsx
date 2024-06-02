import { useCallback, useContext } from "react";
import { Drawer } from "@mui/material";
import Header from "@/components/OpenFileDrawer/Header/Header";
import { createOrGetPdfNotes } from "@/types/PdfNotes";
import UiContext from "@/contexts/UiContext";
import PdfNotesContext from "@/contexts/PdfNotesContext";
import FileTreeView from "./FileTreeView/FileTreeView";
import ModelContext from "@/contexts/ModelContext/ModelContext";

/**
 * ファイル一覧を表示するドロワー
 */
export default function OpenFileDrawer() {
  const { model, modelFlags } = useContext(ModelContext);
  const { readOnly, setAlert } = useContext(UiContext);
  const { id, setId, setPdfNotes, setPageSizes } = useContext(PdfNotesContext);
  const { setWaiting, openFileTreeDrawer, setOpenFileTreeDrawer } =
    useContext(UiContext);

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
      model
        .getPdfNotes(_id)
        .then((result) => {
          setPdfNotes(createOrGetPdfNotes(result));
          setPageSizes(result.pageSizes);
          setId(_id);
          setOpenFileTreeDrawer(false);
        })
        .catch(() => {
          setAlert(
            "error",
            "PDFファイル (または注釈ファイル) の読み込みに失敗しました"
          );
        })
        .finally(() => {
          setWaiting(false);
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
          background:
            readOnly && modelFlags.canToggleReadOnly
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
      <FileTreeView onSelectPdfById={handleSelectPdfById} />
    </Drawer>
  );
}
