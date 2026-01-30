/**
 * 统一的图标组件库
 * 基于 lucide-react
 */

// 重新导出所有 lucide-react 图标
export * from 'lucide-react';

// 或者按需导入常用图标
export {
  Upload,
  Download,
  Plus,
  X,
  Sun,
  Moon,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Target,
  Type,
  Info,
  Layers,
  MoveVertical,
  Loader2,
  Archive,
  Image as ImageIcon,
  Trash,
} from 'lucide-react';

/**
 * 图标包装器 - 统一样式
 */
export function Icon({ width = 20, height = 20, className = '', ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    />
  );
}
