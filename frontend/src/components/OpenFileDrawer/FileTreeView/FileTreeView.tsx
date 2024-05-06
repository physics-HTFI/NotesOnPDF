import { FC, useContext, useMemo, useState } from "react";
import { TreeView } from "@mui/x-tree-view";
import { KeyboardArrowDown, KeyboardArrowRight } from "@mui/icons-material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-regular-svg-icons";
import getTreeItems from "@/components/OpenFileDrawer/FileTreeView/getTreeItems";
import { PdfNotesContext } from "@/contexts/PdfNotesContext";
import useCoverages from "@/hooks/useFileTree";

// `FileTreeView`の引数
interface Props {
  onSelectPdfById: (id: string) => void;
}

/**
 * ファイル一覧を表示するコンポーネント
 */
const FileTreeView: FC<Props> = ({ onSelectPdfById }) => {
  const { id, pdfNotes } = useContext(PdfNotesContext);
  const {
    fileTree,
    coverages,
    updateCoveragesIfRecentIdChanged,
    updateCoveragesIfPdfNotesChanged,
  } = useCoverages();

  const [expanded, setExpanded] = useState<string[]>([]);
  const [selectedPath, setSelectedPath] = useState<string>();

  // 前回のファイルを選択した状態にする
  if (selectedPath === undefined && fileTree.length !== 0 && coverages) {
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

  updateCoveragesIfPdfNotesChanged(id, pdfNotes);

  // ページ移動のたびに再レンダーされるのを防ぐためメモ化している。
  // （ファイル数が1000を超えてくると重くなる可能性があるため。）
  return useMemo(
    () => (
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
          onSelectPdfById(file.id);
        }}
        onNodeToggle={(_, nodeIds) => {
          setExpanded(nodeIds);
        }}
      >
        {getTreeItems(fileTree, coverages)}
      </TreeView>
    ),
    [
      coverages,
      expanded,
      selectedPath,
      fileTree,
      setSelectedPath,
      updateCoveragesIfRecentIdChanged,
      onSelectPdfById,
    ]
  );
};

export default FileTreeView;
