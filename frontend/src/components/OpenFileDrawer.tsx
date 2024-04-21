import { FC, useContext, useEffect, useState } from "react";
import { Box, Drawer } from "@mui/material";
import { Coverage } from "@/types/Coverages";
import IModel from "@/models/IModel";
import { FileTree } from "@/types/FileTree";
import { TreeView } from "@mui/x-tree-view";
import { KeyboardArrowDown, KeyboardArrowRight } from "@mui/icons-material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-regular-svg-icons";
import getTreeItems from "@/components/OpenFileDrawer/getTreeItems";
import HeaderIcons from "@/components/OpenFileDrawer/HeaderIcons";
import { PdfNotesContext } from "@/contexts/PdfNotesContext";

/**
 * `OpenFileDrawer`の引数
 */
interface Props {
  open: boolean;
  model: IModel;
  onClose: () => void;
  onSelectPdfById?: (id: string) => void;
  onSelectPdfByFile?: (file: File) => void;
}

/**
 * ファイル一覧を表示するドロワー
 */
const OpenFileDrawer: FC<Props> = ({
  open,
  model,
  onClose,
  onSelectPdfById,
  onSelectPdfByFile,
}) => {
  const { coverages, setCoverages } = useContext(PdfNotesContext);
  const [fileTree, setFileTree] = useState<FileTree>([]);
  const [expanded, setExpanded] = useState<string[]>([]);
  const [selectedPath, setSelectedPath] = useState<string>();

  // ファイル一覧を取得
  useEffect(() => {
    load().catch(() => undefined);
    async function load() {
      // データ読み込み
      const files = await model.getFileTree();
      const covs = await model.getCoverages();
      // ファイルツリー内に存在しないファイルの情報を削除する
      const pdfs: Record<string, Coverage> = {};
      for (const pdf of Object.entries(covs.pdfs)) {
        const entry = files.find((f) => f.id === pdf[0]);
        if (!entry) continue;
        pdfs[pdf[0]] = pdf[1];
      }
      covs.pdfs = pdfs;
      // 読み込んだ値を設定
      setFileTree(files);
      setCoverages(covs);
    }
  }, [model, setCoverages]);

  // 前回のファイルを選択した状態にする
  useEffect(() => {
    if (selectedPath !== undefined) return;
    if (fileTree.length === 0 || !coverages) return;
    const file = fileTree.find((i) => i.id === coverages.recentId);
    if (!file) return;
    const path = file.path;
    setSelectedPath(path);
    setExpanded(
      [...path.matchAll(/(?<=[\\/])/g)].map((m) =>
        path.substring(0, m.index - 1)
      )
    );
  }, [fileTree, selectedPath, coverages]);

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
      <HeaderIcons
        model={model}
        onSelectPdfByFile={onSelectPdfByFile}
        onSelectPdfById={onSelectPdfById}
      />

      <Box sx={{ position: "relative" }}>
        {/* ツリービュー */}
        <TreeView
          expanded={expanded}
          selected={selectedPath}
          defaultCollapseIcon={<KeyboardArrowDown />}
          defaultEndIcon={<FontAwesomeIcon icon={faFilePdf} />}
          defaultExpandIcon={<KeyboardArrowRight />}
          onNodeSelect={(_, path) => {
            const isDirectory = fileTree.some(
              (i) => i.path === path && i.children !== null
            );
            if (isDirectory) return;
            if (!coverages) return;
            setSelectedPath(path);
            const recentId = fileTree.find((i) => i.path === path)?.id;
            if (!recentId) return;
            setCoverages({ ...coverages, recentId });
            onSelectPdfById?.(recentId);
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
