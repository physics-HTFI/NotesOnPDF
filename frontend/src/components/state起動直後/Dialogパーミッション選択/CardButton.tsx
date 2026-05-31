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
 * カードのテンプレート
 */
export function CardButton({
  color,
  title,
  children,
  Icon,
  onClick,
}: {
  color: string;
  title: string;
  children: React.ReactNode;
  Icon: typeof Lock;
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
          <Stack sx={{ direction: "row", gap: 1 }}>
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
