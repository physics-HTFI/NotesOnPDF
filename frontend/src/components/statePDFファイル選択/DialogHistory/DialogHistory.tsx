import {
  Backdrop,
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import TooltipIconButton from "@/components/common/TooltipIconButton";
import { modelフォルダ } from "@/components/state起動直後/modelフォルダ";
import { useAtomValue, useSetAtom } from "jotai";
import { atomHistory, atomUpdateHistory } from "./modelHistory";

/**
 * PDFを開いた履歴
 */
export default function DialogHistory({
  open,
  onClose,
}: {
  open: boolean;
  onClose: (path?: string) => void;
}) {
  const readOnly = modelフォルダ.readOnly.useValue();
  const history = useAtomValue(atomHistory);
  const updateHistory = useSetAtom(atomUpdateHistory);

  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={open}
      onClick={() => onClose()}
    >
      <Box sx={{ userSelect: "none" }} onClick={(e) => e.stopPropagation()}>
        <Stack direction="row">
          <Typography variant="body1">履歴からPDFファイルを開く</Typography>
          <TooltipIconButton
            disabled={readOnly}
            icon={<Delete />}
            onClick={() => updateHistory({ type: "全削除" })}
            sx={{ pt: 0, ml: "auto" }}
            tooltipTitle={
              readOnly
                ? "読み取り専用モードのため使用できません"
                : "全ての履歴を消去します"
            }
            tooltipPlacement="top"
          />
        </Stack>

        <TableContainer
          component={Box}
          sx={{
            maxWidth: 1000,
            minHeight: 200,
            maxHeight: "calc(100vh - 100px)",
            background: "white",
            borderRadius: 2,
          }}
        >
          <Table size="small">
            <TableHead sx={{ background: "#72a0db" }}>
              <TableRow>
                <TableCell sx={{ minWidth: 150, height: 30, color: "white" }}>
                  ファイル名
                </TableCell>
                <TableCell align="center" sx={{ width: 80, color: "white" }}>
                  ページ数
                </TableCell>
                <TableCell align="center" sx={{ width: 130, color: "white" }}>
                  アクセス日時
                </TableCell>
                <TableCell align="center" sx={{ width: 30, color: "white" }} />
              </TableRow>
            </TableHead>
            <TableBody>
              {history.map((row) => (
                <TableRow
                  hover
                  key={row.path}
                  sx={{ cursor: "pointer" }}
                  onClick={() => onClose(row.path)}
                >
                  <TableCell component="th" scope="row" sx={{ height: 30 }}>
                    {row.name}
                  </TableCell>
                  <TableCell align="center">{row.pages}</TableCell>
                  <TableCell align="center">{row.accessDate}</TableCell>
                  <TableCell align="center">
                    <TooltipIconButton
                      disabled={readOnly}
                      icon={<Delete />}
                      onClick={() =>
                        updateHistory({ type: "削除", path: row.path })
                      }
                      sx={{ color: "#72a0db" }}
                      tooltipTitle={
                        readOnly
                          ? "読み取り専用モードのため使用できません"
                          : "この履歴を消去します"
                      }
                      tooltipPlacement="right"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Backdrop>
  );
}
