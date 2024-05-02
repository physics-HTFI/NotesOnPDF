import { Tooltip, Typography } from "@mui/material";
import { PdfNotes, Page as PageParams } from "@/types/PdfNotes";

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
}: {
  sectionBreakInner?: boolean;
  tooltip?: string;
  isCurrent?: boolean;
  page?: PageParams;
  onClick?: () => void;
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
  return (
    <Tooltip title={tooltip} disableInteractive enterDelay={0} leaveDelay={0}>
      <span
        style={{
          display: "inline-block",
          width: sectionBreakInner ? 3 : 7,
          height: 7,
          background: getPageColor(isCurrent, page),
          marginRight: 2,
          marginBottom: 2,
          marginTop: 2,
          opacity: page?.style?.includes("excluded") ? 0.3 : 1,
          cursor: "pointer",
        }}
        onClick={onClick}
      />
    </Tooltip>
  );
};

/**
 * 節区切り
 */
export const Separator = () => (
  <span
    style={{
      height: 11,
      width: 1,
      marginLeft: 2,
      marginRight: 4,
      background: "darkgray",
      display: "inline-block",
    }}
  />
);

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
  if (!pdfNotes) return [];
  const toc: JSX.Element[] = [];
  let pageNum = 1;
  for (let i = 0; i < pdfNotes.pages.length; i++) {
    const page = pdfNotes.pages[i];
    const handleClick = () => {
      onChanged?.({ ...pdfNotes, currentPage: i });
    };

    // 第名を追加
    if (page?.book !== undefined) {
      toc.push(
        <Book key={`book-${i}`} title={page.book} onClick={handleClick} />
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
    if (page?.style?.includes("break-before")) {
      toc.push(<Separator key={`separator-${i}`} />);
    }
    // ページを追加
    pageNum = page?.numberRestart ?? pageNum;
    toc.push(
      <Page
        key={`page-${i}`}
        sectionBreakInner={page?.style?.includes("break-middle")}
        tooltip={`p. ${pageNum}`}
        isCurrent={i === pdfNotes.currentPage}
        page={page}
        onClick={handleClick}
      />
    );
    if (page?.style?.includes("break-middle")) {
      toc.push(<Separator key={`separator-inner-${i}`} />);
      toc.push(
        <Page
          key={`page-right-${i}`}
          sectionBreakInner={page.style.includes("break-middle")}
          tooltip={`p. ${pageNum}`}
          isCurrent={i === pdfNotes.currentPage}
          page={page}
          onClick={handleClick}
        />
      );
    }
    ++pageNum;
  }
  return toc;
};

export default ToC;