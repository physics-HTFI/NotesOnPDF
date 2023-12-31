import React, { useEffect, useRef } from "react";
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
  KeyboardArrowDown,
  KeyboardArrowRight,
  KeyboardArrowUp,
  OpenWith,
} from "@mui/icons-material";

export type Mode = null | "edit" | "move" | "delete";

/**
 * `SpeedDialogAction`のCSS変更
 */
const theme = createTheme({
  components: {
    MuiSpeedDial: {
      styleOverrides: {
        fab: {
          "&:focus": {
            outline: "none",
          },
        },
      },
    },
    MuiSpeedDialAction: {
      styleOverrides: {
        staticTooltipLabel: {
          whiteSpace: "nowrap",
          fontSize: "80%",
          background: "gray",
          color: "white",
        },
        fab: {
          "&:focus": {
            outline: "none",
          },
        },
      },
    },
  },
});

/**
 * `SpeedDial`の引数
 */
interface Props {
  mode: Mode;
  setMode: (mode: Mode) => void;
  openDrawer: boolean;
  onOpenFileTree: () => void;
  onOpenSettings: () => void;
}

/**
 * 目次の右上に表示されるボタンコントロール
 */
const SpeedDial: React.FC<Props> = ({
  mode,
  setMode,
  openDrawer,
  onOpenFileTree,
  onOpenSettings,
}) => {
  const [open, setOpen] = React.useState(false);
  const modeOld = useRef(mode);

  // モードを設定したときに一度SpeedDialが閉じる[1]ので、
  // その後モードが解除されたときに再表示する。
  // [1] 閉じておかないと編集エディタの邪魔になる（SpeedDialのほうが上にくる）。
  useEffect(() => {
    if (modeOld.current && !mode) setOpen(true);
    modeOld.current = mode;
  }, [mode]);

  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
      }}
      onMouseDown={(e) => {
        e.preventDefault();
        const speeddialYMax = 50;
        const isSpeedDial = e.pageY < speeddialYMax;
        if (open || isSpeedDial) {
          e.stopPropagation();
          // `SpeedDialAction`は非表示でもサイズを持っているので、
          // `isSpeedDial`に限定することで、アイコンがあった部分のクリック時に`Palette`が出なくなるのを防いでいる
        }
        if (isSpeedDial) {
          if (mode) setMode(null);
          setOpen(!open);
        }
      }}
    >
      <ThemeProvider theme={theme}>
        <MUISpeedDial
          ariaLabel="edit"
          direction="down"
          open={open}
          icon={
            !mode ? (
              <SpeedDialIcon />
            ) : mode === "edit" ? (
              <Edit sx={{ color: "cornflowerblue" }} />
            ) : mode === "move" ? (
              <OpenWith sx={{ color: "mediumseagreen" }} />
            ) : (
              <Delete sx={{ color: "palevioletred" }} />
            )
          }
          sx={{ mt: 1 }}
          FabProps={{
            size: "small",
            sx: {
              bgcolor: !mode ? "silver" : "white",
              "&:hover": {
                bgcolor: "darkgray",
              },
              boxShadow: "none",
            },
          }}
        >
          {/* PDF選択パネルを開く */}
          <SpeedDialAction
            tooltipTitle={"PDF選択パネルを開く"}
            icon={<KeyboardArrowRight />}
            onClick={() => {
              onOpenFileTree();
              setMode(null);
            }}
            tooltipPlacement="right"
          />

          {/* 設定パネルの開閉 */}
          <SpeedDialAction
            tooltipTitle={`設定パネルを${openDrawer ? "閉じる" : "開く"}`}
            icon={openDrawer ? <KeyboardArrowDown /> : <KeyboardArrowUp />}
            onClick={() => {
              onOpenSettings();
              setMode(null);
            }}
            tooltipPlacement="right"
          />

          {/* 注釈の編集 */}
          <SpeedDialAction
            tooltipTitle={"注釈の編集"}
            icon={<Edit sx={{ color: "cornflowerblue" }} />}
            sx={{ background: mode === "edit" ? "#FDD" : undefined }}
            onClick={() => {
              setMode("edit");
              setOpen(false);
            }}
            tooltipPlacement="right"
          />

          {/* 注釈の移動・変形 */}
          <SpeedDialAction
            tooltipTitle={"注釈の移動・変形"}
            icon={<OpenWith sx={{ color: "mediumseagreen" }} />}
            sx={{ background: mode === "move" ? "#FDD" : undefined }}
            onClick={() => {
              setMode("move");
              setOpen(false);
            }}
            tooltipPlacement="right"
          />

          {/* 注釈の削除 */}
          <SpeedDialAction
            tooltipTitle={"注釈の削除"}
            icon={<Delete sx={{ color: "palevioletred" }} />}
            sx={{ background: mode === "delete" ? "#FDD" : undefined }}
            onClick={() => {
              setMode("delete");
              setOpen(false);
            }}
            tooltipPlacement="right"
          />
        </MUISpeedDial>
      </ThemeProvider>
    </Box>
  );
};

export default SpeedDial;
