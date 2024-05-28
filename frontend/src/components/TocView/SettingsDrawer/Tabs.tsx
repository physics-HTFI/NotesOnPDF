import usePdfNotes from "@/hooks/usePdfNotes";
import { Box, Tab, Tabs as MaterialTabs, Tooltip } from "@mui/material";

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
        <Tab
          label={
            <Tooltip
              title="ファイル設定は注釈ファイルに保存されます"
              placement="top"
              disableInteractive
            >
              <span>ファイル</span>
            </Tooltip>
          }
        />
        <Tab
          label={
            <Tooltip
              title={
                <span>
                  アプリ設定は
                  <br />
                  {'"(基準フォルダ)/.NoteOnPdf/settings.json"'}
                  <br />
                  に保存されます
                </span>
              }
              placement="top"
              disableInteractive
            >
              <span>アプリ</span>
            </Tooltip>
          }
        />
      </MaterialTabs>
    </Box>
  );
}
