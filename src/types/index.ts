// 平台基础类型
export interface PlatformConfig {
  id: string;
  name: string;
  aspectRatio: number;
  outputSize: {
    width: number;
    height: number;
  };
}

// 图片类型
export interface ImageObject {
  id: string;
  src: HTMLImageElement;
  name: string;
  zoom: number;
  offset: {
    x: number;
    y: number;
  };
}

// 通用页面数据
export interface PageData {
  type: 'cover' | 'content' | 'mixed';
  pageIndex?: number;
  bgImage?: ImageObject | null;
  titleLines?: LineData[];
  lines?: LineData[];
  title?: string;
}

// 文本行数据
export interface LineData {
  tokens: TokenData[];
  width?: number;
  isEmpty?: boolean;
}

// Token 数据
export interface TokenData {
  char: string;
  highlight: boolean;
  width: number;
}

// 模板类型
export interface Template {
  id: string;
  name: string;
  desc: string;
}

// 字体选项
export interface FontOption {
  id: string;
  label: string;
  family: string;
}
