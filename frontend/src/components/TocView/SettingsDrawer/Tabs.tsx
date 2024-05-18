import usePdfNotes from "@/hooks/usePdfNotes";
import { Box, Tab, Tabs as MaterialTabs } from "@mui/material";

/**
 * タブ
 */
export default function Tabs({
  tab,
  setTab,
}: {
  tab: number;
  setTab: (i: number) => void;
}): JSX.Element {
  const { pageLabel } = usePdfNotes();
  return (
    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
      <MaterialTabs
        value={tab}
        onChange={(_, i: number) => {
          setTab(i);
        }}
      >
        <Tab label={pageLabel} />
        <Tab label="ファイル" />
        <Tab label="アプリ" />
      </MaterialTabs>
    </Box>
  );
}
