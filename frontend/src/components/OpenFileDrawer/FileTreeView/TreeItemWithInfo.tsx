import { alpha, styled } from "@mui/material/styles";
import { Box, Tooltip, Typography } from "@mui/material";
import { TreeItem, TreeItemProps, treeItemClasses } from "@mui/x-tree-view";
import { Coverage } from "@/types/Coverages";

/**
 * `TreeItem`を「開閉アイコンの下に鉛直線が入る」様にしたもの
 */
const StyledTreeItem = styled(TreeItem)(({ theme }) => ({
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 15,
    paddingLeft: 18,
    borderLeft: `1px solid ${alpha(theme.palette.text.primary, 0.15)}`,
  },
}));

/**
 * `TreeItemWithInfo`の引数
 */
interface Props extends TreeItemProps {
  label: string;
  progress?: Coverage;
}

/**
 * `TreeItem`の右端に進捗バーとツールチップを表示できるようにしたもの
 */
export default function TreeItemWithInfo({ label, progress, ...other }: Props) {
  // 進捗
  const percent =
    progress &&
    Math.min(
      100,
      Math.max(
        0,
        Math.round(
          (100 * progress.notedPages) / Math.max(1, progress.enabledPages)
        )
      )
    );

  // ツールチップ
  const tooltip = progress ? (
    <>
      <div>総ページ： {`${progress.allPages}`} ページ</div>
      {progress.allPages !== progress.enabledPages && (
        <div>有効ページ： {`${progress.enabledPages}`} ページ</div>
      )}
      <div>ノート付き： {`${progress.notedPages}`} ページ</div>
      <div>ノート率： {`${percent}`}%</div>
    </>
  ) : undefined;

  return (
    <StyledTreeItem
      label={
        <Tooltip title={tooltip} placement="right" disableInteractive>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              p: 0.5,
              pr: 0,
            }}
          >
            {/* ファイル／フォルダ名 */}
            <Typography variant="body2" sx={{ flexGrow: 1, fontSize: "80%" }}>
              {label}
            </Typography>

            {/* 進捗 */}
            {percent !== undefined && (
              <progress
                max="100"
                value={percent}
                style={{ width: 20, height: 12, marginLeft: 8 }}
              />
            )}
          </Box>
        </Tooltip>
      }
      {...other}
    />
  );
}
