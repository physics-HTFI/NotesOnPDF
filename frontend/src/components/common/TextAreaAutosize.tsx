import { TextareaAutosize as MuiTextareaAutosize, styled } from "@mui/material";
import { blue, grey } from "@mui/material/colors";

// https://mui.com/base-ui/react-textarea-autosize/
const TextareaAutosize = styled(MuiTextareaAutosize)(
  () => `
  field-sizing: content;
  min-width: 100px;
  max-width: 50vw;
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.9rem;
  padding: 8px 12px;
  color: ${grey[900]};
  background: ${"#fff"};
  border: 1px solid ${grey[200]};
  &:hover {
    border-color: ${blue[400]};
  }
  // firefox
  &:focus-visible {
    outline: 0;
  }
`
);

export default TextareaAutosize;
