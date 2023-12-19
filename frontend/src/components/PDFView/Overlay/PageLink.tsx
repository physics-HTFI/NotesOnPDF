import React from "react";
import { Chip } from "@mui/material";
import { Shortcut } from "@mui/icons-material";

/**
 * `PageLink`の引数
 */
interface Props {
  x: number;
  y: number;
  label: string;
  onClick: () => void;
}

/**
 * ページへのリンク
 */
const PageLink: React.FC<Props> = ({ x, y, label, onClick }) => {
  return (
    <Chip
      sx={{
        position: "absolute",
        left: `${100 * x}%`,
        top: `${100 * y}%`,
        cursor: "pointer",
        fontSize: "75%",
      }}
      color="success"
      icon={<Shortcut />}
      label={label}
      size="small"
      onMouseDown={(e) => {
        e.stopPropagation();
        e.preventDefault();
        onClick();
      }}
    />
  );
};

export default PageLink;
