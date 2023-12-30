import React, { useEffect, useState } from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { Polygon, Rect } from "@/types/Notes";
import { useNotes } from "@/hooks/useNotes";
import EditorBase from "./EditorBase";
import { Rectangle, RectangleOutlined } from "@mui/icons-material";

/**
 * `PolygonEditor`の引数
 */
interface Props {
  params: Polygon | Rect;
  onClose: () => void;
}

/**
 * 直方体、ポリゴンの編集ダイアログ
 */
const PolygonEditor: React.FC<Props> = ({ params, onClose }) => {
  const { update } = useNotes();
  const [type, setType] = useState(params.border ?? false ? "border" : "fill");

  // 閉じたときに値を更新する
  useEffect(() => {
    return () => {
      const border = type === "border" ? true : undefined;
      if (border === params.border) return;
      update(params, { ...params, border });
    };
  });

  return (
    <EditorBase width={100} height={50} onClose={onClose}>
      <ToggleButtonGroup
        value={type}
        exclusive
        onChange={(_, newType: string | null) => {
          if (!newType) return;
          setType(newType);
        }}
      >
        <ToggleButton value="fill">
          <Rectangle />
        </ToggleButton>
        <ToggleButton value="border">
          <RectangleOutlined />
        </ToggleButton>
      </ToggleButtonGroup>
    </EditorBase>
  );
};

export default PolygonEditor;
