'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', children, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center rounded-xl font-semibold transition-all active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none';
    const variants = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm',
      secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50',
      ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
    };
    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-5 py-2.5 text-sm',
      lg: 'px-6 py-3 text-base',
    };

    return (
      <button
        ref={ref}
        className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
