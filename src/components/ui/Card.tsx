import { HTMLAttributes } from 'react';

export function Card({ className = '', ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-2xl bg-paper-card dark:bg-ink-700 border border-gray-100 dark:border-ink-500 shadow-soft transition-theme ${className}`}
      {...rest}
    />
  );
}
