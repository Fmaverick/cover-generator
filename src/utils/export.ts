import JSZip from 'jszip';
import { saveAs } from 'file-saver';

/**
 * 导出工具函数
 */

/**
 * 批量导出为 ZIP
 */
export async function exportAsZip(
  items: { blob: Blob; filename: string }[],
  zipFilename: string
): Promise<void> {
  const zip = new JSZip();
  const folder = zip.folder('covers');

  if (!folder) throw new Error('Failed to create folder');

  items.forEach(({ blob, filename }) => {
    folder.file(filename, blob);
  });

  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, zipFilename);
}

/**
 * 批量导出图片为 ZIP
 */
export async function exportImagesAsZip(
  images: Blob[],
  zipFilename: string,
  prefix: string = 'cover'
): Promise<void> {
  const items = images.map((blob, index) => ({
    blob,
    filename: `${prefix}_${index + 1}.jpg`,
  }));
  await exportAsZip(items, zipFilename);
}

/**
 * 导出单个图片
 */
export function exportSingleImage(blob: Blob, filename: string): void {
  saveAs(blob, filename);
}
