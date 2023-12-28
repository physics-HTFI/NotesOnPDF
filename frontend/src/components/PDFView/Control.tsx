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

/**
 * `Control`の引数
 */
interface Props {
  onOpenFileTree: () => void;
  onOpenSettings: () => void;
}

/**
 * 目次の右上に表示されるボタンコントロール
 */
const Control: React.FC<Props> = ({ onOpenFileTree, onOpenSettings }) => {
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
        e.stopPropagation();
      }}
    >
      <SpeedDial
        ariaLabel="edit"
        direction="down"
        open={open}
        onMouseEnter={() => {
          // onOpenで設定すると、ファイルツリーを開いた後、再度呼ばれてopen===trueに戻ってしまう。
          // ファイルツリーを閉じた後はopen===falseのままになってほしいので、onMouseEnterにしている。
          setOpen(true);
        }}
        onClose={() => {
          setOpen(false);
        }}
        FabProps={{
          size: "small",
          sx: {
            bgcolor: "silver",
            "&:hover": {
              bgcolor: "darkgray",
            },
            boxShadow: "none",
          },
        }}
        sx={{ mt: 1 }}
        icon={<SpeedDialIcon />}
      >
        {/* PDF選択パネルを開く */}
        <SpeedDialAction
          tooltipTitle={
            <span style={{ fontSize: "80%" }}>PDF選択パネルを開く</span>
          }
          icon={<KeyboardArrowRight />}
          onClick={() => {
            onOpenFileTree();
            setOpen(false);
          }}
          tooltipPlacement="right"
          tooltipOpen
        />

        {/* 設定パネルの開閉 */}
        <SpeedDialAction
          tooltipTitle={
            <span style={{ fontSize: "80%" }}>設定パネルの開閉</span>
          }
          icon={upward ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          onClick={() => {
            onOpenSettings();
            setUpward(!upward);
            setOpen(false);
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
          icon={<Edit />}
          onClick={() => undefined}
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
          icon={<OpenWith />}
          onClick={() => undefined}
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
          icon={<Delete />}
          onClick={() => undefined}
          tooltipPlacement="right"
          tooltipOpen
        />
      </SpeedDial>
    </Box>
  );
};

export default Control;
