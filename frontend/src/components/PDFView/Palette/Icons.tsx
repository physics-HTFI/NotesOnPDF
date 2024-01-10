import { FC } from "react";
import { Box, Chip, SxProps } from "@mui/material";
import Arrow from "../Items/Arrow";
import Svg from "../Items/Svg";
import Bracket from "../Items/Bracket";
import Marker from "../Items/Marker";
import Rect from "../Items/Rect";
import Polygon from "../Items/Polygon";
import { Shortcut } from "@mui/icons-material";
import { Node, NoteType } from "@/types/PdfInfo";

/**
 * パレットの各アイコンの`Props`
 */
export interface IconProps {
  sx: SxProps;
  onClose: (note: NoteType | Node) => void;
  x: number;
  y: number;
  page: number;
  svgRect: DOMRect;
}

/**
 * パレットのMarkerアイコン
 */
export const MarkerIcon: FC<IconProps> = ({ sx, onClose, x, y, svgRect }) => (
  <Box
    sx={sx}
    onMouseEnter={() => {
      onClose({
        type: "Node",
        index: 1,
        target: {
          type: "Marker",
          x1: x,
          y1: y,
          x2: x,
          y2: y,
        },
      });
    }}
  >
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
 * パレットのArrowアイコン
 */
export const ArrowIcon: FC<IconProps> = ({ sx, onClose, x, y, svgRect }) => (
  <Box
    sx={sx}
    onMouseEnter={() => {
      onClose({
        type: "Node",
        index: 1,
        target: {
          type: "Arrow",
          x1: x,
          y1: y,
          x2: x,
          y2: y,
        },
      });
    }}
  >
    <Svg pageRect={svgRect}>
      <Arrow
        pageRect={svgRect}
        params={{
          type: "Arrow",
          x1: 0.5,
          y1: 0.25,
          x2: 0.5,
          y2: 0.75,
        }}
      />
    </Svg>
  </Box>
);

/**
 * パレットのBracketアイコン
 */
export const BracketIcon: FC<IconProps> = ({ sx, onClose, x, y, svgRect }) => (
  <Box
    sx={sx}
    onMouseEnter={() => {
      onClose({
        type: "Node",
        index: 1,
        target: {
          type: "Bracket",
          x1: x,
          y1: y,
          x2: x,
          y2: y,
        },
      });
    }}
  >
    <Svg pageRect={svgRect}>
      <Bracket
        pageRect={svgRect}
        params={{
          type: "Bracket",
          x1: 0.5,
          y1: 0.2,
          x2: 0.5,
          y2: 0.8,
        }}
      />
    </Svg>
  </Box>
);

/**
 * パレットのNoteアイコン
 */
export const NoteIcon: FC<IconProps> = ({ sx, onClose, x, y }) => (
  <Box
    sx={sx}
    onMouseEnter={() => {
      onClose({
        type: "Note",
        x,
        y,
        html: "",
      });
    }}
  >
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
 * パレットのChipアイコン
 */
export const ChipIcon: FC<IconProps> = ({ sx, onClose, x, y }) => (
  <Box
    sx={sx}
    onMouseEnter={() => {
      onClose({
        type: "Chip",
        x,
        y,
        text: "",
      });
    }}
  >
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
 * パレットのPageLinkアイコン
 */
export const PageLinkIcon: FC<IconProps> = ({ sx, onClose, x, y, page }) => (
  <Box
    sx={sx}
    onMouseEnter={() => {
      onClose({
        type: "PageLink",
        x: x,
        y: y,
        page,
      });
    }}
  >
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
export const PolygonIcon: FC<IconProps> = ({ sx, onClose, x, y, svgRect }) => (
  <Box
    sx={sx}
    onMouseEnter={() => {
      onClose({
        type: "Node",
        index: 1,
        target: {
          type: "Polygon",
          points: [
            [x, y],
            [x, y],
          ],
        },
      });
    }}
  >
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
        }}
      />
    </Svg>
  </Box>
);

/**
 * パレットのRectアイコン
 */
export const RectIcon: FC<IconProps> = ({ sx, onClose, x, y, svgRect }) => (
  <Box
    sx={sx}
    onMouseEnter={() => {
      onClose({
        type: "Node",
        index: 2,
        target: {
          type: "Rect",
          x: x,
          y: y,
          width: 0,
          height: 0,
        },
      });
    }}
  >
    <Svg pageRect={svgRect}>
      <Rect
        pageRect={svgRect}
        params={{
          type: "Rect",
          x: 0.25,
          y: 0.35,
          width: 0.55,
          height: 0.3,
        }}
      />
    </Svg>
  </Box>
);
