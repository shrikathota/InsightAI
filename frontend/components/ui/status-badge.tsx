import React from 'react';

export type StatusVariant = 'success' | 'warning' | 'error' | 'info' | 'pending' | 'default';

interface StatusBadgeProps {
  variant?: StatusVariant;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export function StatusBadge({ 
  variant = 'default', 
  children, 
  icon,
  className = '' 
}: StatusBadgeProps) {
  const styles = {
    success: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800',
    warning: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    error: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
    info: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    pending: 'bg-gray-50 dark:bg-gray-900/20 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-800',
    default: 'bg-gray-50 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
  };
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${styles[variant]} ${className}`}>
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  );
}

// Preset status badges for common use cases
export function TodoBadge({ className = '' }: { className?: string }) {
  return (
    <StatusBadge variant="pending" className={className}>
      To Do
    </StatusBadge>
  );
}

export function InProgressBadge({ className = '' }: { className?: string }) {
  return (
    <StatusBadge variant="info" className={className}>
      In Progress
    </StatusBadge>
  );
}

export function DoneBadge({ className = '' }: { className?: string }) {
  return (
    <StatusBadge 
      variant="success" 
      className={className}
      icon={
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      }
    >
      Done
    </StatusBadge>
  );
}

export function NeedsSummaryBadge({ className = '' }: { className?: string }) {
  return (
    <StatusBadge variant="warning" className={className}>
      Needs Summary
    </StatusBadge>
  );
}
