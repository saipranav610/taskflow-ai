import { HTMLAttributes } from 'react';

export function Card({ className = '', ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-soft transition-theme ${className}`}
      {...rest}
    />
  );
}
