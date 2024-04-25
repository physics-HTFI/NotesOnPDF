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
import { History, historyFileOrigin2String } from "@/types/History";
import { ModelContext } from "@/contexts/ModelContext";

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
const HistoryDialog: FC<Props> = ({ open, onClose }) => {
  const model = useContext(ModelContext);
  const [history, setHistory] = useState<History>([]);

  useEffect(() => {
    if (!open) return;
    model
      .getHistory()
      .then((h) => {
        setHistory(h);
      })
      .catch(() => {
        setHistory([]);
      });
  }, [open, model]);

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
        <Typography variant="body1">アクセス履歴から開く</Typography>
        <TableContainer
          component={Box}
          sx={{
            maxWidth: 1000,
            minHeight: 200,
            maxHeight: "calc(100vh - 100px)",
            background: "white",
          }}
        >
          <Table size="small">
            <TableHead sx={{ background: "lightsteelblue" }}>
              <TableRow>
                <TableCell sx={{ minWidth: 150 }}>ファイル名</TableCell>
                <TableCell align="center" sx={{ width: 80 }}>
                  場所
                </TableCell>
                <TableCell align="center" sx={{ width: 130 }}>
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
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="center">
                    {historyFileOrigin2String(row.origin)}
                  </TableCell>
                  <TableCell align="center">{row.accsessDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Backdrop>
  );
};

export default HistoryDialog;
