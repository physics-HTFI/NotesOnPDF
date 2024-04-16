import { FC, useEffect, useState } from "react";
import {
  Backdrop,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import IModel from "@/models/IModel";
import { History, HistoryFileOrigin2String } from "@/types/History";

/**
 * `History`の引数
 */
interface Props {
  model: IModel;
  open: boolean;
  onClose: (id?: string) => void;
}

/**
 * PDFを開いた履歴
 */
const HistoryDialog: FC<Props> = ({ model, open, onClose }) => {
  const [history, setHistory] = useState<History>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    setSelectedId(null);
    if (!open) return;
    model
      .getHistory()
      .then((h) => {
        setHistory(h);
      })
      .catch(() => undefined);
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
            maxHeight: "calc(100vh - 100px)",
            background: "white",
          }}
        >
          <Table size="small">
            <TableHead sx={{ background: "lightsteelblue" }}>
              <TableRow>
                <TableCell>ファイル名</TableCell>
                <TableCell align="right" sx={{ width: 80 }}>
                  場所
                </TableCell>
                <TableCell align="right" sx={{ width: 150 }}>
                  アクセス日時
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history.map((row) => (
                <TableRow
                  selected={selectedId == row.id}
                  hover
                  key={row.id}
                  onClick={() => {
                    setSelectedId(row.id);
                  }}
                >
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="right">
                    {historyFileOrigin2String(row.origin)}
                  </TableCell>
                  <TableCell align="right">{row.accsessDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box
          sx={{
            mb: 0.5,
            display: "flex",
            justifyContent: "flex-end",
            background: "white",
          }}
        >
          <Button
            variant="contained"
            sx={{ color: "white", m: 1 }}
            size="small"
            onClick={() => {
              onClose();
            }}
          >
            キャンセル
          </Button>
          <Button
            disabled={!selectedId}
            variant="contained"
            sx={{ color: "white", m: 1 }}
            size="small"
            onClick={() => {
              onClose(selectedId ?? undefined);
            }}
          >
            開く
          </Button>
        </Box>
      </Box>
    </Backdrop>
  );
};

export default HistoryDialog;
