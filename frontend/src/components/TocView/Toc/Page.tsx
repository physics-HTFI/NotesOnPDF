import { Tooltip } from "@mui/material";
import { type Page as PageParams } from "@/types/PdfNotes";

/**
 * ページ要素
 */
export default function Page({
  sectionBreak,
  tooltip,
  isCurrent,
  page,
  onClick,
  // 全てのページに<Tooltip>を設定すると遅くなるので、マウスホバーしたページにだけ設定する。
  // <Page>ごとに`openTooltip`フラグを持たせて、onMouseEnterとonMouseLeaveで切り替えるようにすると、
  // onMouseLeaveが呼ばれないことがあるので、親コンポーネントから一括して管理するようにしている。
  index,
  openTooltips,
  setOpenTooltips,
}: {
  sectionBreak?: "before" | "after" | "full";
  tooltip?: string;
  isCurrent?: boolean;
  page?: PageParams;
  onClick?: () => void;
  index?: number;
  openTooltips?: boolean[];
  setOpenTooltips?: (openTooltips: boolean[]) => void;
}) {
  const getPageColor = (isCurrent?: boolean, page?: PageParams) => {
    if (isCurrent) {
      return page?.notes ? "magenta" : "red";
    } else {
      return page?.notes && !page.style?.includes("excluded")
        ? "#00cd5b"
        : undefined;
    }
  };
  const radius = 3.5;
  const style = {
    width:
      sectionBreak === "before" || sectionBreak === "after"
        ? radius
        : undefined,
    borderRadius:
      sectionBreak === "before"
        ? `${radius}px 0 0 ${radius}px`
        : sectionBreak === "after"
          ? `0 ${radius}px ${radius}px 0`
          : undefined,
    marginRight: sectionBreak === "after" ? 0 : undefined,
    background: getPageColor(isCurrent, page),
    opacity: page?.style?.includes("excluded") ? 0.3 : undefined,
  };
  const hasStyle = Object.values(style).some((v) => v !== undefined);
  const openTooltip = index !== undefined && openTooltips?.[index];
  return (
    <span
      id={String(index)}
      className={openTooltip ? undefined : "page"}
      style={(openTooltip ?? !hasStyle) ? undefined : style}
      onClick={onClick}
      onMouseEnter={() => {
        if (!setOpenTooltips || !openTooltips) return;
        setOpenTooltips(openTooltips.map((_, j) => index === j));
      }}
    >
      {openTooltip && (
        <Tooltip
          title={tooltip}
          disableInteractive
          enterDelay={0}
          leaveDelay={0}
        >
          <span
            className="page"
            style={hasStyle ? style : undefined}
            onClick={onClick}
          />
        </Tooltip>
      )}
    </span>
  );
}
