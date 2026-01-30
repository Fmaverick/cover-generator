import { LineData, TokenData } from '../types';

/**
 * 文本处理工具函数
 */

/**
 * 计算文本折行
 * 返回所有折行后的行数据
 */
export function calculateWrappedLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  fontSize: number,
  fontFamily: string,
  isBold: boolean = false
): LineData[] {
  const allLines: LineData[] = [];
  const paragraphs = text.split('\n');

  // 设置字体用于测量
  ctx.font = `${isBold ? '900' : '500'} ${fontSize}px ${fontFamily}`;

  paragraphs.forEach((para) => {
    if (!para.trim()) {
      allLines.push({ tokens: [], width: 0, isEmpty: true });
      return;
    }

    // Token 解析 (支持 [文本] 高亮语法)
    const tokens: { text: string; highlight: boolean }[] = [];
    const regex = /\[(.*?)\]/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(para)) !== null) {
      if (match.index > lastIndex) {
        tokens.push({ text: para.substring(lastIndex, match.index), highlight: false });
      }
      tokens.push({ text: match[1], highlight: true });
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < para.length) {
      tokens.push({ text: para.substring(lastIndex), highlight: false });
    }
    if (tokens.length === 0) {
      tokens.push({ text: para, highlight: false });
    }

    // 逐行计算
    const currentLineTokens: TokenData[] = [];
    let currentLineWidth = 0;

    tokens.forEach((token) => {
      const chars = token.text.split('');
      chars.forEach((char) => {
        ctx.font = `${token.highlight ? '900' : isBold ? '900' : '500'} ${fontSize}px ${fontFamily}`;
        const charWidth = ctx.measureText(char).width;

        if (currentLineWidth + charWidth > maxWidth) {
          allLines.push({ tokens: currentLineTokens, width: currentLineWidth });
          currentLineTokens.length = 0;
          currentLineWidth = 0;
        }

        currentLineTokens.push({ char, highlight: token.highlight, width: charWidth });
        currentLineWidth += charWidth;
      });
    });

    if (currentLineTokens.length > 0) {
      allLines.push({ tokens: currentLineTokens, width: currentLineWidth });
    }
  });

  return allLines;
}

/**
 * 简单折行 (不支持高亮)
 */
export function simpleWrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  font: string
): string[] {
  const lines: string[] = [];
  const paragraphs = text.split('\n');

  ctx.font = font;

  paragraphs.forEach((para) => {
    if (!para.trim()) {
      lines.push('');
      return;
    }

    const chars = para.split('');
    let currentLine = '';
    let currentWidth = 0;

    chars.forEach((char) => {
      const charWidth = ctx.measureText(char).width;

      if (currentWidth + charWidth > maxWidth && currentLine.length > 0) {
        lines.push(currentLine);
        currentLine = char;
        currentWidth = charWidth;
      } else {
        currentLine += char;
        currentWidth += charWidth;
      }
    });

    if (currentLine) {
      lines.push(currentLine);
    }
  });

  return lines;
}
