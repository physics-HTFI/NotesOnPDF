import { Watch } from "@/components/share/Watch";
import { useAtomValue } from "jotai";
import { modelフォルダ } from "../modelフォルダ";

export function WatchFolder() {
  const folder = useAtomValue(modelフォルダ.folder.atomValue);
  const useOnChange = modelフォルダ.folder.useOnChange;
  return <Watch target={folder} useOnChange={useOnChange} />;
}
