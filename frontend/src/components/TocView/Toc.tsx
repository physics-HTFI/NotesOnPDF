import { Tooltip, Typography } from "@mui/material";
import { PdfNotes, Page as PageParams } from "@/types/PdfNotes";
import { useState } from "react";
import { grey } from "@mui/material/colors";

/**
 * 題名要素
 */
const Book = ({ title, onClick }: { title: string; onClick?: () => void }) => (
  <Typography
    variant="body1"
    sx={{
      whiteSpace: "nowrap",
      color: "gray",
      "&:not(:first-of-type)": { pt: 1 },
    }}
  >
    <span style={{ cursor: "pointer" }} onClick={onClick}>
      {title}
    </span>
  </Typography>
);

/**
 * 部名要素
 */
const Part = ({ title, onClick }: { title: string; onClick?: () => void }) => (
  <Typography
    variant="body2"
    sx={{ whiteSpace: "nowrap", color: "gray", pt: 0.8 }}
  >
    <span style={{ cursor: "pointer" }} onClick={onClick}>
      {title}
    </span>
  </Typography>
);

/**
 * 章名要素
 */
const Chapter = ({
  title,
  onClick,
}: {
  title: string;
  onClick?: () => void;
}) => (
  <Typography
    variant="body2"
    sx={{
      pt: 0.5,
      fontSize: "110%",
      lineHeight: 1,
      color: "gray",
      whiteSpace: "nowrap",
      minHeight: 6,
    }}
  >
    <span style={{ cursor: "pointer" }} onClick={onClick}>
      {title}
    </span>
  </Typography>
);

/**
 * ページ要素
 */
export const Page = ({
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
}) => {
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
      onMouseEnter={() => {
        if (!setOpenTooltips || !openTooltips) return;
        setOpenTooltips(openTooltips.map((_, j) => index === j));
      }}
    >
      {!openTooltip && <span style={style} onClick={onClick} />}
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
};

/**
 * 節区切り
 */
export const Separator = ({
  onClick,
  tooltip,
  index,
  openTooltips,
  setOpenTooltips,
}: {
  onClick?: () => void;
  tooltip?: string;
  index?: number;
  openTooltips?: boolean[];
  setOpenTooltips?: (openTooltips: boolean[]) => void;
}) => {
  const openTooltip = index !== undefined && openTooltips?.[index];
  const separator = (
    <span
      style={{
        height: 11,
        width: 1,
        borderLeft: `2px solid ${grey[100]}`,
        borderRight: `4px solid ${grey[100]}`,
        background: "darkgray",
        display: "inline-block",
        cursor: "pointer",
      }}
      onClick={onClick}
    />
  );
  return (
    <span
      onMouseEnter={() => {
        if (!setOpenTooltips || !openTooltips) return;
        setOpenTooltips(openTooltips.map((_, j) => index === j));
      }}
    >
      {!openTooltip && separator}
      {openTooltip && (
        <Tooltip
          title={tooltip}
          disableInteractive
          enterDelay={0}
          leaveDelay={0}
        >
          {separator}
        </Tooltip>
      )}
    </span>
  );
};

/**
 * @returns 目次の内容
 */
const ToC = ({
  pdfNotes,
  onChanged,
}: {
  pdfNotes?: PdfNotes;
  onChanged?: (pdfNotes: PdfNotes) => void;
}) => {
  const [openTooltips, setOpenTooltips] = useState<boolean[]>([]);
  if (!pdfNotes) return [];
  if (pdfNotes.pages.length !== openTooltips.length) {
    setOpenTooltips(new Array(pdfNotes.pages.length).fill(false));
    return undefined;
  }

  const toc: JSX.Element[] = [];
  let pageNum = 1;
  for (let i = 0; i < pdfNotes.pages.length; i++) {
    const page = pdfNotes.pages[i];
    const handleClick = () => {
      onChanged?.({ ...pdfNotes, currentPage: i });
    };

    // 第名を追加
    if (page?.volume !== undefined) {
      toc.push(
        <Book key={`volume-${i}`} title={page.volume} onClick={handleClick} />
      );
    }
    // 部名を追加
    if (page?.part !== undefined) {
      toc.push(
        <Part key={`part-${i}`} title={page.part} onClick={handleClick} />
      );
    }
    // 章名を追加
    if (page?.chapter !== undefined) {
      toc.push(
        <Chapter
          key={`Chapter-${i}`}
          title={page.chapter}
          onClick={handleClick}
        />
      );
    }
    // 節区切りを追加
    pageNum = page?.numberRestart ?? pageNum;
    if (page?.style?.includes("break-before")) {
      toc.push(
        <Separator
          key={`separator-${i}`}
          onClick={handleClick}
          tooltip={`p. ${pageNum}`}
          index={i}
          openTooltips={openTooltips}
          setOpenTooltips={setOpenTooltips}
        />
      );
    }
    // ページを追加
    toc.push(
      <Page
        key={`page-${i}`}
        sectionBreakInner={page?.style?.includes("break-middle")}
        tooltip={`p. ${pageNum}`}
        isCurrent={i === pdfNotes.currentPage}
        page={page}
        onClick={handleClick}
        index={i}
        openTooltips={openTooltips}
        setOpenTooltips={setOpenTooltips}
      />
    );
    if (page?.style?.includes("break-middle")) {
      toc.push(
        <Separator
          key={`separator-inner-${i}`}
          onClick={handleClick}
          tooltip={`p. ${pageNum}`}
          index={i}
          openTooltips={openTooltips}
          setOpenTooltips={setOpenTooltips}
        />
      );
      toc.push(
        <Page
          key={`page-right-${i}`}
          sectionBreakInner={page.style.includes("break-middle")}
          tooltip={`p. ${pageNum}`}
          isCurrent={i === pdfNotes.currentPage}
          page={page}
          onClick={handleClick}
          index={i}
          openTooltips={openTooltips}
          setOpenTooltips={setOpenTooltips}
        />
      );
    }
    ++pageNum;
  }
  return toc;
};

export default ToC;
