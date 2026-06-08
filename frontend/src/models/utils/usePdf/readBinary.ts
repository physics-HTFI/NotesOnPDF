export async function readBinaryAsync(
  handle?: FileSystemFileHandle,
): Promise<ArrayBuffer | undefined> {
  if (!handle) return undefined;
  const file = await handle.getFile();
  return readBinaryFromFileAsync(file);
}

export function readBinaryFromFileAsync(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as ArrayBuffer);
    };
    reader.onerror = () => {
      reject(reader.error);
    };
    reader.readAsArrayBuffer(file);
  });
}
