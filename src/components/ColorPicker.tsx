import { forwardRef } from 'react';

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

/**
 * 颜色选择器组件
 */
export const ColorPicker = forwardRef<HTMLInputElement, ColorPickerProps>(
  ({ value, onChange, label }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
            {label}
          </label>
        )}
        <div className="flex items-center gap-2">
          <input
            ref={ref}
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-8 rounded cursor-pointer border-0"
          />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-20 px-2 py-1 text-xs border border-gray-200 rounded uppercase"
            maxLength={7}
          />
        </div>
      </div>
    );
  }
);

ColorPicker.displayName = 'ColorPicker';
