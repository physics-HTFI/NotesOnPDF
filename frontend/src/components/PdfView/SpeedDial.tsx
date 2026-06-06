import { useState } from "react";
import {
  Box,
  SpeedDial as MUISpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
} from "@mui/material";
import {
  Delete,
  Edit,
  KeyboardArrowRight,
  OpenWith,
} from "@mui/icons-material";
import { blue, green, grey, red } from "@mui/material/colors";
import { useSetAtom } from "jotai";
import { modelUi } from "@/global/modelUi";

export type Mode = undefined | "edit" | "move" | "delete";

/**
 * 目次の右上に表示されるボタンコントロール
 */
export default function SpeedDial({
  mode,
  setMode,
  hidden,
}: {
  mode: Mode;
  setMode: (mode: Mode) => void;
  hidden: boolean;
}) {
  const setOpenDrawer = useSetAtom(modelUi.openDrawer.pdfFileTree.atom);
  const [open, setOpen] = useState(true);

  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        visibility: hidden ? "collapse" : undefined,
      }}
      onMouseDown={(e) => {
        const speeddialYMax = 50;
        const isSpeedDial = e.pageY < speeddialYMax;
        if (open || isSpeedDial) {
          e.stopPropagation();
          // `SpeedDialAction`は非表示でもサイズを持っているので、
          // `isSpeedDial`に限定することで、アイコンがあった部分のクリック時に`Palette`が出なくなるのを防いでいる
        }
        if (isSpeedDial) {
          if (mode) setMode(undefined);
          setOpen(!open);
        }
      }}
      onKeyDown={(e) => {
        e.preventDefault();
      }}
    >
      <MUISpeedDial
        ariaLabel="edit"
        direction="down"
        open={open}
        icon={<SpeedDialIcon />}
        sx={{ mt: 1 }}
        FabProps={{
          size: "small",
          sx: {
            bgcolor: grey[400],
            "&:hover": {
              bgcolor: grey[500],
            },
            boxShadow: "none",
          },
        }}
        onFocus={(e) => {
          // これがないと、チップ編集中にEsc, Enterを押すと、スピードダイアルの編集ボタンのツールチップが出る
          e.target.blur();
        }}
      >
        {/* PDF選択パネルを開く */}
        <SpeedDialAction
          icon={<KeyboardArrowRight />}
          disableInteractive
          onClick={() => {
            setOpenDrawer(true);
            setMode(undefined);
          }}
          slotProps={{
            tooltip: {
              title: "PDF選択パネルを開きます",
              placement: "right",
            },
          }}
        />

        {/* 注釈の移動・変形 */}
        <SpeedDialAction
          disableInteractive
          icon={<OpenWith sx={{ color: "mediumseagreen" }} />}
          sx={{ background: mode === "move" ? green[50] : undefined }}
          onClick={() => {
            setMode(mode !== "move" ? "move" : undefined);
          }}
          slotProps={{
            tooltip: {
              title: (
                <span>
                  注釈の移動・変形モードを切り替えます
                  <br />
                  <br />
                  [Escape] 操作のキャンセル、モード解除
                </span>
              ),
              placement: "right",
            },
          }}
        />

        {/* 注釈の編集 */}
        <SpeedDialAction
          disableInteractive
          icon={<Edit sx={{ color: "cornflowerblue" }} />}
          sx={{ background: mode === "edit" ? blue[50] : undefined }}
          onClick={() => {
            setMode(mode !== "edit" ? "edit" : undefined);
          }}
          slotProps={{
            tooltip: {
              title: (
                <span>
                  注釈の文字列・線種の変更モードを切り替えます <br />
                  <br />
                  [Escape] 操作のキャンセル、モード解除
                </span>
              ),
              placement: "right",
            },
          }}
        />

        {/* 注釈の削除 */}
        <SpeedDialAction
          disableInteractive
          icon={<Delete sx={{ color: "palevioletred" }} />}
          sx={{ background: mode === "delete" ? red[50] : undefined }}
          onClick={() => {
            setMode(mode !== "delete" ? "delete" : undefined);
          }}
          slotProps={{
            tooltip: {
              title: (
                <span>
                  注釈の削除モードを切り替えます <br />
                  <br />
                  [Escape] 削除モード解除 <br />
                  [Shift+Delete] 現在ページ内の全注釈を削除 <br />
                  [Ctrl+Delete]
                  現在ページの注釈を、ページ表示直後の状態にリセット
                  <br />
                  [Alt+Delete]
                  全ての注釈・設定を、PDF読み込み直後の状態にリセット
                </span>
              ),
              placement: "right",
            },
          }}
        />
      </MUISpeedDial>
    </Box>
  );
}
