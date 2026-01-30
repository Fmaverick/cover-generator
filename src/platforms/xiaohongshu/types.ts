import { Template } from '../../types';

export type XhsTemplateId = 'ins' | 'memo' | 'article' | 'book' | 'notes' | 'poster';

export interface XhsConfig {
  template: XhsTemplateId;
  bgColor: string;
  textColor: string;
  highlightColor: string;
  fontSizeScale: number;
  topTag: string;
  author: string;
  date: string;
}

export interface XhsState {
  title: string;
  content: string;
  images: any[];
}
