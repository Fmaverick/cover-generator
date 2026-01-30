import { PlatformConfig, Template } from '../../types';

/**
 * 小红书平台配置
 */
export const xhsConfig: PlatformConfig = {
  id: 'xiaohongshu',
  name: '小红书图文',
  aspectRatio: 9 / 16,
  outputSize: {
    width: 1080,
    height: 1920,
  },
};

/**
 * 模板列表
 */
export const xhsTemplates: Template[] = [
  { id: 'ins', name: 'INS 风语录', desc: '梦幻光斑，半透明卡片' },
  { id: 'memo', name: '备忘录', desc: '仿iOS风格，黄色高亮' },
  { id: 'article', name: '深度好文', desc: '封面含正文，左对齐，适合长文' },
  { id: 'book', name: '古籍书页', desc: '宋体排版，自动分页，居中标题' },
  { id: 'notes', name: '纯净笔记', desc: '极简风格，重点突出' },
  { id: 'poster', name: '封面海报', desc: '单页模式，适合标题' },
];

/**
 * 默认配置
 */
export const xhsDefaultConfig = {
  template: 'article' as const,
  bgColor: '#FFFFFF',
  textColor: '#000000',
  highlightColor: '#D32F2F',
  fontSizeScale: 1,
  topTag: '" AI Vibe coding 想创业',
  author: 'Francis',
  date: new Date().toISOString().split('T')[0],
};

/**
 * 模板配色预设
 */
export const templateColorPresets: Record<string, { bgColor: string; textColor: string; highlightColor: string }> = {
  book: { bgColor: '#F9F7F1', textColor: '#2C2C2C', highlightColor: '#8B0000' },
  notes: { bgColor: '#FFFFFF', textColor: '#333333', highlightColor: '#FF2442' },
  poster: { bgColor: '#F5F5F5', textColor: '#000000', highlightColor: '#FF0000' },
  article: { bgColor: '#FFFFFF', textColor: '#000000', highlightColor: '#D32F2F' },
  memo: { bgColor: '#FFFFFF', textColor: '#000000', highlightColor: '#FDE047' },
  ins: { bgColor: '#FFFFFF', textColor: '#1F1F1F', highlightColor: '#000000' },
};

/**
 * 默认状态
 */
export const xhsDefaultState = {
  title: '经历过异常体验的女性怎样\n知道自己的心理健康和\n神经系统到底有多偏离？',
  content: `这是一个非常深刻且具有实操性的问题。对于经历过"[异常体验]"（如政治迫害、大规模网暴、冤假错案、系统性背叛）的高智商女性来说，常规的心理健康标准已经失效了。

你的神经系统为了在极端环境中生存，已经进行了"[军事化重组]"。你不能用"和平年代"的标准来衡量一个刚从"战场"归来的人。

以下是如何科学评估自身状态、寻找同类以及重建生产力的三部曲：

一、评估偏差：如何量化你的"[精神弹道]"偏离度

不要依赖主观感受（因为你的感受可能已经解离），也不要完全依赖普通心理医生的量表。你需要关注生物指标和认知功能。

1. 监测"[自主神经系统]"的生理底噪
高智商人群擅长用理智压抑痛苦，但身体不会撒谎。`,
  images: [] as any[],
};
