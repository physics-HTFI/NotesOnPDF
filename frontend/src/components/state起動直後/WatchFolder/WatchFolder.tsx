import { Watch } from "@/components/share/Watch";
import { useAtomValue } from "jotai";
import { modelフォルダ } from "../modelフォルダ";
import { mapUseOnChangeWatchFolder } from "./mapUseOnChangeWatchFolder";

export function WatchFolder() {
  const folder = useAtomValue(modelフォルダ.folder.atomValue);
  return <Watch target={folder} useOnChange={mapUseOnChangeWatchFolder} />;
}
