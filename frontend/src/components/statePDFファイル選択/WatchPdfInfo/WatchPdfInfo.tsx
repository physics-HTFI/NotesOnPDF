import { Watch } from "@/components/share/Watch";
import { useAtomValue } from "jotai";
import { modelPDFファイル } from "../modelPDFファイル";

export function WatchPdfInfo() {
  const info = useAtomValue(modelPDFファイル.info.atom);
  const useOnChange = modelPDFファイル.info.useOnChange;
  return <Watch target={info} useOnChange={useOnChange} />;
}
