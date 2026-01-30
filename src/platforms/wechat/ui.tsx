import { useEffect, useRef, useState } from 'react';
import { wechatConfig, wechatFonts, wechatDefaultConfig } from './config';
import { wechatRenderer } from './renderer';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { ColorPicker } from '../../components/ColorPicker';
import { RangeSlider } from '../../components/RangeSlider';
import { Upload, Download, RotateCcw, Plus, X, MoveVertical, Target, TreePine, Loader2 } from '../../components/icons';
import { loadImagesFromFiles, downloadFile } from '../../utils/file';
import { exportImagesAsZip } from '../../utils/export';
import { ImageObject } from '../../types';

/**
 * 公众号平台 UI 组件
 */
export function WechatPlatform() {
  // 状态
  const [titleText, setTitleText] = useState('');
  const [subtitleText, setSubtitleText] = useState('');
  const [config, setConfig] = useState(wechatDefaultConfig);
  const [imageList, setImageList] = useState<ImageObject[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // 拖拽状态
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeImage = imageList.find((img) => img.id === activeId);

  // 渲染 Canvas
  useEffect(() => {
    if (!activeImage || !canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = wechatConfig.outputSize.width;
    canvas.height = wechatConfig.outputSize.height;

    wechatRenderer.drawImageOnCanvas(ctx, canvas.width, canvas.height, activeImage, {
      titleText,
      subtitleText,
      ...config,
    });
  }, [activeImage, titleText, subtitleText, config]);

  // 文件上传
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const images = await loadImagesFromFiles(files);
    setImageList((prev) => {
      const updated = [...prev, ...images];
      if (prev.length === 0 && images.length > 0) {
        setActiveId(images[0].id);
      }
      return updated;
    });

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // 移除图片
  const removeImage = (e: React.MouseEvent, idToRemove: string) => {
    e.stopPropagation();
    setImageList((prev) => {
      const newList = prev.filter((img) => img.id !== idToRemove);
      if (idToRemove === activeId) {
        setActiveId(newList.length > 0 ? newList[newList.length - 1].id : null);
      }
      return newList;
    });
  };

  // 更新活动图片状态
  const updateActiveImage = (updates: Partial<ImageObject>) => {
    if (!activeId) return;
    setImageList((prev) => prev.map((img) => (img.id === activeId ? { ...img, ...updates } : img)));
  };

  // 拖拽处理
  const handleStart = (clientX: number, clientY: number) => {
    if (!activeImage) return;
    setIsDragging(true);
    setDragStart({ x: clientX - activeImage.offset.x, y: clientY - activeImage.offset.y });
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging || !activeImage) return;
    updateActiveImage({
      offset: {
        x: clientX - dragStart.x,
        y: clientY - dragStart.y,
      },
    });
  };

  // 下载当前图片
  const handleDownloadActive = async () => {
    if (!activeImage) return;

    const blob = await wechatRenderer.exportToBlob(activeImage, {
      titleText,
      subtitleText,
      ...config,
    });

    const namePart = activeImage.name.substring(0, activeImage.name.lastIndexOf('.')) || activeImage.name;
    downloadFile(blob, `${namePart}_cover.jpg`);
  };

  // 批量下载
  const handleBatchDownload = async () => {
    if (imageList.length === 0) return;
    setIsDownloading(true);

    try {
      const blobs: Blob[] = [];
      for (const img of imageList) {
        const blob = await wechatRenderer.exportToBlob(img, {
          titleText,
          subtitleText,
          ...config,
        });
        blobs.push(blob);
      }

      await exportImagesAsZip(blobs, 'wechat_covers.zip', 'wechat');
    } catch (err) {
      console.error('ZIP Error:', err);
      alert('打包下载失败，请重试');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex-1 px-4 py-8 mx-auto max-w-7xl">
      {imageList.length === 0 ? (
        // 空状态
        <div
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center p-12 text-center transition-all border-2 border-gray-300 border-dashed cursor-pointer rounded-3xl hover:border-primary-500 hover:bg-primary-50/50 group min-h-[500px]"
        >
          <div className="p-6 mb-6 transition-all duration-300 bg-white shadow-sm rounded-2xl group-hover:scale-110 group-hover:rotate-3">
            <div className="p-4 bg-primary-100 rounded-xl">
              <Upload className="text-primary-600" size={32} />
            </div>
          </div>
          <h3 className="mb-3 text-2xl font-bold text-gray-900">点击上传图片</h3>
          <p className="max-w-sm text-gray-500">支持多图上传。生成 2.35:1 电影宽画幅。</p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
            multiple
          />
        </div>
      ) : (
        // 编辑界面
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">
          {/* 编辑器列 */}
          <div className="space-y-6 min-w-0">
            <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-3xl">
              {/* 头部 */}
              <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-500 truncate max-w-[200px]">
                  <TreePine size={16} className="shrink-0 text-primary-600" />
                  <span className="font-medium text-gray-700 truncate">{activeImage ? activeImage.name : 'Ready'}</span>
                </div>
                <div className="flex gap-3 shrink-0">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-primary-700 transition-colors bg-primary-50 rounded-lg hover:bg-primary-100"
                  >
                    <Plus size={14} /> 添加图片
                  </button>
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" multiple />
                </div>
              </div>

              {/* 画布预览 */}
              <div className="p-6 bg-gray-50/50">
                <div
                  ref={containerRef}
                  className={`relative w-full max-w-3xl mx-auto bg-gray-200 overflow-hidden shadow-2xl shadow-gray-200/50 ring-4 ring-white rounded-lg ${
                    isDragging ? 'cursor-grabbing' : 'cursor-grab'
                  } touch-none`}
                  style={{ aspectRatio: `${wechatConfig.aspectRatio}` }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleStart(e.clientX, e.clientY);
                  }}
                  onMouseMove={(e) => {
                    e.preventDefault();
                    handleMove(e.clientX, e.clientY);
                  }}
                  onMouseUp={() => setIsDragging(false)}
                  onMouseLeave={() => setIsDragging(false)}
                  onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
                  onTouchMove={(e) => handleMove(e.touches[0].clientX, e.touches[0].clientY)}
                  onTouchEnd={() => setIsDragging(false)}
                >
                  {activeImage ? (
                    <canvas ref={canvasRef} className="block object-contain w-full h-full pointer-events-none" />
                  ) : (
                    <div className="flex flex-col items-center justify-center w-full h-full gap-2 text-gray-400">
                      <TreePine size={48} className="opacity-20" />
                    </div>
                  )}
                </div>
                <p className="flex items-center justify-center gap-1 mt-4 text-xs text-gray-400">
                  <MoveVertical size={12} /> 拖动画面以调整构图
                </p>
              </div>

              {/* 缩放控制 */}
              {activeImage && (
                <div className="grid gap-6 px-6 py-5 bg-white border-t border-gray-100">
                  <div className="space-y-3">
                    <RangeSlider
                      label="Zoom"
                      min={0.5}
                      max={3}
                      step={0.01}
                      value={activeImage.zoom}
                      onChange={(e) => updateActiveImage({ zoom: parseFloat(e.currentTarget.value) })}
                      valueDisplay={`${Math.round(activeImage.zoom * 100)}%`}
                    />
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <button
                      onClick={() => updateActiveImage({ zoom: 1, offset: { x: 0, y: 0 } })}
                      className="p-2.5 rounded-xl text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                      title="重置位置"
                    >
                      <RotateCcw size={16} />
                    </button>
                    <Button onClick={handleDownloadActive}>
                      <Download size={16} /> 下载当前
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* 图片队列 */}
            <div className="p-5 bg-white border border-gray-200 shadow-sm rounded-3xl">
              <h3 className="mb-4 text-xs font-bold tracking-wider text-gray-400 uppercase">图片队列 ({imageList.length})</h3>
              <div className="flex gap-3 pb-2 overflow-x-auto snap-x scrollbar-hide">
                {imageList.map((img) => (
                  <div
                    key={img.id}
                    onClick={() => setActiveId(img.id)}
                    className={`snap-start relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                      activeId === img.id
                        ? 'border-primary-500 ring-4 ring-primary-100 scale-105 shadow-md'
                        : 'border-transparent hover:border-primary-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img.src.src} alt="thumb" className="object-cover w-full h-full" />
                    <button
                      onClick={(e) => removeImage(e, img.id)}
                      className="absolute p-1 text-white transition-colors rounded-full top-1 right-1 bg-black/60 hover:bg-red-500 backdrop-blur-sm"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 设置列 */}
          <div className="space-y-6">
            <div className="sticky p-6 bg-white border border-gray-200 shadow-sm rounded-3xl top-24">
              <div className="flex items-center gap-2 mb-6 text-lg font-bold text-gray-900">
                <div className="p-1.5 bg-primary-100 text-primary-600 rounded-lg">
                  <Target size={18} />
                </div>
                <span>文字排版</span>
              </div>

              <div className="space-y-6">
                {/* 字体风格 */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-gray-400 uppercase">字体风格</span>
                  <div className="grid grid-cols-3 gap-2">
                    {wechatFonts.map((font) => (
                      <button
                        key={font.id}
                        onClick={() => setConfig((prev) => ({ ...prev, fontStyle: font.id }))}
                        className={`px-2 py-2 rounded-lg text-xs transition-all border ${
                          config.fontStyle === font.id
                            ? 'bg-primary-600 border-primary-600 text-white shadow-md shadow-primary-600/20'
                            : 'bg-white border-gray-200 text-gray-600 hover:border-primary-300'
                        }`}
                        style={{ fontFamily: font.family }}
                      >
                        {font.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 颜色和阴影 */}
                <div className="grid grid-cols-2 gap-4">
                  <ColorPicker label="颜色" value={config.textColor!} onChange={(val) => setConfig((prev) => ({ ...prev, textColor: val }))} />
                  <div className="space-y-3">
                    <span className="text-xs font-bold text-gray-400 uppercase">阴影</span>
                    <button
                      onClick={() => setConfig((prev) => ({ ...prev, showShadow: !prev.showShadow }))}
                      className={`w-full py-2.5 rounded-lg text-xs font-bold border transition-colors ${
                        config.showShadow ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-400 hover:border-gray-300'
                      }`}
                    >
                      {config.showShadow ? '开启' : '关闭'}
                    </button>
                  </div>
                </div>

                <hr className="border-gray-100" />

                {/* 主标题 */}
                <div className="space-y-3">
                  <RangeSlider
                    label="主标题"
                    min={40}
                    max={180}
                    value={config.titleSize!}
                    onChange={(e) => setConfig((prev) => ({ ...prev, titleSize: parseInt(e.currentTarget.value) }))}
                    valueDisplay={`${config.titleSize}px`}
                  />
                  <Input
                    placeholder="大标题..."
                    value={titleText}
                    onChange={(e) => setTitleText(e.target.value)}
                  />
                </div>

                {/* 副标题 */}
                <div className="space-y-3">
                  <RangeSlider
                    label="副标题"
                    min={20}
                    max={100}
                    value={config.subtitleSize!}
                    onChange={(e) => setConfig((prev) => ({ ...prev, subtitleSize: parseInt(e.currentTarget.value) }))}
                    valueDisplay={`${config.subtitleSize}px`}
                  />
                  <Input
                    placeholder="副标题..."
                    value={subtitleText}
                    onChange={(e) => setSubtitleText(e.target.value)}
                  />
                </div>

                {/* 垂直位置 */}
                <div className="pt-2 space-y-3">
                  <div className="flex justify-between text-xs font-bold text-gray-400 uppercase">
                    <span>垂直位置</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setConfig((prev) => ({ ...prev, textYOffset: 0 }))}
                      className="p-1.5 text-gray-400 bg-gray-100 rounded-lg hover:bg-primary-100 hover:text-primary-600 transition-colors"
                      title="一键居中"
                    >
                      <Target size={16} />
                    </button>
                    <RangeSlider
                      min={-200}
                      max={200}
                      value={config.textYOffset!}
                      onChange={(e) => setConfig((prev) => ({ ...prev, textYOffset: parseInt(e.currentTarget.value) }))}
                      showValue={false}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 批量下载按钮 */}
      {imageList.length > 0 && (
        <div className="fixed bottom-8 right-8">
          <Button size="lg" onClick={handleBatchDownload} isLoading={isDownloading}>
            {isDownloading ? <Loader2 size={16} className="animate-spin" /> : <Loader2 size={16} />}
            打包下载 ({imageList.length})
          </Button>
        </div>
      )}
    </div>
  );
}
