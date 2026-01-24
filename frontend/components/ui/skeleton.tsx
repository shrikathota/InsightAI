import React from 'react';

export function SkeletonStatCard() {
  return (
    <div className="glass rounded-2xl p-6 border border-white/20 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-14 w-14 rounded-xl bg-muted/50"></div>
        <div className="h-3 w-16 rounded bg-muted/50"></div>
      </div>
      <div className="space-y-2">
        <div className="h-10 w-20 rounded bg-muted/50"></div>
        <div className="h-4 w-24 rounded bg-muted/50"></div>
        <div className="h-3 w-20 rounded bg-muted/50 mt-3"></div>
      </div>
    </div>
  );
}

export function SkeletonMeetingCard() {
  return (
    <div className="glass rounded-2xl p-6 border border-white/20 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="h-12 w-12 rounded-xl bg-muted/50"></div>
        <div className="h-6 w-24 rounded-full bg-muted/50"></div>
      </div>
      <div className="space-y-3">
        <div className="h-5 w-3/4 rounded bg-muted/50"></div>
        <div className="h-4 w-full rounded bg-muted/50"></div>
        <div className="flex gap-4 mt-4">
          <div className="h-4 w-24 rounded bg-muted/50"></div>
          <div className="h-4 w-24 rounded bg-muted/50"></div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonMeetingRow() {
  return (
    <div className="p-4 rounded-xl bg-muted/20 animate-pulse">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 rounded bg-muted/50"></div>
          <div className="h-3 w-1/2 rounded bg-muted/50"></div>
        </div>
        <div className="h-6 w-20 rounded-full bg-muted/50"></div>
      </div>
    </div>
  );
}

export function SkeletonTaskCard() {
  return (
    <div className="bg-card border border-border rounded-xl p-5 animate-pulse">
      <div className="flex items-start gap-3 mb-3">
        <div className="h-8 w-8 rounded-lg bg-muted/50"></div>
        <div className="flex-1 h-5 rounded bg-muted/50"></div>
      </div>
      <div className="space-y-3">
        <div className="h-3 w-2/3 rounded bg-muted/50"></div>
        <div className="h-3 w-1/2 rounded bg-muted/50"></div>
        <div className="h-10 w-full rounded-lg bg-muted/50"></div>
      </div>
    </div>
  );
}
