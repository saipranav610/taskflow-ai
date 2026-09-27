import { HTMLAttributes } from 'react';

export function Card({ className = '', ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-2xl bg-paper-card dark:bg-white/[0.04] border border-gray-100 dark:border-white/10 dark:backdrop-blur-md shadow-soft dark:shadow-card transition-theme ${className}`}
      {...rest}
    />
  );
}
