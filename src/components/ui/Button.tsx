import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'bg-cco-primary-600 text-white hover:bg-cco-primary-700 focus-visible:ring-cco-primary-500',
        secondary: 'bg-cco-neutral-200 text-cco-neutral-900 hover:bg-cco-neutral-300 focus-visible:ring-cco-neutral-500',
        accent: 'bg-cco-accent-600 text-white hover:bg-cco-accent-700 focus-visible:ring-cco-accent-500',
        ghost: 'bg-transparent hover:bg-cco-neutral-100 text-cco-neutral-900 hover:text-cco-neutral-900',
        outline: 'bg-transparent border border-cco-neutral-300 hover:bg-cco-neutral-100 text-cco-neutral-900',
        destructive: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
      },
      size: {
        sm: 'h-8 px-3 py-1',
        md: 'h-10 px-4 py-2',
        lg: 'h-12 px-6 py-3',
        icon: 'h-10 w-10',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
  className?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, children, ...props }, ref) => {
    return (
      <button
        className={buttonVariants({ variant, size, fullWidth, className })}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants }; 