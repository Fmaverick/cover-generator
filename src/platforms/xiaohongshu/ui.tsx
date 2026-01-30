import { useCallback, useEffect, useRef, useState } from 'react';
import { xhsConfig, xhsTemplates, xhsDefaultConfig, templateColorPresets } from './config';
import { xhsRenderer } from './renderer';
import { PageData } from '../../types';
import { Button } from '../../components/Button';
import { Textarea } from '../../components/Input';
import { ColorPicker } from '../../components/ColorPicker';
import { RangeSlider } from '../../components/RangeSlider';
import { Download, Trash, Loader2 } from '../../components/icons';
import { loadImagesFromFiles } from '../../utils/file';
import { exportImagesAsZip } from '../../utils/export';

type XhsTemplateId = 'ins' | 'memo' | 'article' | 'book' | 'notes' | 'poster';

/**
 * 小红书平台 UI 组件
 */
export function XhsPlatform() {
  const [title, setTitle] = useState('小红书封面标题');
  const [content, setContent] = useState('这是正文内容。支持[高亮标记]语法，可以突出重点内容。\n\n第二段内容会继续显示在后续页面中。[自动分页]功能会智能切分长文本。');
  const [config, setConfig] = useState(xhsDefaultConfig);
  const [images, setImages] = useState<any[]>([]);
  const [pagesData, setPagesData] = useState<PageData[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const renderTimeoutRef = useRef<number | null>(null);

  // 更新配色方案 (使用 useRef 避免无限循环)
  const isInitializedRef = useRef(false);
  useEffect(() => {
    if (!isInitializedRef.current) {
      const preset = templateColorPresets[config.template];
      if (preset) {
        setConfig((prev) => ({
          ...prev,
          bgColor: preset.bgColor,
          textColor: preset.textColor,
          highlightColor: preset.highlightColor,
        }));
      }
      isInitializedRef.current = true;
    }
  }, [config.template]);

  // 优化的 canvas ref 回调
  const setCanvasRef = useCallback((el: HTMLCanvasElement | null, index: number) => {
    canvasRefs.current[index] = el;
  }, []);

  // 渲染单个页面到 canvas
  const renderPageToCanvas = useCallback((page: PageData, index: number) => {
    const canvas = canvasRefs.current[index];
    if (canvas) {
      xhsRenderer.renderPage(canvas, page, config);
    }
  }, [config]);

  // 计算分页
  useEffect(() => {
    const pages = xhsRenderer.calculatePages(title, content, config, images);
    // 限制预览页面数量，避免生成过多
    setPagesData(pages.slice(0, 10));

    // 清除之前的定时器
    if (renderTimeoutRef.current) {
      clearTimeout(renderTimeoutRef.current);
    }

    // 延迟渲染，避免重复渲染
    renderTimeoutRef.current = setTimeout(() => {
      pages.forEach((page, index) => {
        renderPageToCanvas(page, index);
      });
    });

    // 清理函数
    return () => {
      if (renderTimeoutRef.current) {
        clearTimeout(renderTimeoutRef.current);
      }
    };
  }, [title, content, config.template, config.fontSizeScale, images, renderPageToCanvas]);

  // 文件上传
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const uploaded = await loadImagesFromFiles(files);
    setImages((prev) => [...prev, ...uploaded]);
  };

  // 移除图片
  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  // 批量下载
  const handleBatchDownload = async () => {
    if (pagesData.length === 0) return;
    setIsGenerating(true);

    try {
      const blobs: Blob[] = [];
      for (let i = 0; i < pagesData.length; i++) {
        const tempCanvas = document.createElement('canvas');
        xhsRenderer.renderPage(tempCanvas, pagesData[i], config);
        const blob = await new Promise<Blob>((resolve) => tempCanvas.toBlob((b) => resolve(b!), 'image/png'));
        blobs.push(blob);
      }

      await exportImagesAsZip(blobs, 'xhs_posts.zip', 'xhs');
    } catch (err) {
      console.error('Export Error:', err);
      alert('导出失败，请重试');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* 左侧控制面板 */}
      <div className="flex flex-col w-full p-6 space-y-6 overflow-y-auto bg-white border-r border-gray-200 md:w-1/3 scrollbar-hide">
        <div>
          <h1 className="text-2xl font-black text-gray-900">小红书图文生成</h1>
          <p className="text-xs text-gray-500">自动分页 · 风格统一 · 批量导出</p>
        </div>

        {/* 模板选择 */}
        <div className="grid grid-cols-2 gap-2">
          {xhsTemplates.map((t) => (
            <button
              key={t.id}
              onClick={() => setConfig((prev) => ({ ...prev, template: t.id as any }))}
              className={`p-3 border rounded-xl text-left transition-all ${
                config.template === t.id ? 'bg-red-500 text-white ring-2 ring-red-500' : 'hover:bg-red-50 text-gray-600'
              }`}
            >
              <div className="text-sm font-bold">{t.name}</div>
              <div className="text-[10px] opacity-60 truncate">{t.desc}</div>
            </button>
          ))}
        </div>

        {/* 内容输入 */}
        <div className="space-y-4">
          <Textarea
            label="封面标题"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-24"
            placeholder="输入标题..."
          />
          <Textarea
            label="正文内容 (自动分页)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="h-64"
            placeholder="输入长文章..."
          />
          <p className="mt-1 text-[10px] text-gray-400">已生成 {pagesData.length} 页</p>
        </div>

        {/* INS 专属配置 */}
        {/* 暂时隐藏 INS 模板配置
        {config.template === 'ins' && (
          <div className="p-4 space-y-3 bg-gray-50 rounded-xl">
            <input
              type="text"
              value={config.topTag!}
              onChange={(e) => setConfig((prev) => ({ ...prev, topTag: e.target.value }))}
              className="block w-full h-8 px-2 text-sm rounded border"
              placeholder="顶部标签"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={config.author!}
                onChange={(e) => setConfig((prev) => ({ ...prev, author: e.target.value }))}
                className="block w-full h-8 px-2 text-sm rounded border"
                placeholder="作者"
              />
              <input
                type="text"
                value={config.date!}
                onChange={(e) => setConfig((prev) => ({ ...prev, date: e.target.value }))}
                className="block w-full h-8 px-2 text-sm rounded border"
                placeholder="日期"
              />
            </div>
          </div>
        )}
        */}

        {/* 配色调整 */}
        <div className="grid grid-cols-2 gap-2 p-3 bg-gray-50 rounded-lg">
          <ColorPicker label="背景色" value={config.bgColor} onChange={(val) => setConfig((prev) => ({ ...prev, bgColor: val }))} />
          <ColorPicker label="文字色" value={config.textColor} onChange={(val) => setConfig((prev) => ({ ...prev, textColor: val }))} />
          <ColorPicker label="高亮色" value={config.highlightColor} onChange={(val) => setConfig((prev) => ({ ...prev, highlightColor: val }))} />
          <RangeSlider
            label="字号"
            min={0.8}
            max={1.3}
            step={0.1}
            value={config.fontSizeScale}
            onChange={(e) => setConfig((prev) => ({ ...prev, fontSizeScale: Number(e.currentTarget.value) }))}
          />
        </div>

        {/* 图片上传 */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-gray-500">背景图片</label>
          <input type="file" onChange={handleFileUpload} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100" accept="image/*" multiple />
          {images.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {images.map((img) => (
                <div key={img.id} className="relative w-16 h-16 rounded-lg overflow-hidden border-2">
                  <img src={img.src.src} alt="bg" className="object-cover w-full h-full" />
                  <button
                    onClick={() => removeImage(img.id)}
                    className="absolute top-1 right-1 p-1 text-white bg-black/60 rounded-full hover:bg-red-500"
                  >
                    <Trash size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 导出按钮 */}
        <Button onClick={handleBatchDownload} disabled={isGenerating || pagesData.length === 0} className="w-full py-4">
          {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
          {isGenerating ? '生成中...' : `导出全套 (${pagesData.length}张)`}
        </Button>
      </div>

      {/* 右侧预览 */}
      <div className="flex-1 overflow-x-auto bg-gray-100 p-8 flex items-center gap-8 snap-x">
        {pagesData.map((page, idx) => (
          <div key={idx} className="snap-center shrink-0 flex flex-col items-center gap-4">
            <span className="text-sm font-bold text-gray-400">
              {page.type === 'cover' ? '封面' : page.type === 'mixed' ? '封面 (正文)' : `第 ${page.pageIndex} 页`}
            </span>
            <div className="w-[360px] aspect-[9/16] bg-white shadow-2xl rounded-2xl overflow-hidden ring-4 ring-white relative">
              <canvas
                ref={(el) => setCanvasRef(el, idx)}
                width={xhsConfig.outputSize.width}
                height={xhsConfig.outputSize.height}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
