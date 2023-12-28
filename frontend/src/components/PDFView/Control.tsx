import React, { useState } from "react";
import { Box, SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";
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
 * `Control`の引数
 */
interface Props {
  mode: Mode;
  setMode: (mode: Mode) => void;
  onOpenFileTree: () => void;
  onOpenSettings: () => void;
}

/**
 * 目次の右上に表示されるボタンコントロール
 */
const Control: React.FC<Props> = ({
  mode,
  setMode,
  onOpenFileTree,
  onOpenSettings,
}) => {
  const [upward, setUpward] = useState(true);
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
      <SpeedDial
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
          tooltipTitle={
            <span style={{ fontSize: "80%" }}>PDF選択パネルを開く</span>
          }
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
          tooltipTitle={
            <span style={{ fontSize: "80%" }}>
              設定パネルを{upward ? "開く" : "閉じる"}
            </span>
          }
          icon={upward ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          onClick={(e) => {
            onOpenSettings();
            setUpward(!upward);
            setMode(null);
            setOpen(false);
            e.stopPropagation();
          }}
          tooltipPlacement="right"
          tooltipOpen
        />

        {/* 注釈の編集 */}
        <SpeedDialAction
          tooltipTitle={
            <span style={{ fontSize: "80%" }}>
              注釈の<strong>編集</strong>
            </span>
          }
          icon={<Edit sx={{ color: "cornflowerblue" }} />}
          onClick={(e) => {
            setMode("edit");
            setOpen(false);
            e.stopPropagation();
          }}
          tooltipPlacement="right"
          tooltipOpen
        />

        {/* 注釈の移動 */}
        <SpeedDialAction
          tooltipTitle={
            <span style={{ fontSize: "80%" }}>
              注釈の<strong>移動</strong>
            </span>
          }
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
          tooltipTitle={
            <span style={{ fontSize: "80%" }}>
              注釈の<strong>削除</strong>
            </span>
          }
          icon={<Delete sx={{ color: "palevioletred" }} />}
          onClick={(e) => {
            setMode("delete");
            setOpen(false);
            e.stopPropagation();
          }}
          tooltipPlacement="right"
          tooltipOpen
        />
      </SpeedDial>
    </Box>
  );
};

export default Control;
