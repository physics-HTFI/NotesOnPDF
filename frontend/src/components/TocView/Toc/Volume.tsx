import { Typography } from "@mui/material";

/**
 * 巻名要素
 */
export default function Volume({
  title,
  onClick,
}: {
  title: string;
  onClick?: () => void;
}) {
  return (
    <Typography
      variant="body1"
      sx={{
        whiteSpace: "nowrap",
        color: "gray",
        "&:not(:first-of-type)": { pt: 1 },
      }}
    >
      <span style={{ cursor: "pointer" }} onClick={onClick}>
        {title}
      </span>
    </Typography>
  );
}
