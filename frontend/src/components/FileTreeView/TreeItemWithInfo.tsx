import { alpha, styled } from "@mui/material/styles";
import { Box, Tooltip, Typography } from "@mui/material";
import { TreeItem, TreeItemProps, treeItemClasses } from "@mui/x-tree-view";
import { Progress } from "@/types/Progresses";

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
  progress?: Progress;
}

/**
 * `TreeItem`の右端にインフォを表示できるようにしたもの
 */
const TreeItemWithInfo: React.FC<Props> = (props: Props) => {
  const { label, progress, ...other } = props;

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

  const tooltip = progress ? (
    <>
      <div>総ページ： {`${progress.allPages}`} ページ</div>
      {progress.allPages === progress.enabledPages ? undefined : (
        <div>有効ページ： {`${progress.enabledPages}`} ページ</div>
      )}
      <div>ノート付き： {`${progress.notedPages}`} ページ</div>
      <div>ノート率： {`${percent}`}%</div>
    </>
  ) : undefined;

  return (
    <StyledTreeItem
      label={
        <Tooltip title={tooltip} placement="right">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              p: 0.5,
              pr: 0,
            }}
          >
            <Typography variant="body2" sx={{ flexGrow: 1, fontSize: "80%" }}>
              {label}
            </Typography>
            {percent !== undefined && (
              <Box
                sx={{
                  background: `linear-gradient(to right, gray ${percent}%, white ${percent}%)`,
                  borderRadius: 1,
                  border: "solid 1px",
                  width: 20,
                  height: 6,
                  ml: 2,
                }}
              />
            )}
          </Box>
        </Tooltip>
      }
      {...other}
    />
  );
};

export default TreeItemWithInfo;
