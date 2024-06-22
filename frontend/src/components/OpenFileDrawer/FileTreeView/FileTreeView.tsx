import { useContext, useState } from "react";
import { TreeView } from "@mui/x-tree-view";
import { KeyboardArrowDown, KeyboardArrowRight } from "@mui/icons-material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-regular-svg-icons";
import getTreeItems from "@/components/OpenFileDrawer/FileTreeView/getTreeItems";
import ModelContext from "@/contexts/ModelContext/ModelContext";

/**
 * ファイル一覧を表示するコンポーネント
 */
export default function FileTreeView({
  onSelectPdfById,
}: {
  onSelectPdfById: (id: string) => void;
}) {
  const { fileTree, coverages } = useContext(ModelContext);
  const [expanded, setExpanded] = useState<string[]>([]);
  const [selectedPath, setSelectedPath] = useState<string>();

  // 前回のファイルを選択した状態にする
  if (selectedPath === undefined && fileTree && coverages) {
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

  // ファイル数が増えてくると重くなる可能性がある。
  // しかし、（モーダルな）ドロワーが閉じているときはその内部は再レンダーされないので、
  // ページ移動のたびにここが再レンダーされることない。よってメモ化は不要。
  return (
    fileTree && (
      <TreeView
        expanded={expanded}
        selected={selectedPath ?? ""}
        defaultCollapseIcon={<KeyboardArrowDown />}
        defaultEndIcon={<FontAwesomeIcon icon={faFilePdf} />}
        defaultExpandIcon={<KeyboardArrowRight />}
        onNodeSelect={(_, path) => {
          const file = fileTree.find((i) => i.path === path);
          if (!file || file.children) return; // `children`がある場合はPDFファイルではなくフォルダ
          setSelectedPath(file.path);
          onSelectPdfById(file.id);
        }}
        onNodeToggle={(_, nodeIds) => {
          setExpanded(nodeIds);
        }}
      >
        {getTreeItems(fileTree, coverages)}
      </TreeView>
    )
  );
}
