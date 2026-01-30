import { PageData } from '../types';

/**
 * 平台基类 - 所有平台模块需要继承此类
 */
export abstract class PlatformBase {
  /**
   * 平台唯一标识
   */
  abstract id: string;

  /**
   * 平台显示名称
   */
  abstract name: string;

  /**
   * 画幅比例 (width / height)
   */
  abstract aspectRatio: number;

  /**
   * 输出尺寸
   */
  abstract outputSize: { width: number; height: number };

  /**
   * 获取默认配置
   */
  abstract getDefaultConfig(): Record<string, any>;

  /**
   * 获取初始状态
   */
  abstract getInitialState(): Record<string, any>;

  /**
   * 渲染方法 - 在 Canvas 上绘制
   * @param canvas 目标 Canvas 元素
   * @param data 页面数据
   * @param config 配置
   */
  abstract render(canvas: HTMLCanvasElement, data: PageData, config: Record<string, any>): void;

  /**
   * 验证配置
   * @param _config 配置对象
   */
  validate(_config: Record<string, any>): boolean {
    return true;
  }

  /**
   * 获取默认导出文件名
   * @param pageIndex 页码
   */
  getExportFilename(pageIndex: number = 1): string {
    return `${this.name}_${pageIndex}.png`;
  }
}
