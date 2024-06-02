import { useContext, useState } from "react";
import {
  Box,
  SpeedDial as MUISpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import {
  Delete,
  Edit,
  KeyboardArrowRight,
  OpenWith,
  Settings,
} from "@mui/icons-material";
import { blue, green, grey, red } from "@mui/material/colors";
import { UiContext } from "@/contexts/UiContext";

export type Mode = undefined | "edit" | "move" | "delete";

/**
 * `SpeedDialogAction`のCSS変更
 */
const theme = createTheme({
  components: {
    MuiSpeedDialAction: {
      styleOverrides: {
        staticTooltipLabel: {
          whiteSpace: "nowrap",
          fontSize: "80%",
          background: "gray",
          color: "white",
        },
      },
    },
  },
});

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
  const { openSettingsDrawer, setOpenFileTreeDrawer, setOpenSettingsDrawer } =
    useContext(UiContext);
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
      <ThemeProvider theme={theme}>
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
            tooltipTitle={"PDF選択パネルを開きます"}
            icon={<KeyboardArrowRight />}
            disableInteractive
            onClick={() => {
              setOpenFileTreeDrawer(true);
              setMode(undefined);
            }}
            tooltipPlacement="right"
          />

          {/* 設定パネルの開閉 */}
          <SpeedDialAction
            tooltipTitle={`設定パネルを${
              openSettingsDrawer ? "閉じます" : "開きます"
            }`}
            disableInteractive
            icon={<Settings />}
            onClick={() => {
              setOpenSettingsDrawer(!openSettingsDrawer);
              setMode(undefined);
            }}
            tooltipPlacement="right"
          />

          {/* 注釈の移動・変形 */}
          <SpeedDialAction
            tooltipTitle={
              <span>
                注釈の移動・変形モード <br />
                [Escape] 操作のキャンセル、モード解除
              </span>
            }
            disableInteractive
            icon={<OpenWith sx={{ color: "mediumseagreen" }} />}
            sx={{ background: mode === "move" ? green[50] : undefined }}
            onClick={() => {
              setMode(mode !== "move" ? "move" : undefined);
            }}
            tooltipPlacement="right"
          />

          {/* 注釈の編集 */}
          <SpeedDialAction
            tooltipTitle={
              <span>
                注釈の文字列・線種の変更モード <br />
                [Escape] 操作のキャンセル、モード解除
              </span>
            }
            disableInteractive
            icon={<Edit sx={{ color: "cornflowerblue" }} />}
            sx={{ background: mode === "edit" ? blue[50] : undefined }}
            onClick={() => {
              setMode(mode !== "edit" ? "edit" : undefined);
            }}
            tooltipPlacement="right"
          />

          {/* 注釈の削除 */}
          <SpeedDialAction
            tooltipTitle={
              <span>
                注釈の削除モード <br />
                [Escape] 削除モード解除 <br />
                [Ctrl+Delete] ページ内の全注釈を削除
              </span>
            }
            disableInteractive
            icon={<Delete sx={{ color: "palevioletred" }} />}
            sx={{ background: mode === "delete" ? red[50] : undefined }}
            onClick={() => {
              setMode(mode !== "delete" ? "delete" : undefined);
            }}
            tooltipPlacement="right"
          />
        </MUISpeedDial>
      </ThemeProvider>
    </Box>
  );
}
