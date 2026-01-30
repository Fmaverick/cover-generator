/**
 * Canvas 工具函数
 */

/**
 * 绘制圆角矩形路径
 */
export function drawRoundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/**
 * 创建指定尺寸的临时 Canvas
 */
export function createTempCanvas(width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

/**
 * 将 Canvas 转换为 Blob
 */
export function canvasToBlob(
  canvas: HTMLCanvasElement,
  quality: number = 0.95
): Promise<Blob> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob!);
    }, 'image/jpeg', quality);
  });
}

/**
 * 将 Canvas 转换为 Data URL
 */
export function canvasToDataURL(
  canvas: HTMLCanvasElement,
  quality: number = 0.95
): string {
  return canvas.toDataURL('image/jpeg', quality);
}

/**
 * 测量文本宽度
 */
export function measureText(
  ctx: CanvasRenderingContext2D,
  text: string,
  font?: string
): number {
  if (font) ctx.font = font;
  return ctx.measureText(text).width;
}
