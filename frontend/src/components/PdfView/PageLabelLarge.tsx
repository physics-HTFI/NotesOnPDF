import { Paper } from "@mui/material";

/**
 * 画面中央のページ数表示コンポーネント
 */
export default function PageLabelLarge({
  label,
  shown,
}: {
  label?: string;
  shown: boolean;
}) {
  return (
    shown && (
      <Paper
        elevation={5}
        sx={{
          color: "white",
          background: "darkseagreen",
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          width: 140,
          height: 50,
          m: "auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "2em",
          animation: "fadeIn 0.2s ease 0s 1",
          "@keyframes fadeIn": {
            "0%": {
              opacity: 0,
            },
            "90%": {
              opacity: 0,
            },
            "100%": {
              opacity: 1,
            },
          },
        }}
      >
        {label}
      </Paper>
    )
  );
}
