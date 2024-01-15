import { FC, useContext } from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { Arrow, Bracket } from "@/types/PdfInfo";
import { usePdfInfo } from "@/hooks/usePdfInfo";
import EditorBase from "./EditorBase";
import Svg from "../Items/Svg";
import { red } from "@mui/material/colors";
import ArrowItem from "../Items/Arrow";
import BracketItem from "../Items/Bracket";
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
  const { updateNote } = usePdfInfo();
  const { pageRect } = useContext(MouseContext);
  if (!pageRect) return <></>;

  const start = params.heads.includes("start");
  const end = params.heads.includes("end");
  const heads = start && end ? "both" : start ? "start" : end ? "end" : "none";

  // 閉じたときに値を更新する
  const handleClose = (newHeads?: "start" | "end" | "both" | "none") => {
    onClose();
    if (!newHeads) return; // キャンセル時
    if (newHeads === heads) return;
    updateNote(params, { ...params, heads: getHeads(newHeads) });
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
  const getButton = (heads: "start" | "end" | "both" | "none") => {
    const line: Arrow | Bracket = {
      type: params.type,
      heads: getHeads(heads),
      ...getVector(params, pageRect, 0.8),
    };
    return (
      <ToggleButton key={heads} value={heads} sx={toggleSx}>
        <Svg pageRect={pageRectButton}>
          {line.type === "Arrow" ? (
            <ArrowItem pageRect={pageRectButton} params={line} />
          ) : (
            <BracketItem pageRect={pageRectButton} params={line} />
          )}
        </Svg>
      </ToggleButton>
    );
  };

  return (
    <EditorBase onClose={handleClose}>
      <ToggleButtonGroup
        value={heads}
        exclusive
        size="small"
        sx={{ "& *:focus": { outline: "none" } }}
        onChange={(_, heads: string | null) => {
          if (
            heads === "end" ||
            heads === "both" ||
            heads === "start" ||
            heads === "none"
          ) {
            handleClose(heads);
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

//|
//| ローカル関数
//|

function getHeads(headsStr: string): ("start" | "end")[] {
  return headsStr === "start"
    ? ["start"]
    : headsStr === "end"
    ? ["end"]
    : headsStr === "both"
    ? ["start", "end"]
    : [];
}
