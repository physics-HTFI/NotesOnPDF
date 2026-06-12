import { Folder } from "@mui/icons-material";
import { Box, Button, type SxProps, Typography } from "@mui/material";

export function PanelButton({
  icon,
  label,
  sx,
  onClick,
}: {
  icon: typeof Folder;
  label: string;
  sx?: SxProps;
  onClick?: () => void;
}) {
  const Icon = icon;
  return (
    <Box sx={{ flex: 1 }}>
      <Button
        variant="outlined"
        onClick={onClick}
        sx={{
          height: 150,
          width: "stretch",
          pointerEvents: onClick ? undefined : "none",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 1,
          ...sx,
        }}
      >
        <Icon sx={{ fontSize: 50 }} />
        <Typography variant="caption">{label}</Typography>
      </Button>
    </Box>
  );
}
