import { Lock } from "@mui/icons-material";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";

/**
 * パーミッション選択カードのテンプレート
 */
export function CardButton({
  color,
  Icon,
  title,
  children,
  onClick,
}: {
  color: string;
  Icon: typeof Lock;
  title: string;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Card
      sx={{
        borderColor: color,
        borderWidth: 1,
        borderStyle: "solid",
        boxShadow: "none",
      }}
    >
      <CardActionArea onClick={onClick}>
        <CardContent>
          <Stack sx={{ flexDirection: "row", gap: 1 }}>
            <Icon sx={{ color }} />
            <Box>
              <Typography
                variant="body1"
                sx={{
                  pt: "4px",
                  pb: 1,
                  display: "inline-block",
                  color,
                  cursor: "pointer",
                }}
              >
                {title}
              </Typography>
              <Box sx={{ fontWeight: "normal" }}>{children}</Box>
            </Box>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
