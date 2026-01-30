import { PageData } from '../../types';
import { xhsConfig } from './config';
import { drawRoundRectPath } from '../../utils/canvas';
import { calculateWrappedLines } from '../../utils/text';

/**
 * 小红书渲染器
 */
export class XhsRenderer {
  private config = xhsConfig;

  /**
   * 绘制 Memo 顶部导航栏
   */
  drawMemoHeader(ctx: CanvasRenderingContext2D, width: number, height: number): number {
    const iconColor = '#EAB308';
    const y = height * 0.06;
    const x = width * 0.06;

    ctx.save();

    // 1. 返回箭头
    ctx.beginPath();
    ctx.lineWidth = 6;
    ctx.strokeStyle = iconColor;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.moveTo(x + 25, y);
    ctx.lineTo(x, y + 25);
    ctx.lineTo(x + 25, y + 50);
    ctx.stroke();

    // 2. "备忘录" 文字
    ctx.font = 'bold 42px "Noto Sans SC", sans-serif';
    ctx.fillStyle = iconColor;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('备忘录', x + 40, y + 25);

    // 3. 右侧图标
    const rx = width - x;

    // 更多 (圆圈 + 三点)
    ctx.beginPath();
    ctx.arc(rx - 25, y + 25, 24, 0, Math.PI * 2);
    ctx.strokeStyle = iconColor;
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = iconColor;
    ctx.beginPath();
    ctx.arc(rx - 38, y + 25, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(rx - 25, y + 25, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(rx - 12, y + 25, 3, 0, Math.PI * 2);
    ctx.fill();

    // 分享 (方框 + 箭头)
    const sx = rx - 100;
    ctx.beginPath();
    ctx.rect(sx - 20, y + 10, 40, 40);
    ctx.strokeStyle = iconColor;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(sx, y + 30);
    ctx.lineTo(sx, y - 10);
    ctx.lineTo(sx - 10, y + 5);
    ctx.moveTo(sx, y - 10);
    ctx.lineTo(sx + 10, y + 5);
    ctx.stroke();

    ctx.restore();
    return y + 100;
  }

  /**
   * 绘制 INS 梦幻光斑背景
   */
  drawInsBackground(ctx: CanvasRenderingContext2D, width: number, height: number) {
    // 1. 基础柔和渐变
    const grd = ctx.createLinearGradient(0, 0, width, height);
    grd.addColorStop(0, '#E0F2FE');
    grd.addColorStop(0.5, '#F0F9FF');
    grd.addColorStop(1, '#DBEAFE');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, width, height);

    // 2. 绘制模糊光斑
    const drawOrb = (x: number, y: number, r: number, color: string) => {
      ctx.save();
      ctx.globalAlpha = 0.4;
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, r);
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    drawOrb(width * 0.2, height * 0.2, 300, '#A5F3FC');
    drawOrb(width * 0.8, height * 0.3, 400, '#E879F9');
    drawOrb(width * 0.5, height * 0.8, 350, '#818CF8');
    drawOrb(width * 0.1, height * 0.9, 250, '#F472B6');

    // 3. 暗角
    const radial = ctx.createRadialGradient(width / 2, height / 2, width * 0.3, width / 2, height / 2, width);
    radial.addColorStop(0, 'rgba(255,255,255,0)');
    radial.addColorStop(1, 'rgba(255,255,255,0.6)');
    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, width, height);
  }

  /**
   * 渲染单个页面
   */
  renderPage(
    canvas: HTMLCanvasElement,
    pageData: PageData,
    options: {
      template: string;
      bgColor: string;
      textColor: string;
      highlightColor: string;
      fontSizeScale: number;
      topTag?: string;
      author?: string;
      date?: string;
    }
  ) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = this.config.outputSize;
    canvas.width = width;
    canvas.height = height;

    const safeMargin = 0.1;
    const marginX = width * safeMargin;
    const marginY = height * safeMargin;
    const safeWidth = width - marginX * 2;
    const safeHeight = height - marginY * 2;

    const fontFamily = options.template === 'book' || options.template === 'article' ? '"Noto Serif SC", serif' : '"Noto Sans SC", sans-serif';

    // 1. 背景处理
    if (options.template === 'ins') {
      this.drawInsBackground(ctx, width, height);
    } else {
      ctx.fillStyle = options.bgColor;
      ctx.fillRect(0, 0, width, height);
    }

    // Memo Header
    let contentStartY = marginY;
    if (options.template === 'memo') {
      contentStartY = this.drawMemoHeader(ctx, width, height);
    }

    // 书本纸纹
    if (options.template === 'book') {
      ctx.save();
      ctx.globalAlpha = 0.08;
      ctx.fillStyle = '#000000';
      for (let i = 0; i < 3000; i++) {
        ctx.beginPath();
        ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // 背景图
    if (pageData.bgImage?.src) {
      ctx.save();
      ctx.globalAlpha = 0.08;
      const img = pageData.bgImage.src;
      const scale = Math.max(width / img.width, height / img.height);
      ctx.drawImage(img, (width - img.width * scale) / 2, (height - img.height * scale) / 2, img.width * scale, img.height * scale);
      ctx.restore();
    }

    ctx.fillStyle = options.textColor;
    ctx.textBaseline = 'top';

    // 2. 渲染不同类型
    if (pageData.type === 'cover' && options.template === 'ins') {
      this.renderInsCover(ctx, width, height, pageData, options);
    } else if (pageData.type === 'cover') {
      this.renderSimpleCover(ctx, width, height, pageData, options, fontFamily, contentStartY, marginY);
    } else if (pageData.type === 'mixed') {
      this.renderMixedPage(ctx, width, height, pageData, options, fontFamily, contentStartY, marginX, marginY);
    } else if (pageData.type === 'content') {
      this.renderContentPage(ctx, width, height, pageData, options, fontFamily, contentStartY, marginX, marginY, safeHeight);
    }
  }

  /**
   * 渲染 INS 封面
   */
  private renderInsCover(ctx: CanvasRenderingContext2D, width: number, height: number, pageData: PageData, options: any) {
    const cardW = width * 0.85;
    const cardH = height * 0.6;
    const cardX = (width - cardW) / 2;
    const cardY = (height - cardH) / 2;

    ctx.save();

    // 卡片阴影
    ctx.shadowColor = 'rgba(0,0,0,0.1)';
    ctx.shadowBlur = 40;
    ctx.shadowOffsetY = 20;

    // 卡片背景
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    drawRoundRectPath(ctx, cardX, cardY, cardW, cardH, 40);
    ctx.fill();

    // 边框
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.stroke();
    ctx.restore();

    // 顶部标签
    ctx.font = `italic 400 ${36 * options.fontSizeScale}px "Georgia", serif`;
    ctx.fillStyle = '#9AA0A6';
    ctx.textAlign = 'right';
    ctx.fillText(`" ${options.topTag}`, cardX + cardW - 60, cardY + 100);

    // 主要引用语
    const quoteSize = 72 * options.fontSizeScale;
    ctx.font = `700 ${quoteSize}px "Noto Serif SC", serif`;
    ctx.fillStyle = '#1F1F1F';
    ctx.textAlign = 'left';

    // 简单折行处理
    const quoteWords = pageData.title?.split('') || [];
    const _line = '"';  // Prefix with underscore - this variable is intentionally unused
    let qX = cardX + 60;
    let qY = cardY + cardH * 0.35;

    const tLines: string[] = [];
    let tempLine = '"';
    for (const char of quoteWords) {
      if (ctx.measureText(tempLine + char).width > cardW - 120) {
        tLines.push(tempLine);
        tempLine = char;
      } else {
        tempLine += char;
      }
    }
    tLines.push(tempLine + '"');

    tLines.forEach((l) => {
      ctx.fillText(l, qX, qY);
      qY += quoteSize * 1.5;
    });

    // 分割线
    ctx.beginPath();
    ctx.strokeStyle = '#F3F4F6';
    ctx.lineWidth = 1;
    ctx.moveTo(cardX + 60, cardY + cardH - 140);
    ctx.lineTo(cardX + cardW - 60, cardY + cardH - 140);
    ctx.stroke();

    // Footer
    const footerY = cardY + cardH - 100;

    // Icon
    ctx.fillStyle = '#1F1F1F';
    drawRoundRectPath(ctx, cardX + 60, footerY, 50, 50, 12);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '30px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✦', cardX + 85, footerY + 28);

    // Site Name
    ctx.font = `400 32px "Noto Serif SC", serif`;
    ctx.fillStyle = '#9CA3AF';
    ctx.textAlign = 'left';
    ctx.fillText('Metasight.cloud', cardX + 130, footerY + 25);

    // Date & Author
    ctx.font = `400 30px "Noto Serif SC", serif`;
    ctx.fillStyle = '#D1D5DB';
    ctx.textAlign = 'right';
    ctx.fillText(`${options.date} by ${options.author}`, cardX + cardW - 60, footerY + 25);

    ctx.textBaseline = 'top';
  }

  /**
   * 渲染简单封面
   */
  private renderSimpleCover(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    pageData: PageData,
    options: any,
    fontFamily: string,
    contentStartY: number,
    marginY: number
  ) {
    const titleSize = (options.template === 'book' ? 120 : 100) * options.fontSizeScale;
    ctx.font = `900 ${titleSize}px ${fontFamily}`;

    let curY = options.template === 'memo' ? contentStartY + 60 : options.template === 'poster' ? height * 0.15 : height * 0.3;

    if (pageData.titleLines) {
      pageData.titleLines.forEach((lineObj) => {
        const lineWidth = lineObj.width || lineObj.tokens.reduce((acc: number, t: any) => acc + t.width, 0);
        let curX = options.template === 'memo' ? width * 0.1 : (width - lineWidth) / 2;

        lineObj.tokens.forEach((token: any) => {
          const fontWeight = options.template === 'memo' ? '700' : '900';
          ctx.font = `${fontWeight} ${titleSize}px ${fontFamily}`;

          if (token.highlight && options.template === 'memo') {
            ctx.save();
            ctx.fillStyle = options.highlightColor;
            ctx.fillRect(curX, curY, token.width, titleSize * 1.1);
            ctx.restore();
            ctx.fillStyle = '#000000';
          } else {
            ctx.fillStyle = token.highlight ? options.highlightColor : options.textColor;
          }

          ctx.fillText(token.char, curX, curY);
          curX += token.width;
        });

        curY += titleSize * 1.3;
      });
    }

    if (options.template !== 'memo') {
      ctx.font = `500 ${40 * options.fontSizeScale}px ${fontFamily}`;
      ctx.fillStyle = options.highlightColor;
      ctx.textAlign = 'center';
      ctx.fillText('--- 左滑查看更多 ---', width / 2, height - marginY - 100);
    }
  }

  /**
   * 渲染混合页 (Article/Memo 首页: 标题 + 正文)
   */
  private renderMixedPage(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    pageData: PageData,
    options: any,
    fontFamily: string,
    contentStartY: number,
    marginX: number,
    marginY: number
  ) {
    const titleSize = 100 * options.fontSizeScale;
    let curY = options.template === 'memo' ? contentStartY + 40 : marginY;

    ctx.textAlign = 'left';

    // 标题
    if (pageData.titleLines) {
      pageData.titleLines.forEach((lineObj) => {
        let curX = marginX;
        lineObj.tokens.forEach((token: any) => {
          const fontWeight = options.template === 'memo' ? '700' : '900';
          ctx.font = `${fontWeight} ${titleSize}px ${fontFamily}`;

          if (token.highlight && options.template === 'memo') {
            ctx.save();
            ctx.fillStyle = options.highlightColor;
            ctx.fillRect(curX, curY, token.width, titleSize * 1.1);
            ctx.restore();
            ctx.fillStyle = '#000000';
          } else {
            ctx.fillStyle = options.textColor;
          }

          ctx.fillText(token.char, curX, curY);
          curX += token.width;
        });
        curY += titleSize * 1.3;
      });
    }

    curY += 60;

    // 正文
    const bodySize = 42 * options.fontSizeScale;
    const lineHeight = bodySize * (options.template === 'memo' ? 1.8 : 1.6);

    if (pageData.lines) {
      pageData.lines.forEach((line) => {
        if (line.isEmpty) {
          curY += lineHeight * 0.5;
          return;
        }
        let curX = marginX;
        line.tokens.forEach((token: any) => {
          const fontWeight = options.template === 'memo' ? '400' : (token.highlight ? '900' : '500');
          ctx.font = `${fontWeight} ${bodySize}px ${fontFamily}`;

          if (token.highlight && options.template === 'memo') {
            ctx.save();
            ctx.fillStyle = options.highlightColor;
            ctx.fillRect(curX, curY + 5, token.width, bodySize * 1.0);
            ctx.restore();
            ctx.fillStyle = '#000000';
          } else {
            ctx.fillStyle = token.highlight ? options.highlightColor : options.textColor;
          }

          ctx.fillText(token.char, curX, curY);
          curX += token.width;
        });
        curY += lineHeight;
      });
    }

    // 页码
    ctx.font = `400 32px ${fontFamily}`;
    ctx.fillStyle = '#999999';
    ctx.textAlign = 'center';
    ctx.fillText(`- ${pageData.pageIndex} / -`, width / 2, height - marginY + 20);
  }

  /**
   * 渲染内容页
   */
  private renderContentPage(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    pageData: PageData,
    options: any,
    fontFamily: string,
    contentStartY: number,
    marginX: number,
    marginY: number,
    safeHeight: number
  ) {
    const bodySize = (options.template === 'book' ? 48 : 42) * options.fontSizeScale;
    const lineHeight = bodySize * (options.template === 'book' ? 1.8 : 1.6);
    let curY = options.template === 'memo' ? contentStartY + 40 : marginY;

    ctx.textAlign = 'left';

    if (pageData.lines) {
      pageData.lines.forEach((line) => {
        if (line.isEmpty) {
          curY += bodySize * 0.8;
          return;
        }
        let curX = marginX;
        line.tokens.forEach((token: any) => {
          const fontWeight = options.template === 'memo' ? '400' : (token.highlight ? '900' : '500');
          ctx.font = `${fontWeight} ${bodySize}px ${fontFamily}`;

          if (token.highlight && options.template === 'memo') {
            ctx.save();
            ctx.fillStyle = options.highlightColor;
            ctx.fillRect(curX, curY, token.width, bodySize * 1.1);
            ctx.restore();
            ctx.fillStyle = '#000000';
          } else {
            ctx.fillStyle = token.highlight ? options.highlightColor : options.textColor;
          }

          ctx.fillText(token.char, curX, curY);
          curX += token.width;
        });
        curY += lineHeight;
      });
    }

    // 页码
    ctx.font = `400 32px ${fontFamily}`;
    ctx.fillStyle = '#999999';
    ctx.textAlign = 'center';
    ctx.fillText(`- ${pageData.pageIndex} / -`, width / 2, height - marginY + 20);
  }

  /**
   * 计算分页
   */
  calculatePages(title: string, content: string, options: { template: string; fontSizeScale: number }, images: any[]): PageData[] {
    const pages: PageData[] = [];

    // 创建临时 canvas 用于测量
    const tempCanvas = document.createElement('canvas');
    const ctx = tempCanvas.getContext('2d');
    if (!ctx) return pages;

    const { width, height } = this.config.outputSize;
    const safeMargin = 0.1;
    const marginX = width * safeMargin;
    const marginY = height * safeMargin;
    const safeWidth = width - marginX * 2;
    const safeHeight = height - marginY * 2;

    const fontFamily = options.template === 'book' || options.template === 'article' ? '"Noto Serif SC", serif' : '"Noto Sans SC", sans-serif';
    const baseBodySize = (options.template === 'book' ? 48 : 42) * options.fontSizeScale;
    const lineHeight = baseBodySize * (options.template === 'book' ? 1.8 : 1.6);

    // 1. 预计算标题
    const titleSize = (options.template === 'book' ? 120 : 100) * options.fontSizeScale;
    const titleLines = calculateWrappedLines(ctx, title, safeWidth, titleSize, fontFamily, true);

    // 2. 计算所有正文行
    const allLines = calculateWrappedLines(ctx, content, safeWidth, baseBodySize, fontFamily);

    let remainingLines = [...allLines];

    if (options.template === 'article' || options.template === 'memo') {
      // 首页 = 标题 + 正文
      const titleHeight = titleLines.length * (titleSize * 1.3) + 60;
      let firstPageBodyHeight = safeHeight - titleHeight;

      if (options.template === 'memo') {
        firstPageBodyHeight -= 100;
      }

      let firstPageLines: any[] = [];
      let currentH = 0;

      while (remainingLines.length > 0) {
        const line = remainingLines[0];
        const h = line.isEmpty ? lineHeight * 0.5 : lineHeight;
        if (currentH + h > firstPageBodyHeight) break;
        firstPageLines.push(remainingLines.shift()!);
        currentH += h;
      }

      pages.push({
        type: 'mixed',
        titleLines,
        lines: firstPageLines,
        pageIndex: 1,
        bgImage: images[0] || null,
      });
    } else if (options.template === 'poster') {
      pages.push({ type: 'cover', titleLines, bgImage: images[0] || null });
      return pages;
    } else {
      // Book / Notes / INS: 首页纯封面
      pages.push({
        type: 'cover',
        titleLines,
        title: options.template === 'ins' ? title : undefined,
        bgImage: images[0] || null,
      });
    }

    // 处理剩余正文
    let currentPageLines: any[] = [];
    let currentY = 0;

    while (remainingLines.length > 0) {
      const line = remainingLines.shift()!;
      const h = line.isEmpty ? lineHeight * 0.5 : lineHeight;

      if (currentY + h > safeHeight - 100) {
        pages.push({
          type: 'content',
          lines: currentPageLines,
          pageIndex: pages.length + 1,
          bgImage: images.length > 0 ? images[(pages.length) % images.length] : null,
        });
        currentPageLines = [];
        currentY = 0;
      }

      currentPageLines.push(line);
      currentY += h;
    }

    if (currentPageLines.length > 0) {
      pages.push({
        type: 'content',
        lines: currentPageLines,
        pageIndex: pages.length + 1,
        bgImage: images.length > 0 ? images[(pages.length) % images.length] : null,
      });
    }

    return pages;
  }
}

// 单例导出
export const xhsRenderer = new XhsRenderer();
