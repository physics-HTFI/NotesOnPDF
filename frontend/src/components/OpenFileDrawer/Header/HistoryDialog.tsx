import { useContext, useEffect, useState } from "react";
import {
  Backdrop,
  Box,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import History from "@/types/History";
import UiStateContext from "@/contexts/UiStateContext";
import ModelContext from "@/contexts/ModelContext";
import { Delete } from "@mui/icons-material";

/**
 * PDFを開いた履歴
 */
export default function HistoryDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: (id?: string) => void;
}) {
  const { model } = useContext(ModelContext);
  const { readOnly, setWaiting, setAlert } = useContext(UiStateContext);
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
        setAlert("error", "履歴の取得に失敗しました");
      })
      .finally(() => {
        setWaiting(false);
      });
  }, [open, model, setWaiting, setAlert]);

  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={open}
      onClick={() => {
        onClose();
      }}
    >
      <Box
        sx={{ userSelect: "none" }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <Stack direction="row">
          <Typography variant="body1">履歴からPDFファイルを開く</Typography>
          <Tooltip
            title="履歴を全て消去します"
            placement="top"
            disableInteractive
          >
            <span style={{ marginLeft: "auto" }}>
              <IconButton
                sx={{ color: "white", paddingTop: 0 }}
                onClick={() => {
                  if (readOnly) {
                    setAlert(
                      "error",
                      <span>読み取り専用モードのため消去できません</span>
                    );
                    return;
                  }
                  model
                    .deleteHistoryAll()
                    .then(() => {
                      setHistory([]);
                    })
                    .catch(() => {
                      setAlert("error", "履歴の消去に失敗しました");
                    });
                }}
                size="small"
              >
                <Delete />
              </IconButton>
            </span>
          </Tooltip>
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
                  場所
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
                  <TableCell align="center">
                    <Tooltip
                      title="この履歴を消去します"
                      placement="right"
                      disableInteractive
                    >
                      <span>
                        <IconButton
                          sx={{ color: "#72a0db" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (readOnly) {
                              setAlert(
                                "error",
                                <span>
                                  読み取り専用モードのため消去できません
                                </span>
                              );
                              return;
                            }
                            model
                              .deleteHistory(row.id)
                              .then(() => {
                                setHistory(
                                  history.filter((h) => h.id !== row.id)
                                );
                              })
                              .catch(() => {
                                setAlert("error", "履歴の消去に失敗しました");
                              });
                          }}
                          size="small"
                        >
                          <Delete />
                        </IconButton>
                      </span>
                    </Tooltip>
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
