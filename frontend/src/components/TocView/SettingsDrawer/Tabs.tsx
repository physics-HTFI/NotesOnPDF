import { Box, Tab, Tabs as MaterialTabs } from "@mui/material";

/**
 * タブ
 */
export default function Tabs({
  tab,
  setTab,
  pageLabel,
}: {
  tab: number;
  setTab: (i: number) => void;
  pageLabel?: string;
}): JSX.Element {
  return (
    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
      <MaterialTabs
        value={tab}
        onChange={(_, i: number) => {
          setTab(i);
        }}
      >
        <Tab label={pageLabel ?? "p. ???"} />
        <Tab label="ファイル" />
        <Tab label="アプリ" />
      </MaterialTabs>
    </Box>
  );
}
