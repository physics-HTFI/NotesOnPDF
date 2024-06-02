import { Alert, Backdrop, Button, Snackbar, Stack } from "@mui/material";

/**
 * バックエンドが起動していない、または、設定を変更してためにリロードが必要であることを示すスナックバー
 */
export default function CriticalError({
  open,
  needsReload,
  children,
}: {
  open: boolean;
  needsReload: boolean;
  children: JSX.Element;
}) {
  return (
    <Backdrop sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
      <Snackbar open={open}>
        <Alert
          elevation={6}
          variant="filled"
          severity="error"
          sx={{ width: "100%" }}
        >
          <Stack direction="row">
            <span>{children}</span>
            {needsReload && (
              <Button
                variant="contained"
                color="warning"
                sx={{ ml: 2 }}
                onClick={() => {
                  location.reload();
                }}
              >
                リロード
              </Button>
            )}
          </Stack>
        </Alert>
      </Snackbar>
    </Backdrop>
  );
}
