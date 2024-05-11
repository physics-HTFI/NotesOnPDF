import { Tooltip } from "@mui/material";
import { Page as PageParams } from "@/types/PdfNotes";

/**
 * ページ要素
 */
export default function Page({
  sectionBreakInner,
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
  sectionBreakInner?: boolean;
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
        ? "limegreen"
        : "black";
    }
  };
  const style = {
    display: "inline-block",
    width: sectionBreakInner ? 3 : 7,
    height: 7,
    background: getPageColor(isCurrent, page),
    marginRight: 2,
    marginBottom: 2,
    marginTop: 2,
    opacity: page?.style?.includes("excluded") ? 0.3 : 1,
    cursor: "pointer",
  };
  const openTooltip = index !== undefined && openTooltips?.[index];
  return (
    <span
      style={openTooltip ? undefined : style}
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
          <span style={style} onClick={onClick} />
        </Tooltip>
      )}
    </span>
  );
}
