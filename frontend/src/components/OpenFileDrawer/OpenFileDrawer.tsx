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
  const { id, setId, setPdfNotes } = useContext(PdfNotesContext);
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
      setPdfNotes(undefined);
      setId(undefined);
      model
        .getPdfNotes(_id)
        .then((result) => {
          setPdfNotes(createOrGetPdfNotes(result));
          setId(_id);
          setOpenFileTreeDrawer(false);
        })
        .catch(() => {
          setSnackbarMessage(model.getMessage("注釈ファイルの読み込み"));
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
