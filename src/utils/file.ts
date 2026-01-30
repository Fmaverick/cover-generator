import { ImageObject } from '../types';

/**
 * 文件处理工具函数
 */

/**
 * 从文件列表加载图片
 */
export function loadImagesFromFiles(files: File[]): Promise<ImageObject[]> {
  return new Promise((resolve) => {
    const imageFiles = files.filter((file) => file.type.startsWith('image/'));
    const images: ImageObject[] = [];
    let processedCount = 0;

    imageFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          images.push({
            id: Math.random().toString(36).substr(2, 9),
            src: img,
            name: file.name,
            zoom: 1,
            offset: { x: 0, y: 0 },
          });
          processedCount++;
          if (processedCount === imageFiles.length) {
            resolve(images);
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  });
}

/**
 * 加载单张图片
 */
export function loadSingleImage(file: File): Promise<ImageObject> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Not an image file'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        resolve({
          id: Math.random().toString(36).substr(2, 9),
          src: img,
          name: file.name,
          zoom: 1,
          offset: { x: 0, y: 0 },
        });
      };
      img.onerror = reject;
      img.src = event.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * 下载文件
 */
export function downloadFile(blob: Blob, filename: string) {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}
