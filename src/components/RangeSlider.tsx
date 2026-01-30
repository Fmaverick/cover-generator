import { InputHTMLAttributes, forwardRef } from 'react';

interface RangeSliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  showValue?: boolean;
  valueDisplay?: string | number;
}

/**
 * 滑块组件
 */
export const RangeSlider = forwardRef<HTMLInputElement, RangeSliderProps>(
  ({ label, showValue = true, valueDisplay, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-bold text-gray-500 uppercase">{label}</label>
            {showValue && (
              <span className="text-xs font-bold text-gray-500">
                {valueDisplay !== undefined ? valueDisplay : props.value}
              </span>
            )}
          </div>
        )}
        <input
          ref={ref}
          type="range"
          className={`w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600 ${className}`}
          {...props}
        />
      </div>
    );
  }
);

RangeSlider.displayName = 'RangeSlider';
