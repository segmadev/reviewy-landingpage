import React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
      primary: 'bg-primary text-white hover:bg-primary-hover shadow-lg shadow-primary/20 hover:-translate-y-0.5',
      secondary: 'bg-white text-gray-700 border border-gray-200 hover:border-primary hover:text-primary',
      outline: 'text-primary border border-primary hover:bg-mint-50',
      ghost: 'text-gray-600 hover:text-primary hover:bg-gray-50',
    };

    const sizes = {
      sm: 'px-3 py-1 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base font-bold rounded-xl',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'font-semibold rounded-lg transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };
