import { Watch } from "@/components/share/Watch";
import { useAtomValue } from "jotai";
import { modelPDFファイル } from "../modelPDFファイル";

export function WatchPdfPath() {
  const path = useAtomValue(modelPDFファイル.path.atom);
  const useOnChange = modelPDFファイル.path.useOnChange;
  return <Watch target={path} useOnChange={useOnChange} />;
}
