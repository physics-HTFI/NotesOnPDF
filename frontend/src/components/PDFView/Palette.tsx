import { FC, useContext } from "react";
import { Box, Chip, Paper } from "@mui/material";
import { MouseContext } from "@/contexts/MouseContext";
import Arrow from "./Overlay/Arrow";
import Svg from "./Overlay/Svg";
import Bracket from "./Overlay/Bracket";
import Marker from "./Overlay/Marker";
import Rect from "./Overlay/Rect";
import Polygon from "./Overlay/Polygon";
import { Shortcut } from "@mui/icons-material";
import { useNotes } from "@/hooks/useNotes";
import { NoteType } from "@/types/Notes";

/**
 * `Palette`の引数
 */
interface Props {
  open: boolean;
  onClose: () => void;
  onEdit: (note: NoteType) => void;
}

/**
 * PDFビュークリック時に表示されるコントロール
 */
const Palette: FC<Props> = ({ open, onClose, onEdit }) => {
  const { mouse, pageRect } = useContext(MouseContext);
  const { notes, pushNote } = useNotes();
  const L = 50;
  const svgRect = new DOMRect(0, 0, 1.5 * L, 1.5 * L);
  const DIVISIONS = 8;
  const Θ = (2 * Math.PI) / DIVISIONS;
  const props = (i: number) => {
    return {
      position: "absolute",
      width: L,
      height: L,
      top: L,
      left: L,
      borderRadius: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      transform: `translate(${Math.cos(i * Θ) * L}px, ${
        Math.sin(i * Θ) * L
      }px)`,
    };
  };

  if (!mouse || !pageRect || !notes || !open) return <></>;
  const [x, y] = [
    (mouse.pageX - pageRect.x) / pageRect.width,
    (mouse.pageY - pageRect.y) / pageRect.height,
  ];
  return (
    <Paper
      elevation={3}
      sx={{
        position: "fixed",
        top: (-3 * L) / 2,
        left: (-3 * L) / 2,
        width: 3 * L,
        height: 3 * L,
        borderRadius: "100%",
        transform: `translate(${mouse.pageX}px, ${mouse.pageY}px)`,
        zIndex: 1050, // SpeedDialより手前にする：https://mui.com/material-ui/customization/z-index/
      }}
    >
      {/* Marker */}
      <Box
        sx={props(0)}
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

      {/* Arrow */}
      <Box
        sx={props(1)}
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

      {/* Bracket */}
      <Box
        sx={props(2)}
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

      {/* Note */}
      <Box
        sx={props(3)}
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

      {/* Chip */}
      <Box
        sx={props(4)}
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

      {/* PageLink */}
      <Box
        sx={props(5)}
        onMouseEnter={() => {
          onClose();
          onEdit({
            type: "PageLink",
            x: x,
            y: y,
            page: notes.currentPage,
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

      {/* Polygon */}
      <Box
        sx={props(6)}
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

      {/* Rect */}
      <Box
        sx={props(7)}
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

      <Svg pageRect={new DOMRect(0, 0, 3 * L, 3 * L)} noPointerEvents>
        <radialGradient id="rg" spreadMethod="pad">
          <stop offset="30%" stopColor="#fff" />
          <stop offset="50%" stopColor="#bbb" />
        </radialGradient>
        <path
          d={[...Array(DIVISIONS).keys()]
            .map((i) => {
              const [dx, dy] = [
                L * Math.cos((i + 0.5) * Θ),
                L * Math.sin((i + 0.5) * Θ),
              ];
              const [p1, p2] = [
                `${1.5 * L},${1.5 * L}`,
                `${1.5 * L + 1.5 * dx},${1.5 * L + 1.5 * dy}`,
              ];
              return `M${p1}L${p2}`;
            })

            .join("")}
          style={{
            stroke: "url(#rg)",
            fill: "none",
            strokeWidth: 1,
            strokeDasharray: "1,4",
          }}
        />
      </Svg>
    </Paper>
  );
};

export default Palette;
