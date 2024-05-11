import { Typography } from "@mui/material";

/**
 * 章名要素
 */
export default function Chapter({
  title,
  onClick,
}: {
  title: string;
  onClick?: () => void;
}) {
  return (
    <Typography
      variant="body2"
      sx={{
        pt: 0.5,
        fontSize: "110%",
        lineHeight: 1,
        color: "gray",
        whiteSpace: "nowrap",
        minHeight: 6,
      }}
    >
      <span style={{ cursor: "pointer" }} onClick={onClick}>
        {title}
      </span>
    </Typography>
  );
}
