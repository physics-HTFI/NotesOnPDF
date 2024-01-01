import React, { useContext } from "react";
import { Box, Chip, Paper } from "@mui/material";
import { MouseContext } from "@/contexts/MouseContext";
import Arrow from "./Overlay/Arrow";
import Svg from "./Overlay/Svg";
import Bracket from "./Overlay/Bracket";
import Marker from "./Overlay/Marker";
import Rect from "./Overlay/Rect";
import Polygon from "./Overlay/Polygon";
import { Shortcut } from "@mui/icons-material";

/**
 * `Palette`の引数
 */
interface Props {
  open: boolean;
}

/**
 * PDFビュークリック時に表示されるコントロール
 */
const Palette: React.FC<Props> = ({ open }) => {
  const { mouse } = useContext(MouseContext);
  const L = 50;
  const props = {
    position: "absolute",
    width: L,
    height: L,
    top: L,
    left: L,
    borderRadius: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };
  const translate = (i: number) => {
    const Θ = (2 * Math.PI) / 8;
    return `translate(${Math.cos(i * Θ) * L}px, ${Math.sin(i * Θ) * L}px)`;
  };
  const pageRect = new DOMRect(0, 0, 1.5 * L, 1.5 * L);

  if (!mouse || !open) return <></>;
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
      <Box sx={{ ...props, transform: translate(0) }}>
        <Svg pageRect={pageRect}>
          <Marker
            pageRect={pageRect}
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
      <Box sx={{ ...props, transform: translate(1) }}>
        <Svg pageRect={pageRect}>
          <Arrow
            pageRect={pageRect}
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
      <Box sx={{ ...props, transform: translate(2) }}>
        <Svg pageRect={pageRect}>
          <Bracket
            pageRect={pageRect}
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
      <Box sx={{ ...props, transform: translate(3) }}>
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
      <Box sx={{ ...props, transform: translate(4) }}>
        <Chip
          sx={{
            fontSize: "75%",
            transform: "scale(80%)",
          }}
          color="primary"
          label="ABCDE"
          size="small"
        />
      </Box>

      {/* PageLink */}
      <Box sx={{ ...props, transform: translate(5) }}>
        <Chip
          sx={{
            fontSize: "75%",
            transform: "scale(80%)",
          }}
          color="success"
          icon={<Shortcut />}
          label="p. 1"
          size="small"
        />
      </Box>

      {/* Polygon */}
      <Box sx={{ ...props, transform: translate(6) }}>
        <Svg pageRect={pageRect}>
          <Polygon
            pageRect={pageRect}
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
      <Box sx={{ ...props, transform: translate(7) }}>
        <Svg pageRect={pageRect}>
          <Rect
            pageRect={pageRect}
            params={{
              type: "Rect",
              x1: 0.25,
              y1: 0.35,
              x2: 0.8,
              y2: 0.65,
            }}
          />
        </Svg>
      </Box>
    </Paper>
  );
};

export default Palette;
