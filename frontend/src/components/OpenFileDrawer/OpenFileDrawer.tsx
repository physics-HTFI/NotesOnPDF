import { FC, useContext, useState } from "react";
import { Box, Drawer } from "@mui/material";
import { TreeView } from "@mui/x-tree-view";
import { KeyboardArrowDown, KeyboardArrowRight } from "@mui/icons-material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-regular-svg-icons";
import getTreeItems from "@/components/OpenFileDrawer/getTreeItems";
import Header from "@/components/OpenFileDrawer/Header/Header";
import { ModelContext } from "@/contexts/ModelContext";
import { createOrGetPdfNotes } from "@/types/PdfNotes";
import { WaitContext } from "@/contexts/WaitContext";
import { PdfNotesContext } from "@/contexts/PdfNotesContext";
import useCoverages from "@/hooks/useFileTree";

/**
 * `OpenFileDrawer`の引数
 */
interface Props {
  open: boolean;
  onClose: () => void;
}

/**
 * ファイル一覧を表示するドロワー
 */
const OpenFileDrawer: FC<Props> = ({ open, onClose }) => {
  const { model } = useContext(ModelContext);
  const { id, setId, pdfNotes, setPdfNotes } = useContext(PdfNotesContext);
  const { setWaiting } = useContext(WaitContext);
  const {
    fileTree,
    coverages,
    reloadFileTree,
    updateCoveragesIfRecentIdChanged,
    updateCoveragesIfPdfNotesChanged,
  } = useCoverages();

  const [expanded, setExpanded] = useState<string[]>([]);
  const [selectedPath, setSelectedPath] = useState<string>("");

  // 前回のファイルを選択した状態にする
  if (!selectedPath && fileTree.length !== 0 && coverages) {
    const path = fileTree.find((i) => i.id === coverages.recentId)?.path;
    if (path) {
      setSelectedPath(path);
      setExpanded(
        [...path.matchAll(/(?<=[\\/])/g)].map((m) =>
          path.substring(0, m.index - 1)
        )
      );
    } else {
      setSelectedPath("");
    }
  }

  updateCoveragesIfPdfNotesChanged(id, pdfNotes);

  const handleSelectPdfById = (_id: string) => {
    if (_id === id) return;
    setWaiting(true);
    setPdfNotes(undefined);
    setId(undefined);
    model
      .getPdfNotes(_id)
      .then((result) => {
        setPdfNotes(createOrGetPdfNotes(result));
        setId(_id);
        onClose();
      })
      .catch(() => undefined)
      .finally(() => {
        setWaiting(false);
      });
  };

  const handleSelectPdfByFile = (file: File) => {
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
      open={open}
      onClose={onClose}
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
        onReloadFileTree={reloadFileTree}
      />

      <Box sx={{ position: "relative" }}>
        {/* ツリービュー */}
        {/* TODO ファイルを分ける。ファイル数が増えると重くなるのでReact.memo化したほうが良い */}
        <TreeView
          expanded={expanded}
          selected={selectedPath}
          defaultCollapseIcon={<KeyboardArrowDown />}
          defaultEndIcon={<FontAwesomeIcon icon={faFilePdf} />}
          defaultExpandIcon={<KeyboardArrowRight />}
          onNodeSelect={(_, path) => {
            const file = fileTree.find((i) => i.path === path);
            if (!file || file.children) return; // `children`がある場合はPDFファイルではなくフォルダ
            setSelectedPath(file.path);
            updateCoveragesIfRecentIdChanged(file.id);
            handleSelectPdfById(file.id);
          }}
          onNodeToggle={(_, nodeIds) => {
            setExpanded(nodeIds);
          }}
        >
          {getTreeItems(fileTree, coverages)}
        </TreeView>
      </Box>
    </Drawer>
  );
};

export default OpenFileDrawer;
