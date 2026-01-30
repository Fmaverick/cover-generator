import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

/**
 * 统一的按钮组件
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading = false, children, disabled, className = '', ...props }, ref) => {
    const baseStyle = 'font-bold transition-all rounded-xl inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      primary: 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-600/20',
      secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
      ghost: 'text-gray-600 hover:bg-gray-50',
      danger: 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };

    return (
      <button
        ref={ref}
        className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            加载中...
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

// Import Loader2 icon
import { Loader2 } from './icons';
