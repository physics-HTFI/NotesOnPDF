import React from "react";
import { Page } from "@/types/Notes";

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
  const r = 680.0 / 480;
  return (
    <>
      <svg
        viewBox={`0 0 100 ${100 * r}`}
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          overflow: "visible",
          zIndex: 100,
        }}
      >
        <rect
          x={`${50}`}
          y={`${r * 50}`}
          width={`${20}`}
          height={`${r * 10}`}
          style={{ fill: "red", opacity: 0.3, cursor: "pointer" }}
          onClick={() => {
            alert("click");
          }}
        />
      </svg>
    </>
  );
};

export default Overlay;
