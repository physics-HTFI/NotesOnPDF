import { Tooltip, Typography } from "@mui/material";
import { PdfInfo, Page } from "@/types/PdfInfo";

/**
 * 題名を返す
 */
const getBook = (i: number, title: string, onClick?: () => void) => (
  <Typography
    key={`book-${i}`}
    variant="body1"
    sx={{
      whiteSpace: "nowrap",
      color: "gray",
      cursor: "pointer",
      "&:not(:first-of-type)": { pt: 1 },
    }}
    onClick={onClick}
  >
    {title}
  </Typography>
);

/**
 * 部名を返す
 */
const getPart = (i: number, title: string, onClick?: () => void) => (
  <Typography
    key={`part-${i}`}
    variant="body2"
    sx={{ whiteSpace: "nowrap", color: "gray", pt: 0.8, cursor: "pointer" }}
    onClick={onClick}
  >
    {title}
  </Typography>
);

/**
 * 章名を返す
 */
const getChapter = (i: number, title: string, onClick?: () => void) => (
  <Typography
    key={`chapter-${i}`}
    variant="body2"
    sx={{
      pt: 0.5,
      fontSize: "110%",
      lineHeight: 1,
      color: "gray",
      whiteSpace: "nowrap",
      minHeight: 6,
      cursor: "pointer",
    }}
    onClick={onClick}
  >
    {title}
  </Typography>
);

/**
 * ページを返す
 */
export const getPage = (
  sectionBreakInner?: boolean,
  key?: string,
  tooltip?: string,
  isCurrent?: boolean,
  page?: Page,
  onClick?: () => void
) => {
  const getPageColor = (isCurrent?: boolean, page?: Page) => {
    if (isCurrent) {
      return page?.notes ? "magenta" : "red";
    } else {
      return page?.notes && !page.excluded ? "limegreen" : "black";
    }
  };
  return (
    <Tooltip
      key={key}
      title={tooltip}
      disableInteractive
      enterDelay={0}
      leaveDelay={0}
    >
      <span
        style={{
          display: "inline-block",
          width: sectionBreakInner ? 3 : 7,
          height: 7,
          background: getPageColor(isCurrent, page),
          marginRight: 2,
          marginBottom: 2,
          marginTop: 2,
          opacity: page?.excluded ? 0.3 : 1,
          cursor: "pointer",
        }}
        onClick={onClick}
      />
    </Tooltip>
  );
};

/**
 * 節区切りを返す
 */
export const getSeparator = (key?: string) => (
  <span
    key={key}
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
const getTOCData = (
  pdfInfo?: PdfInfo,
  onChanged?: (pdfInfo: PdfInfo) => void
): JSX.Element[] => {
  if (!pdfInfo) return [];
  const toc: JSX.Element[] = [];
  let pageNum = 1;
  for (let i = 0; i < pdfInfo.numPages; i++) {
    const page = pdfInfo.pages[i];
    const handleClick = () => {
      onChanged?.({ ...pdfInfo, currentPage: i });
    };

    // 第名を追加
    if (page?.book !== undefined) {
      toc.push(getBook(i, page.book, handleClick));
    }
    // 部名を追加
    if (page?.part !== undefined) {
      toc.push(getPart(i, page.part, handleClick));
    }
    // 章名を追加
    if (page?.chapter !== undefined) {
      toc.push(getChapter(i, page.chapter, handleClick));
    }
    // 節区切りを追加
    if (page?.sectionBreak) {
      toc.push(getSeparator(`separator-${i}`));
    }
    // ページを追加
    pageNum = page?.pageNumberRestart ?? pageNum;
    toc.push(
      getPage(
        page?.sectionBreakInner,
        `page-${i}`,
        `p. ${pageNum}`,
        i === pdfInfo.currentPage,
        page,
        handleClick
      )
    );
    if (page?.sectionBreakInner) {
      toc.push(getSeparator(`separator-inner-${i}`));
      toc.push(
        getPage(
          page.sectionBreakInner,
          `page-right-${i}`,
          `p. ${pageNum}`,
          i === pdfInfo.currentPage,
          page,
          handleClick
        )
      );
    }
    ++pageNum;
  }
  return toc;
};

export default getTOCData;
