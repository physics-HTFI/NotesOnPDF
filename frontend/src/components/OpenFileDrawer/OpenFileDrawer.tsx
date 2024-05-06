import { FC, useCallback, useContext } from "react";
import { Drawer } from "@mui/material";
import { Header } from "@/components/OpenFileDrawer/Header/Header";
import { ModelContext } from "@/contexts/ModelContext";
import { createOrGetPdfNotes } from "@/types/PdfNotes";
import { UiStateContext } from "@/contexts/UiStateContext";
import { PdfNotesContext } from "@/contexts/PdfNotesContext";
import { FileTreeView } from "./FileTreeView/FileTreeView";

/**
 * ファイル一覧を表示するドロワー
 */
export const OpenFileDrawer: FC = () => {
  const { model } = useContext(ModelContext);
  const { id, file, setIdOrFile, setPdfNotes } = useContext(PdfNotesContext);
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
      setIdOrFile(undefined);
      model
        .getPdfNotes(_id)
        .then((result) => {
          setPdfNotes(createOrGetPdfNotes(result));
          setIdOrFile(_id);
          setOpenFileTreeDrawer(false);
        })
        .catch(() => undefined)
        .finally(() => {
          setWaiting(false);
        });
    },
    [id, model, setIdOrFile, setOpenFileTreeDrawer, setPdfNotes, setWaiting]
  );

  const handleSelectPdfByFile = (file: File) => {
    console.count(file.name);
    /*
    setOpenLeftDrawer(false);
    const pdfPathNew = _file.name;
    if (file?.name === pdfPathNew || !pdfPathNew) return;
    setWaiting(true); // PDF読み込み中のインジケーターも必要
    setPdfNotes(undefined);
    setFile(_file);
    // TODO
    setWaiting(false);
    */
  };

  return (
    <Drawer
      anchor="left"
      open={openFileTreeDrawer}
      onClose={() => {
        if (!id && !file) return;
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
      <Header
        onSelectPdfByFile={handleSelectPdfByFile}
        onSelectPdfById={handleSelectPdfById}
      />

      {/* ツリービュー */}
      <FileTreeView onSelectPdfById={handleSelectPdfById} />
    </Drawer>
  );
};
