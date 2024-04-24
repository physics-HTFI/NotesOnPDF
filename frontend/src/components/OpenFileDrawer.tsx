import { FC, useContext, useEffect, useState } from "react";
import { Box, Drawer } from "@mui/material";
import { Coverage, Coverages } from "@/types/Coverages";
import { FileTree } from "@/types/FileTree";
import { TreeView } from "@mui/x-tree-view";
import { KeyboardArrowDown, KeyboardArrowRight } from "@mui/icons-material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-regular-svg-icons";
import getTreeItems from "@/components/OpenFileDrawer/getTreeItems";
import HeaderIcons from "@/components/OpenFileDrawer/HeaderIcons";
import { ModelContext } from "@/contexts/ModelContext";
import { PdfNotes } from "@/types/PdfNotes";
import IModel from "@/models/IModel";

/**
 * `FileTree`と`Coverages`を取得する
 */
async function load(model: IModel) {
  const fileTree = await model.getFileTree();
  const coverages = await model.getCoverages();
  // ファイルツリー内に存在しないファイルの情報を削除する
  const pdfs: Record<string, Coverage> = {};
  for (const pdf of Object.entries(coverages.pdfs)) {
    const entry = fileTree.find((f) => f.id === pdf[0]);
    if (!entry) continue;
    pdfs[pdf[0]] = pdf[1];
  }
  return { fileTree, coverages };
}

/**
 * 更新済みの`coverages`を返す。更新不要の場合は`undefined`。
 */
function getNewCoverages(
  coverages?: Coverages,
  id?: string,
  pdfNotes?: PdfNotes,
  fileTree?: FileTree
) {
  if (!id || !pdfNotes || !coverages || !fileTree) return;
  if (!fileTree.find((f) => f.id === id)) return;

  const oldCov = coverages.pdfs[id];
  const newCov: Coverage = {
    allPages: pdfNotes.pages.length,
    enabledPages:
      pdfNotes.pages.length -
      pdfNotes.pages.filter((p) => p.style?.includes("excluded")).length,
    notedPages: pdfNotes.pages.filter(
      (p) => !p.style?.includes("excluded") && p.notes?.length
    ).length,
  };
  const unchanged =
    oldCov?.allPages === newCov.allPages &&
    oldCov.enabledPages === newCov.enabledPages &&
    oldCov.notedPages === newCov.notedPages;
  if (unchanged) {
    return;
  } else {
    const newCoverages = { ...coverages };
    newCoverages.pdfs[id] = newCov;
    return newCoverages;
  }
}

/**
 * `OpenFileDrawer`の引数
 */
interface Props {
  open: boolean;
  id?: string;
  pdfNotes?: PdfNotes;
  onClose: () => void;
  onSelectPdfById?: (id: string) => void;
  onSelectPdfByFile?: (file: File) => void;
}

/**
 * ファイル一覧を表示するドロワー
 */
const OpenFileDrawer: FC<Props> = ({
  open,
  id,
  pdfNotes,
  onClose,
  onSelectPdfById,
  onSelectPdfByFile,
}) => {
  const model = useContext(ModelContext);
  const [fileTree, setFileTree] = useState<FileTree>([]);
  const [coverages, setCoverages] = useState<Coverages>();
  const [expanded, setExpanded] = useState<string[]>([]);
  const [selectedPath, setSelectedPath] = useState<string>();

  // ファイル一覧を取得
  useEffect(() => {
    load(model)
      .then(({ fileTree, coverages }) => {
        setFileTree(fileTree);
        setCoverages(coverages);
      })
      .catch(() => undefined);
  }, [model]);

  // 前回のファイルを選択した状態にする
  if (selectedPath === undefined && fileTree.length !== 0 && coverages) {
    const file = fileTree.find((i) => i.id === coverages.recentId);
    if (file) {
      const path = file.path;
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

  // `coverages`の更新
  const newCoverages = getNewCoverages(coverages, id, pdfNotes, fileTree);
  if (newCoverages) {
    setCoverages(newCoverages);
    model.putCoverages(newCoverages).catch(() => undefined);
  }

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
        onSelectPdfByFile={onSelectPdfByFile}
        onSelectPdfById={onSelectPdfById}
        onUpdateFileTree={() => {
          model
            .getFileTree()
            .then((files) => {
              setFileTree(files);
            })
            .catch(() => undefined);
        }}
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
