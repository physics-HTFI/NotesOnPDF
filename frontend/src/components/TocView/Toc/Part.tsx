import { Typography } from "@mui/material";

/**
 * 部名要素
 */
export default function Part({
  title,
  onClick,
}: {
  title: string;
  onClick?: () => void;
}) {
  return (
    <Typography
      variant="body2"
      sx={{ whiteSpace: "nowrap", color: "gray", pt: 0.8 }}
    >
      <span style={{ cursor: "pointer" }} onClick={onClick}>
        {title}
      </span>
    </Typography>
  );
}
