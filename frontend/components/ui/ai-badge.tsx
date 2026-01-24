import React from 'react';

interface AIBadgeProps {
  variant?: 'success' | 'pending';
  className?: string;
}

export function AIBadge({ variant = 'success', className = '' }: AIBadgeProps) {
  const styles = {
    success: 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800',
    pending: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800'
  };
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${styles[variant]} ${className}`}>
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L9 9L2 12L9 15L12 22L15 15L22 12L15 9L12 2Z" />
      </svg>
      {variant === 'success' ? 'AI Generated' : 'Generate Summary'}
    </span>
  );
}
