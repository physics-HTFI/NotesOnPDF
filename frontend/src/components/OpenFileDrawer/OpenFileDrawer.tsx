import { useCallback, useContext } from "react";
import { Drawer } from "@mui/material";
import Header from "@/components/OpenFileDrawer/Header/Header";
import { createOrGetPdfNotes } from "@/types/PdfNotes";
import UiStateContext from "@/contexts/UiStateContext";
import PdfNotesContext from "@/contexts/PdfNotesContext";
import FileTreeView from "./FileTreeView/FileTreeView";
import ModelContext from "@/contexts/ModelContext";

/**
 * ファイル一覧を表示するドロワー
 */
export default function OpenFileDrawer() {
  const { model } = useContext(ModelContext);
  const { setSnackbarMessage } = useContext(UiStateContext);
  const { id, setId, setPdfNotes, setPageSizes } = useContext(PdfNotesContext);
  const { setWaiting, openFileTreeDrawer, setOpenFileTreeDrawer } =
    useContext(UiStateContext);

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
      setSnackbarMessage(undefined);
      model
        .getPdfNotes(_id)
        .then((result) => {
          setPdfNotes(createOrGetPdfNotes(result));
          setPageSizes(result.pageSizes);
          setId(_id);
          setOpenFileTreeDrawer(false);
        })
        .catch(() => {
          setSnackbarMessage(
            model.getMessage("PDFファイル (または注釈ファイル) の読み込み")
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
      setSnackbarMessage,
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
