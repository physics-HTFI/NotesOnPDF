import React, { useContext, useState } from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { Arrow, Bracket } from "@/types/Notes";
import { useNotes } from "@/hooks/useNotes";
import EditorBase from "./EditorBase";
import Svg from "../Svg";
import { red } from "@mui/material/colors";
import ArrowSvg from "../Arrow";
import BracketSvg from "../Bracket";
import { MouseContext } from "@/contexts/MouseContext";

/**
 * 与えられた直線と同じ向きを持つ`ToggleButton`用ベクトルを返す
 */
const getVector = (
  params: Arrow | Bracket,
  pageRect: DOMRect,
  scale: number
) => {
  const x = (params.x2 - params.x1) * pageRect.width;
  const y = (params.y2 - params.y1) * pageRect.height;
  const l = Math.sqrt(x ** 2 + y ** 2);
  const unitX = x / l;
  const unitY = y / l;
  return {
    x1: 0.5 - scale * 0.5 * unitX,
    y1: 0.5 - scale * 0.5 * unitY,
    x2: 0.5 + scale * 0.5 * unitX,
    y2: 0.5 + scale * 0.5 * unitY,
  };
};

/**
 * `ArrowEditor`の引数
 */
interface Props {
  params: Arrow | Bracket;
  onClose: () => void;
}

/**
 * Arrow, Bracketの編集ダイアログ
 */
const ArrowEditor: React.FC<Props> = ({ params, onClose }) => {
  const isArrow = params.type === "Arrow";
  const defaultHeads = isArrow ? "end" : "both";
  const { update } = useNotes();
  const [type, setType] = useState(params.heads ?? defaultHeads);
  const { pageRect } = useContext(MouseContext);
  if (!pageRect) return <></>;

  // 閉じたときに値を更新する
  const handleClose = () => {
    onClose();
    const heads = type === defaultHeads ? undefined : type;
    if (heads === params.heads) return;
    update(params, { ...params, heads });
  };

  const size = 50;
  const pageRectButton = new DOMRect(0, 0, 1.5 * size, 1.5 * size);
  const toggleSx = {
    width: size,
    height: size,
    "&.Mui-selected, &.Mui-selected:hover": {
      background: red[50],
    },
  };

  /** 1つの`ToggleButton`を返す */
  const getButton = (heads: NonNullable<typeof params.heads>) => {
    const line: Arrow | Bracket = {
      type: params.type,
      heads,
      ...getVector(params, pageRect, 0.8),
    };
    const props = {
      pageRect: pageRectButton,
      mode: null,
      onDelete: () => undefined,
      onEdit: () => undefined,
    };
    return (
      <ToggleButton key={heads} value={heads} sx={toggleSx}>
        <Svg pageRect={pageRectButton}>
          {line.type === "Arrow" ? (
            <ArrowSvg {...props} params={line} />
          ) : (
            <BracketSvg {...props} params={line} />
          )}
        </Svg>
      </ToggleButton>
    );
  };

  return (
    <EditorBase onClose={handleClose}>
      <ToggleButtonGroup
        value={type}
        exclusive
        size="small"
        sx={{ m: 1, "& *:focus": { outline: "none" } }}
        onChange={(_, newType: string | null) => {
          if (
            newType === "end" ||
            newType === "both" ||
            newType === "start" ||
            newType === "none"
          ) {
            setType(newType);
          }
        }}
      >
        {(isArrow
          ? (["end", "both", "start", "none"] as const)
          : (["both", "start", "none", "end"] as const)
        ).map((h) => getButton(h))}
      </ToggleButtonGroup>
    </EditorBase>
  );
};

export default ArrowEditor;
