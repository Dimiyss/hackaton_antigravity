import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
export * from './Typewriter';

import { motion } from 'framer-motion';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'outline' | 'ghost';
    fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', fullWidth, ...props }, ref) => {
        const variants = {
            primary: 'bg-neon-green text-black hover:bg-white hover:shadow-[0_0_15px_rgba(0,255,148,0.5)] border-transparent',
            outline: 'bg-transparent border border-white/20 text-white hover:border-neon-green hover:text-neon-green',
            ghost: 'bg-transparent text-gray-400 hover:text-white',
        };

        return (
            <button
                ref={ref}
                className={cn(
                    'inline-flex items-center justify-center rounded-xl px-6 py-3 font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
                    variants[variant],
                    fullWidth && 'w-full',
                    className
                )}
                {...props}
            />
        );
    }
);
Button.displayName = 'Button';

// Card Component
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    active?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, active, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    'rounded-2xl border bg-card-bg p-4 transition-all duration-200 cursor-pointer',
                    active
                        ? 'neon-border text-white'
                        : 'border-white/10 text-gray-300 hover:border-white/30',
                    className
                )}
                {...props}
            />
        );
    }
);
Card.displayName = 'Card';

// ProgressBar Component
export const ProgressBar = ({ progress }: { progress: number }) => {
    return (
        <div className="fixed top-0 left-0 right-0 h-1 bg-white/10 z-50">
            <motion.div
                className="h-full bg-neon-green shadow-[0_0_10px_rgba(0,255,148,0.6)]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
            />
        </div>
    );
};
