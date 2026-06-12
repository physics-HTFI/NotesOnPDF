import { VERSION } from "@/types/CONSTANTS";
import { DialogTitle } from "@mui/material";

export function Title() {
  return (
    <DialogTitle
      sx={{
        display: "flex",
        gap: 1,
        alignItems: "center",
        marginBottom: 1,
      }}
    >
      <img src="favicon.svg" style={{ height: 24 }} />
      NotesOnPDF
      <span style={{ color: "darkgray", fontSize: "75%", marginTop: 5 }}>
        {VERSION}
      </span>
    </DialogTitle>
  );
}
