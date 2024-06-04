import { Box, Chip } from "@mui/material";
import Arrow from "../Items/Arrow";
import Svg from "../../common/Svg";
import Bracket from "../Items/Bracket";
import Marker from "../Items/Marker";
import Rect from "../Items/Rect";
import Polygon from "../Items/Polygon";
import { Shortcut } from "@mui/icons-material";
import { PaletteIconType } from "@/types/AppSettings";

/**
 *  `type`に応じたアイコンを返す
 */
export default function Icon({
  L,
  type,
}: {
  L: number;
  type?: PaletteIconType;
}) {
  const svgRect = new DOMRect(0, 0, 1.5 * L, 1.5 * L);
  if (type === "Arrow") return <ArrowIcon svgRect={svgRect} />;
  if (type === "Bracket") return <BracketIcon svgRect={svgRect} />;
  if (type === "Chip") return <ChipIcon />;
  if (type === "Marker") return <MarkerIcon svgRect={svgRect} />;
  if (type === "Memo") return <MemoIcon />;
  if (type === "PageLink") return <PageLinkIcon />;
  if (type === "Polygon") return <PolygonIcon svgRect={svgRect} />;
  if (type === "Rect") return <RectIcon svgRect={svgRect} />;
  return <></>;
}

//|
//| ローカル関数
//|

/**
 * パレットのArrowアイコン
 */
const ArrowIcon = ({ svgRect }: { svgRect: DOMRect }) => (
  <Svg pageRect={svgRect}>
    <Arrow
      pageRect={svgRect}
      params={{
        type: "Arrow",
        x1: 0.3,
        y1: 0.3,
        x2: 0.7,
        y2: 0.7,
        heads: ["end"],
      }}
    />
  </Svg>
);

/**
 * パレットのBracketアイコン
 */
const BracketIcon = ({ svgRect }: { svgRect: DOMRect }) => (
  <Svg pageRect={svgRect}>
    <Bracket
      pageRect={svgRect}
      params={{
        type: "Bracket",
        x1: 0.5,
        y1: 0.2,
        x2: 0.5,
        y2: 0.8,
        heads: ["start", "end"],
      }}
    />
  </Svg>
);

/**
 * パレットのChipアイコン
 */
const ChipIcon = () => (
  <Chip
    sx={{
      fontSize: "75%",
      transform: "scale(80%)",
    }}
    color="primary"
    label="ABC"
    size="small"
  />
);

/**
 * パレットのMarkerアイコン
 */
const MarkerIcon = ({ svgRect }: { svgRect: DOMRect }) => (
  <Svg pageRect={svgRect}>
    <Marker
      pageRect={svgRect}
      params={{
        type: "Marker",
        x1: 0.2,
        y1: 0.5,
        x2: 0.8,
        y2: 0.5,
      }}
    />
  </Svg>
);

/**
 * パレットのMemoアイコン
 */
const MemoIcon = () => (
  <Box
    sx={{
      color: "red",
      fontSize: "90%",
      transform: "scale(80%)",
    }}
  >
    注釈
  </Box>
);

/**
 * パレットのPageLinkアイコン
 */
const PageLinkIcon = () => (
  <Chip
    sx={{
      fontSize: "75%",
      transform: "scale(80%)",
    }}
    color="success"
    icon={<Shortcut />}
    label="p."
    size="small"
  />
);

/**
 * パレットのPolygonアイコン
 */
const PolygonIcon = ({ svgRect }: { svgRect: DOMRect }) => (
  <Svg pageRect={svgRect}>
    <Polygon
      pageRect={svgRect}
      params={{
        type: "Polygon",
        points: [
          [0.2, 0.65],
          [0.8, 0.65],
          [0.7, 0.3],
          [0.4, 0.2],
        ],
        style: "filled",
      }}
    />
  </Svg>
);

/**
 * パレットのRectアイコン
 */
const RectIcon = ({ svgRect }: { svgRect: DOMRect }) => (
  <Svg pageRect={svgRect}>
    <Rect
      pageRect={svgRect}
      params={{
        type: "Rect",
        x: 0.25,
        y: 0.35,
        width: 0.55,
        height: 0.3,
        style: "filled",
      }}
    />
  </Svg>
);
