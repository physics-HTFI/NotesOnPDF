import { useEffect, useState } from "react";
import { alertBrowserCannotOpenDirectory } from "../utils/alertBrowserCannotOpenDirectory";

/**
 * @example
 * ```ts
 * const { isDragging } = useDragAndDrop((handle) => { ドロップされたフォルダの処理 });
 * ```
 */
export function useDragAndDrop(
  /** ドロップされたときの処理 */
  onSelect: (handle: FileSystemDirectoryHandle) => void,
) {
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
    };
    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      if (e.relatedTarget) return; // ウィンドウ内でも発火することがあるので無視する
      setIsDragging(false);
    };
    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      void setHandle();

      async function setHandle() {
        for (const item of e.dataTransfer?.items ?? []) {
          if (!item.getAsFileSystemHandle) {
            alertBrowserCannotOpenDirectory();
            return;
          }
          const handle = await item.getAsFileSystemHandle();
          if (!handle) continue;
          if (handle.kind === "directory") {
            onSelect(handle as FileSystemDirectoryHandle);
          }
        }
      }
    };

    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("dragleave", handleDragLeave);
    window.addEventListener("drop", handleDrop);
    return () => {
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("dragleave", handleDragLeave);
      window.removeEventListener("drop", handleDrop);
    };
  }, [onSelect]);

  return { isDragging };
}
