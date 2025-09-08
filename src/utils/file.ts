import JSZip from "jszip";
import { saveAs } from "file-saver";
import { promises as fs } from "fs";
import path from "path";

export async function downloadZipBlob(
  files: {
    name: string;
    blob: Blob;
  }[],
  name?: string
) {
  const zip = new JSZip();

  files.forEach((file) => {
    zip.file(file.name, file.blob);
  });

  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, name ?? "files.zip");
}

export const getFilePath = (relativePath: string) => {
  return path.join(process.cwd(), relativePath);
};

export async function ensureFileExists(
  filePath: string,
  defaultContent: any = { items: [] }
) {
  try {
    await fs.access(filePath);
  } catch {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(
      filePath,
      JSON.stringify(defaultContent, null, 2),
      "utf8"
    );
  }
}

export async function readJsonFile<T>(filePath: string): Promise<T> {
  await ensureFileExists(filePath);
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw) as T;
}

export async function writeJsonFile(
  filePath: string,
  data: any
): Promise<void> {
  const tmp = filePath + ".tmp";
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), "utf8");
  await fs.rename(tmp, filePath);
}
