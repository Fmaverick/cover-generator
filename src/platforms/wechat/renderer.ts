import { wechatConfig, wechatFonts } from './config';

/**
 * 公众号渲染器
 */
export class WechatRenderer {
  private config = wechatConfig;

  /**
   * 绘制图片到 Canvas
   */
  drawImageOnCanvas(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    imageObj: any,
    options: {
      titleText?: string;
      subtitleText?: string;
      fontStyle?: string;
      titleSize?: number;
      subtitleSize?: number;
      textColor?: string;
      showShadow?: boolean;
      textYOffset?: number;
      showGrid?: boolean;
    } = {}
  ) {
    const {
      titleText = '',
      subtitleText = '',
      fontStyle = 'round',
      titleSize = 80,
      subtitleSize = 32,
      textColor = '#FFFFFF',
      showShadow = true,
      textYOffset = 0,
      showGrid = true,
    } = options;

    // 1. 背景
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, width, height);

    // 2. 绘制图片
    if (imageObj?.src) {
      const img = imageObj.src;
      const scale = Math.max(width / img.width, height / img.height) * imageObj.zoom;
      const drawWidth = img.width * scale;
      const drawHeight = img.height * scale;

      const centerX = width / 2;
      const centerY = height / 2;

      const drawX = centerX - drawWidth / 2 + imageObj.offset.x;
      const drawY = centerY - drawHeight / 2 + imageObj.offset.y;

      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
    }

    // 3. 绘制文字
    if (titleText || subtitleText) {
      ctx.save();
      ctx.fillStyle = textColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      if (showShadow) {
        ctx.shadowColor = textColor === '#000000' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.7)';
        ctx.shadowBlur = width * 0.02;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = width * 0.002;
      }

      const fontOption = wechatFonts.find((f) => f.id === fontStyle);
      const currentFontFamily = fontOption?.family || 'sans-serif';
      const fontSizeMod = fontStyle === 'strong' ? 1.2 : 1;

      const titleFontStr = `bold ${titleSize * fontSizeMod}px ${currentFontFamily}`;
      const subtitleFontStr = `normal ${subtitleSize * fontSizeMod}px ${currentFontFamily}`;

      const gap = subtitleText ? titleSize * 0.35 : 0;
      const totalTextHeight = (titleText ? titleSize : 0) + gap + (subtitleText ? subtitleSize : 0);

      const centerY = height / 2;
      const centerX = width / 2;
      let currentY = centerY - totalTextHeight / 2 + textYOffset * (width / 500);

      if (titleText) {
        ctx.font = titleFontStr;
        ctx.fillText(titleText, centerX, currentY + titleSize / 2);
        currentY += titleSize + gap;
      }

      if (subtitleText) {
        ctx.font = subtitleFontStr;
        ctx.fillText(subtitleText, centerX, currentY + subtitleSize / 2);
      }

      ctx.restore();
    }

    // 4. 参考线
    if (showGrid) {
      this.drawGuides(ctx, width, height);
    }
  }

  /**
   * 绘制参考线
   */
  private drawGuides(ctx: CanvasRenderingContext2D, width: number, height: number) {
    ctx.save();

    // 三等分线
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width * 0.33, 0);
    ctx.lineTo(width * 0.33, height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(width * 0.66, 0);
    ctx.lineTo(width * 0.66, height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, height * 0.33);
    ctx.lineTo(width, height * 0.33);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, height * 0.66);
    ctx.lineTo(width, height * 0.66);
    ctx.stroke();

    // 1:1 安全区
    const squareSize = height;
    const squareX = (width - squareSize) / 2;

    ctx.strokeStyle = 'rgba(255, 215, 0, 0.6)';
    ctx.setLineDash([15, 15]);
    ctx.strokeRect(squareX, 0, squareSize, squareSize);

    ctx.fillStyle = 'rgba(255, 215, 0, 0.8)';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText('1:1 Safe Zone', squareX + 20, 40);

    ctx.restore();
  }

  /**
   * 导出为 Blob
   */
  exportToBlob(
    imageObj: any,
    options: any = {}
  ): Promise<Blob> {
    return new Promise((resolve) => {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = this.config.outputSize.width;
      tempCanvas.height = this.config.outputSize.height;
      const ctx = tempCanvas.getContext('2d')!;

      this.drawImageOnCanvas(ctx, tempCanvas.width, tempCanvas.height, imageObj, {
        ...options,
        showGrid: false, // 导出时不显示参考线
      });

      tempCanvas.toBlob((blob) => {
        resolve(blob!);
      }, 'image/jpeg', 0.95);
    });
  }
}

// 单例导出
export const wechatRenderer = new WechatRenderer();
