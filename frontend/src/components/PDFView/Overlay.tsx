import React from "react";
import { Page } from "@/types/Notes";
import { Box } from "@mui/material";

/**
 * `Overlay`の引数
 */
interface Props {
  page?: Page;
}

/**
 * PDFビュークリック時に表示されるコントロール
 */
const Overlay: React.FC<Props> = () => {
  const [w, h] = [680, 480];
  return (
    <>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          left: 0,
          top: 0,
          overflow: "visible",
        }}
      >
        <defs>
          <marker
            viewBox="0 0 10 8"
            id="head"
            orient="auto-start-reverse"
            markerWidth="8"
            markerHeight="10"
            refX="5"
            refY="5"
          >
            <path d="M0,0 V10 L8,5 Z" fill="red" />
          </marker>
          <marker
            viewBox="-2 -1 2 11"
            id="bracket"
            orient="auto"
            markerWidth="4"
            markerHeight="12"
            refX="0"
            refY="10"
          >
            <path
              d="M0,0 V10"
              stroke="red"
              strokeWidth="1"
              strokeLinecap="square"
            />
          </marker>
        </defs>

        <rect
          x={`${0.5 * w}`}
          y={`${0.5 * h}`}
          width={`${0.2 * w}`}
          height={`${0.1 * h}`}
          style={{ fill: "red", opacity: 0.3, cursor: "pointer" }}
          onMouseDown={(e) => {
            e.stopPropagation();
            e.preventDefault();
            alert("click");
          }}
        />
        <polygon
          points={`${0.3 * w},${0.3 * h} ${0.35 * w},${0.3 * h} ${0.35 * w},${
            0.35 * h
          } ${0.25 * w},${0.35 * h}`}
          style={{ fill: "red", opacity: 0.3, cursor: "pointer" }}
          onMouseDown={(e) => {
            e.stopPropagation();
            e.preventDefault();
            alert("click");
          }}
        />

        <g
          style={{
            cursor: "pointer",
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            e.preventDefault();
            alert("click");
          }}
        >
          <line
            x1={`${0.4 * w}`}
            y1={`${0.4 * h}`}
            x2={`${0.8 * w}`}
            y2={`${0.8 * h}`}
            style={{
              stroke: "white",
              opacity: 0.7,
              strokeWidth: "5",
            }}
          />
          <line
            x1={`${0.4 * w}`}
            y1={`${0.4 * h}`}
            x2={`${0.8 * w}`}
            y2={`${0.8 * h}`}
            style={{
              stroke: "red",
              strokeWidth: "1",
              markerStart: "url(#head)",
              markerEnd: "url(#head)",
            }}
          />
        </g>

        <g
          style={{
            cursor: "pointer",
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            e.preventDefault();
            alert("click");
          }}
        >
          <line
            x1={`${0.2 * w}`}
            y1={`${0.8 * h}`}
            x2={`${0.5 * w}`}
            y2={`${0.8 * h}`}
            style={{
              stroke: "white",
              opacity: 0.7,
              strokeWidth: "5",
            }}
          />
          <line
            x1={`${0.2 * w}`}
            y1={`${0.8 * h}`}
            x2={`${0.5 * w}`}
            y2={`${0.8 * h}`}
            style={{
              stroke: "red",
              strokeWidth: "1",
              markerStart: "url(#bracket)",
              markerEnd: "url(#bracket)",
            }}
          />
        </g>

        <line
          x1={`${0.2 * w}`}
          y1={`${0.59 * h}`}
          x2={`${0.8 * w}`}
          y2={`${0.59 * h}`}
          style={{
            stroke: "yellow",
            opacity: 0.5,
            strokeWidth: "8",
            cursor: "pointer",
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            e.preventDefault();
            alert("click");
          }}
        />
      </svg>
      <Box
        sx={{
          position: "absolute",
          left: "12%",
          top: "12%",
          color: "red",
          cursor: "pointer",
          background: "#FFFc",
        }}
        dangerouslySetInnerHTML={{ __html: "<h3>h3</h3>aaaaa<br/>bbb" }}
        onMouseDown={(e) => {
          e.stopPropagation();
          e.preventDefault();
          alert("click");
        }}
      />
      <Box
        sx={{
          position: "absolute",
          left: "10%",
          top: "50%",
          borderRadius: 3,
          border: "solid 1px red",
          color: "red",
          cursor: "pointer",
          px: 1,
          background: "#FFFc",
        }}
        fontSize={12}
        onMouseDown={(e) => {
          e.stopPropagation();
          e.preventDefault();
          alert("click");
        }}
      >
        {"p. 100"}
      </Box>
    </>
  );
};

export default Overlay;
