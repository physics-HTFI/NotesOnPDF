import type { Coverage } from "@/types/Coverages";
import { Box, Tooltip, Typography } from "@mui/material";
import Progress from "./Progress";

export interface CustomLabelProps {
  children: string;
  coverage?: Coverage;
}

/**
 * `TreeItem`のラベル部分。
 * ファイル／フォルダ名 ＋ プログレスバー
 */
export function CustomLabel({ children, coverage }: CustomLabelProps) {
  return (
    <Tooltip
      title={coverage ? <Progress coverage={coverage} /> : undefined}
      placement="right"
      disableInteractive
    >
      <Box
        sx={{
          display: "flex",
          py: 0.1,
          width: "stretch",
          alignItems: "center",
        }}
      >
        {/* ファイル／フォルダ名 */}
        <Typography variant="body2" sx={{ flexGrow: 1, fontSize: "80%" }}>
          {children}
        </Typography>

        {/* 進捗 */}
        {coverage?.percent !== undefined && (
          <progress
            max="100"
            value={coverage.percent}
            style={{
              width: 20,
              height: 12,
              marginLeft: 8,
              accentColor: "gray",
            }}
          />
        )}
      </Box>
    </Tooltip>
  );
}
