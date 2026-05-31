declare global {
  interface Window {
    showDirectoryPicker?: () => Promise<FileSystemDirectoryHandle>;
  }
  interface DataTransferItem {
    getAsFileSystemHandle?: () => Promise<FileSystemHandle | null>;
  }
  interface FileSystemDirectoryHandle {
    requestPermission?: (option?: {
      mode: "read" | "readwrite";
    }) => Promise<void>;
  }
}

export {};
