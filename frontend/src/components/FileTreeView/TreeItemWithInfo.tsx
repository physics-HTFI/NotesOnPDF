import { alpha, styled } from "@mui/material/styles";
import { Box, Tooltip, Typography } from "@mui/material";
import { TreeItem, TreeItemProps, treeItemClasses } from "@mui/x-tree-view";

/**
 * `TreeItem`を「開閉アイコンの下に鉛直線が入る」様にしたもの
 */
const StyledTreeItem = styled(TreeItem)(({ theme }) => ({
  [`& .${treeItemClasses.iconContainer}`]: {
    "& .close": {
      opacity: 0.3,
    },
  },
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
  progress?: number;
  tooltip?: React.ReactNode;
}

/**
 * `TreeItem`の右端にインフォを表示できるようにしたもの
 */
const TreeItemWithInfo: React.FC<Props> = (props: Props) => {
  const { label, progress, tooltip, ...other } = props;
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
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {label}
            </Typography>
            <Box
              sx={
                progress === undefined
                  ? {}
                  : {
                      background: `linear-gradient(to right, gray ${progress}%, white ${progress}%)`,
                      borderRadius: 1,
                      border: "solid 1px",
                      width: 20,
                      height: 6,
                      ml: 2,
                    }
              }
            />
          </Box>
        </Tooltip>
      }
      {...other}
    />
  );
};

export default TreeItemWithInfo;
