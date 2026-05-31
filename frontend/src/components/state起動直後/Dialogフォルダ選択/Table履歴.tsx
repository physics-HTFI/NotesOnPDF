import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import TooltipIconButton from "@/components/common/TooltipIconButton";

/**
 * 履歴を表示するコンポーネント
 */
export function Table履歴({
  folders,
  onRemoveAt,
  onSelect,
}: {
  /** リストに表示するフォルダハンドルの配列 */
  folders: FileSystemDirectoryHandle[];
  /** `index` 番目の項目の削除が要求されたときの処理 */
  onRemoveAt: (index: number) => void;
  /** 項目が選択されたときの処理 */
  onSelect: (folder: FileSystemDirectoryHandle) => void;
}) {
  if (folders.length === 0) return "なし";
  return (
    <TableContainer
      component={Box}
      sx={{
        background: "white",
        borderRadius: 2,
      }}
    >
      <Table size="small">
        <TableBody>
          {folders.map((folder) => (
            <TableRow
              hover
              key={folder.name}
              sx={{ cursor: "pointer" }}
              onClick={() => {
                onSelect(folder);
              }}
            >
              <TableCell component="th" scope="row">
                {folder.name}
              </TableCell>
              <TableCell sx={{ width: 30 }}>
                <TooltipIconButton
                  icon={<Delete />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveAt(folders.indexOf(folder));
                  }}
                  sx={{ color: "steelblue" }}
                  tooltipTitle="この履歴を削除します"
                  tooltipPlacement="right"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
