import { FC, useContext, useEffect, useState } from "react";
import {
  Backdrop,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { History } from "@/types/History";
import { ModelContext } from "@/contexts/ModelContext";
import { UiStateContext } from "@/contexts/UiStateContext";

/**
 * `History`の引数
 */
interface Props {
  open: boolean;
  onClose: (id?: string) => void;
}

/**
 * PDFを開いた履歴
 */
export const HistoryDialog: FC<Props> = ({ open, onClose }) => {
  const { model } = useContext(ModelContext);
  const { setWaiting } = useContext(UiStateContext);
  const [history, setHistory] = useState<History>([]);

  useEffect(() => {
    if (!open) return;
    setWaiting(true);
    model
      .getHistory()
      .then((h) => {
        setHistory(h);
      })
      .catch(() => {
        setHistory([]);
      })
      .finally(() => {
        setWaiting(false);
      });
  }, [open, model, setWaiting]);

  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={open}
      onClick={() => {
        onClose();
      }}
    >
      <Box
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <Typography variant="body1">履歴からPDFファイルを開く</Typography>
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
                  場所
                </TableCell>
                <TableCell align="center" sx={{ width: 80, color: "white" }}>
                  ページ数
                </TableCell>
                <TableCell align="center" sx={{ width: 130, color: "white" }}>
                  アクセス日時
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history.map((row) => (
                <TableRow
                  hover
                  key={row.id}
                  sx={{ cursor: "pointer" }}
                  onClick={() => {
                    onClose(row.id);
                  }}
                >
                  <TableCell component="th" scope="row" sx={{ height: 30 }}>
                    {row.name}
                  </TableCell>
                  <TableCell align="center">{row.origin}</TableCell>
                  <TableCell align="center">{row.pages}</TableCell>
                  <TableCell align="center">{row.accessDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Backdrop>
  );
};
