import { alpha, styled } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";
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

interface Props extends TreeItemProps {
  label: string;
  info?: string;
}

/**
 * `TreeItem`の右端にインフォを表示できるようにしたもの
 */
const TreeItemWithInfo: React.FC<Props> = (props: Props) => {
  const { label, info, ...other } = props;
  return (
    <StyledTreeItem
      label={
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            p: 0.5,
            pr: 0,
          }}
        >
          <Typography
            variant="caption"
            sx={
              info
                ? {
                    background: "gray",
                    color: "white",
                    borderRadius: 10,
                    pr: 0.7,
                    pl: 0.7,
                    mr: 0.5,
                    fontSize: "60%",
                  }
                : {}
            }
          >
            {info}
          </Typography>
          <Typography variant="body2" sx={{ flexGrow: 1 }}>
            {label}
          </Typography>
        </Box>
      }
      {...other}
    />
  );
};

export default TreeItemWithInfo;
