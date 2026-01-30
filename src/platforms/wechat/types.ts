export interface WechatConfig {
  fontStyle: string;
  titleSize: number;
  subtitleSize: number;
  textColor: string;
  showShadow: boolean;
  textYOffset: number;
  showGrid: boolean;
}

export interface WechatState {
  titleText: string;
  subtitleText: string;
  imageList: any[];
  activeId: string | null;
}
