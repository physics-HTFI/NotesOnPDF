import { FC, useContext, useState } from "react";
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
import { UiStateContext } from "@/contexts/UiStateContext";

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
  hidden: boolean;
}

/**
 * 目次の右上に表示されるボタンコントロール
 */
const SpeedDial: FC<Props> = ({ mode, setMode, hidden }) => {
  const { openSettingsDrawer, setOpenFileTreeDrawer, setOpenSettingsDrawer } =
    useContext(UiStateContext);
  const [open, setOpen] = useState(false);

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
        >
          {/* PDF選択パネルを開く */}
          <SpeedDialAction
            tooltipTitle={"PDF選択パネルを開きます"}
            icon={<KeyboardArrowRight />}
            onClick={() => {
              setOpenFileTreeDrawer(true);
              setMode(null);
            }}
            tooltipPlacement="right"
          />

          {/* 設定パネルの開閉 */}
          <SpeedDialAction
            tooltipTitle={`設定パネルを${
              openSettingsDrawer ? "閉じます" : "開きます"
            }`}
            icon={<Settings />}
            onClick={() => {
              setOpenSettingsDrawer(!openSettingsDrawer);
              setMode(null);
            }}
            tooltipPlacement="right"
          />

          {/* 注釈の移動・変形 */}
          <SpeedDialAction
            tooltipTitle={"注釈の移動・変形"}
            icon={<OpenWith sx={{ color: "mediumseagreen" }} />}
            sx={{ background: mode === "move" ? green[50] : undefined }}
            onClick={() => {
              setMode(mode !== "move" ? "move" : null);
            }}
            tooltipPlacement="right"
          />

          {/* 注釈の編集 */}
          <SpeedDialAction
            tooltipTitle={"注釈の文字列・線種の変更"}
            icon={<Edit sx={{ color: "cornflowerblue" }} />}
            sx={{ background: mode === "edit" ? blue[50] : undefined }}
            onClick={() => {
              setMode(mode !== "edit" ? "edit" : null);
            }}
            tooltipPlacement="right"
          />

          {/* 注釈の削除 */}
          <SpeedDialAction
            tooltipTitle={"注釈の削除"}
            icon={<Delete sx={{ color: "palevioletred" }} />}
            sx={{ background: mode === "delete" ? red[50] : undefined }}
            onClick={() => {
              setMode(mode !== "delete" ? "delete" : null);
            }}
            tooltipPlacement="right"
          />
        </MUISpeedDial>
      </ThemeProvider>
    </Box>
  );
};

export default SpeedDial;
