import { Box, Chip } from "@mui/material";
import Arrow from "../Items/Arrow";
import Svg from "../../common/Svg";
import Bracket from "../Items/Bracket";
import Marker from "../Items/Marker";
import Rect from "../Items/Rect";
import Polygon from "../Items/Polygon";
import { Shortcut } from "@mui/icons-material";

/**
 * パレットのArrowアイコン
 */
export const ArrowIcon = ({ svgRect }: { svgRect: DOMRect }) => (
  <Box>
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
  </Box>
);

/**
 * パレットのBracketアイコン
 */
export const BracketIcon = ({ svgRect }: { svgRect: DOMRect }) => (
  <Box>
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
  </Box>
);

/**
 * パレットのChipアイコン
 */
export const ChipIcon = () => (
  <Box>
    <Chip
      sx={{
        fontSize: "75%",
        transform: "scale(80%)",
      }}
      color="primary"
      label="ABC"
      size="small"
    />
  </Box>
);

/**
 * パレットのMarkerアイコン
 */
export const MarkerIcon = ({ svgRect }: { svgRect: DOMRect }) => (
  <Box>
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
  </Box>
);

/**
 * パレットのMemoアイコン
 */
export const MemoIcon = () => (
  <Box>
    <Box
      sx={{
        color: "red",
        fontSize: "90%",
        transform: "scale(80%)",
      }}
    >
      注釈
    </Box>
  </Box>
);

/**
 * パレットのPageLinkアイコン
 */
export const PageLinkIcon = () => (
  <Box>
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
  </Box>
);

/**
 * パレットのPolygonアイコン
 */
export const PolygonIcon = ({ svgRect }: { svgRect: DOMRect }) => (
  <Box>
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
  </Box>
);

/**
 * パレットのRectアイコン
 */
export const RectIcon = ({ svgRect }: { svgRect: DOMRect }) => (
  <Box>
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
  </Box>
);
