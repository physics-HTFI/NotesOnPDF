import { alpha, styled } from "@mui/material/styles";
import { Box, Tooltip, Typography } from "@mui/material";
import { TreeItem, TreeItemProps, treeItemClasses } from "@mui/x-tree-view";
import { Coverage } from "@/types/Coverages";
import Progress from "./Progress";

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
  coverage?: Coverage;
}

/**
 * `TreeItem`の右端に進捗バーとツールチップを表示できるようにしたもの
 */
export default function TreeItemWithInfo({ label, coverage, ...other }: Props) {
  return (
    <StyledTreeItem
      label={
        <Tooltip
          title={coverage ? <Progress coverage={coverage} /> : undefined}
          placement="right"
          disableInteractive
        >
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
            {coverage?.percent !== undefined && (
              <progress
                max="100"
                value={coverage.percent}
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
