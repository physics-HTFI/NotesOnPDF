import { FC } from "react";
import { Box, Chip, SxProps } from "@mui/material";
import Arrow from "../Overlay/Arrow";
import Svg from "../Overlay/Svg";
import Bracket from "../Overlay/Bracket";
import Marker from "../Overlay/Marker";
import Rect from "../Overlay/Rect";
import Polygon from "../Overlay/Polygon";
import { Shortcut } from "@mui/icons-material";
import { NoteType } from "@/types/Notes";

/**
 * パレットの各アイコンの`Props`
 */
export interface IconProps {
  sx: SxProps;
  onClose: () => void;
  pushNote: (note: NoteType) => void;
  onEdit: (note: NoteType) => void;
  x: number;
  y: number;
  page: number;
  svgRect: DOMRect;
}

/**
 * パレットのMarkerアイコン
 */
export const MarkerIcon: FC<IconProps> = ({
  sx,
  onClose,
  pushNote,
  x,
  y,
  svgRect,
}) => (
  <Box
    sx={sx}
    onMouseEnter={() => {
      onClose();
      pushNote({
        type: "Marker",
        x1: x,
        y1: y,
        x2: x + 0.1,
        y2: y,
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
export const ArrowIcon: FC<IconProps> = ({
  sx,
  onClose,
  pushNote,
  x,
  y,
  svgRect,
}) => (
  <Box
    sx={sx}
    onMouseEnter={() => {
      onClose();
      pushNote({
        type: "Arrow",
        x1: x,
        y1: y,
        x2: x + 0.1,
        y2: y + 0.1,
      });
    }}
  >
    <Svg pageRect={svgRect}>
      <Arrow
        pageRect={svgRect}
        params={{
          type: "Arrow",
          x1: 0.3,
          y1: 0.3,
          x2: 0.7,
          y2: 0.7,
        }}
      />
    </Svg>
  </Box>
);

/**
 * パレットのBracketアイコン
 */
export const BracketIcon: FC<IconProps> = ({
  sx,
  onClose,
  pushNote,
  x,
  y,
  svgRect,
}) => (
  <Box
    sx={sx}
    onMouseEnter={() => {
      onClose();
      pushNote({
        type: "Bracket",
        x1: x,
        y1: y,
        x2: x,
        y2: y + 0.1,
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
export const NoteIcon: FC<IconProps> = ({ sx, onClose, onEdit, x, y }) => (
  <Box
    sx={sx}
    onMouseEnter={() => {
      onClose();
      onEdit({
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
export const ChipIcon: FC<IconProps> = ({ sx, onClose, onEdit, x, y }) => (
  <Box
    sx={sx}
    onMouseEnter={() => {
      onClose();
      onEdit({
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
export const PageLinkIcon: FC<IconProps> = ({
  sx,
  onClose,
  onEdit,
  x,
  y,
  page,
}) => (
  <Box
    sx={sx}
    onMouseEnter={() => {
      onClose();
      onEdit({
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
export const PolygonIcon: FC<IconProps> = ({
  sx,
  onClose,
  pushNote,
  x,
  y,
  svgRect,
}) => (
  <Box
    sx={sx}
    onMouseEnter={() => {
      onClose();
      pushNote({
        type: "Polygon",
        points: [
          [x, y],
          [x + 0.1, y],
          [x + 0.08, y - 0.03],
          [x + 0.04, y - 0.05],
        ],
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
export const RectIcon: FC<IconProps> = ({
  sx,
  onClose,
  pushNote,
  x,
  y,
  svgRect,
}) => (
  <Box
    sx={sx}
    onMouseEnter={() => {
      onClose();
      pushNote({
        type: "Rect",
        x: x,
        y: y - 0.1,
        width: 0.1,
        height: 0.1,
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
