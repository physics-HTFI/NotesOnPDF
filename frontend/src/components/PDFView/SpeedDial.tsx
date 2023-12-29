import React from "react";
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

  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 100,
      }}
      onMouseDown={(e) => {
        if (open) e.stopPropagation();
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
          onMouseEnter={() => {
            if (!mode) setOpen(true);
          }}
          onClick={() => {
            if (mode) setMode(null);
            setOpen(true);
          }}
          onClose={() => {
            setOpen(false);
          }}
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
            onClick={(e) => {
              onOpenFileTree();
              setMode(null);
              setOpen(false);
              e.stopPropagation();
            }}
            tooltipPlacement="right"
            tooltipOpen
          />

          {/* 設定パネルの開閉 */}
          <SpeedDialAction
            tooltipTitle={`設定パネルを${openDrawer ? "閉じる" : "開く"}`}
            icon={openDrawer ? <KeyboardArrowDown /> : <KeyboardArrowUp />}
            onClick={(e) => {
              onOpenSettings();
              setMode(null);
              setOpen(false);
              e.stopPropagation();
            }}
            tooltipPlacement="right"
            tooltipOpen
          />

          {/* 注釈の編集 */}
          <SpeedDialAction
            tooltipTitle={"注釈の編集"}
            icon={<Edit sx={{ color: "cornflowerblue" }} />}
            onClick={(e) => {
              setMode("edit");
              setOpen(false);
              e.stopPropagation();
            }}
            tooltipPlacement="right"
            tooltipOpen
          />

          {/* 注釈の移動・変形 */}
          <SpeedDialAction
            tooltipTitle={"注釈の移動・変形"}
            icon={<OpenWith sx={{ color: "mediumseagreen" }} />}
            onClick={(e) => {
              setMode("move");
              setOpen(false);
              e.stopPropagation();
            }}
            tooltipPlacement="right"
            tooltipOpen
          />

          {/* 注釈の削除 */}
          <SpeedDialAction
            tooltipTitle={"注釈の削除"}
            icon={<Delete sx={{ color: "palevioletred" }} />}
            onClick={(e) => {
              setMode("delete");
              setOpen(false);
              e.stopPropagation();
            }}
            tooltipPlacement="right"
            tooltipOpen
          />
        </MUISpeedDial>
      </ThemeProvider>
    </Box>
  );
};

export default SpeedDial;
