import { Watch } from "@/components/share/Watch";
import { useAtomValue } from "jotai";
import { modelPDFファイル } from "../../modelPDFファイル";
import { mapUseOnChangeWatchPdfPath } from "./mapUseOnChangeWatchPdfInfo";

export function WatchPdfPath() {
  const path = useAtomValue(modelPDFファイル.path.atom);
  return <Watch target={path} useOnChange={mapUseOnChangeWatchPdfPath} />;
}
