import { FC, useContext } from "react";
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
const ArrowEditor: FC<Props> = ({ params, onClose }) => {
  const isArrow = params.type === "Arrow";
  const defaultHeads = isArrow ? "end" : "both";
  const { updateNote } = useNotes();
  const { pageRect } = useContext(MouseContext);
  if (!pageRect) return <></>;

  // 閉じたときに値を更新する
  const handleClose = (newType?: typeof params.heads) => {
    onClose();
    if (!newType) return; // キャンセル時
    const heads = newType === defaultHeads ? undefined : newType;
    if (heads === params.heads) return;
    updateNote(params, { ...params, heads });
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
    return (
      <ToggleButton key={heads} value={heads} sx={toggleSx}>
        <Svg pageRect={pageRectButton}>
          {line.type === "Arrow" ? (
            <ArrowSvg pageRect={pageRectButton} params={line} />
          ) : (
            <BracketSvg pageRect={pageRectButton} params={line} />
          )}
        </Svg>
      </ToggleButton>
    );
  };

  return (
    <EditorBase onClose={handleClose}>
      <ToggleButtonGroup
        value={params.heads ?? defaultHeads}
        exclusive
        size="small"
        sx={{ "& *:focus": { outline: "none" } }}
        onChange={(_, newType: string | null) => {
          if (
            newType === "end" ||
            newType === "both" ||
            newType === "start" ||
            newType === "none"
          ) {
            handleClose(newType);
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
