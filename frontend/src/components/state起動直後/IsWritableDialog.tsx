import { useContext } from "react";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import { Lock, LockOpen } from "@mui/icons-material";
import UiContext from "@/contexts/UiContext";

/**
 * 「読み込み専用」か「書き込み可能」かを選択するダイアログ
 */
export default function IsWritableDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { setReadOnly } = useContext(UiContext);

  return (
    <Dialog open={open} fullWidth>
      <DialogTitle sx={{ backgroundColor: "gainsboro" }}>
        選択してください
      </DialogTitle>
      <DialogContent sx={{ backgroundColor: "gainsboro" }}>
        <Stack direction="column" gap={2}>
          {/* 書き込み可能 */}
          <MyCard
            color="steelblue"
            title="自動保存モード（読み込み＆書き込み）"
            Icon={LockOpen}
            onClick={() => {
              setReadOnly(false);
              onClose();
            }}
          >
            変更が加えられた際に、注釈ファイルを自動保存します。
            <br />
            注釈ファイル名は &quot;(PDFファイルパス).json&quot; です。
            <br />
            また、基準フォルダ直下に、設定フォルダ &quot;.NotesOnPdf&quot;
            が生成されます。
          </MyCard>

          {/* 読み取り専用 */}
          <MyCard
            color="firebrick"
            title="読み取り専用モード（読み込みのみ）"
            Icon={Lock}
            onClick={() => {
              setReadOnly(true);
              onClose();
            }}
          >
            閲覧や編集はできますが、保存は一切行われません。
          </MyCard>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

/**
 * カードのテンプレート
 */
function MyCard({
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
    <Card>
      <CardActionArea onClick={onClick}>
        <CardContent>
          <Stack direction="row" gap={1}>
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
