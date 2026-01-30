import { PlatformConfig, FontOption } from '../../types';

/**
 * 公众号平台配置
 */
export const wechatConfig: PlatformConfig = {
  id: 'wechat',
  name: '公众号封面',
  aspectRatio: 2.35 / 1,
  outputSize: {
    width: 1920,
    height: Math.round(1920 / (2.35 / 1)),
  },
};

/**
 * 字体选项
 */
export const wechatFonts: FontOption[] = [
  { id: 'round', label: '圆润', family: '"Quicksand", "M PLUS Rounded 1c", "Arial Rounded MT Bold", sans-serif' },
  { id: 'modern', label: '现代', family: '"Montserrat", "PingFang SC", sans-serif' },
  { id: 'elegant', label: '优雅', family: '"Playfair Display", serif' },
  { id: 'strong', label: '硬朗', family: '"Bebas Neue", "Impact", sans-serif' },
  { id: 'hand', label: '手写', family: '"Pacifico", cursive' },
  { id: 'serif', label: '宋体', family: '"Noto Serif SC", "Songti SC", serif' },
];

/**
 * 默认配置
 */
export const wechatDefaultConfig = {
  fontStyle: 'round',
  titleSize: 80,
  subtitleSize: 32,
  textColor: '#FFFFFF',
  showShadow: true,
  textYOffset: 0,
  showGrid: true,
};

/**
 * 默认状态
 */
export const wechatDefaultState = {
  titleText: '',
  subtitleText: '',
  imageList: [] as any[],
  activeId: null as string | null,
};
