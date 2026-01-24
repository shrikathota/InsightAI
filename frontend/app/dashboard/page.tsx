"use client";

import ProtectedRoute from '@/components/protected-route';
import AppLayout from '@/components/app-layout';
import { useRouter } from 'next/navigation';
import { useEffect, useState, memo } from 'react';
import axiosInstance from '@/lib/api';
import { Meeting, Task } from '@/lib/types';
import { AIBadge } from '@/components/ui/ai-badge';
import { SkeletonStatCard, SkeletonMeetingRow } from '@/components/ui/skeleton';
import { formatRelativeDate } from '@/lib/utils';
import { StatusBadge } from '@/components/ui/status-badge';

// Memoized StatCard component for performance
const StatCard = memo(({ 
  title, 
  value, 
  icon, 
  gradient, 
  indicator, 
  onClick 
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  gradient: string;
  indicator?: React.ReactNode;
  onClick: () => void;
}) => (
  <div 
    className={`glass rounded-2xl p-6 border border-white/20 
                hover:shadow-2xl hover:scale-[1.02] 
                transition-all duration-300 cursor-pointer
                ${gradient}`}
    onClick={onClick}
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`flex h-14 w-14 items-center justify-center rounded-xl shadow-lg`}>
        {icon}
      </div>
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{title}</span>
    </div>
    <div className="space-y-1">
      <h3 className="text-4xl font-bold tracking-tight">{value}</h3>
      {indicator}
    </div>
  </div>
));

StatCard.displayName = 'StatCard';

export default function DashboardPage() {
  const router = useRouter();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [meetingsRes, tasksRes] = await Promise.all([
          axiosInstance.get('/api/meetings'),
          axiosInstance.get('/api/tasks')
        ]);
        setMeetings(meetingsRes.data);
        setTasks(tasksRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const recentMeetings = meetings.slice(0, 5);
  const pendingTasks = tasks.filter(t => t.status !== 'DONE').slice(0, 5);
  const summariesCount = meetings.filter(m => m.summary).length;

  return (
    <ProtectedRoute>
      <AppLayout>
        {loading ? (
          <div className="space-y-8">
            {/* Skeleton Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <SkeletonStatCard />
              <SkeletonStatCard />
              <SkeletonStatCard />
            </div>

            {/* Skeleton Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass rounded-2xl border border-white/20 overflow-hidden">
                <div className="p-6 border-b border-border/50">
                  <div className="h-6 w-32 rounded bg-muted/50 animate-pulse"></div>
                </div>
                <div className="p-6 space-y-3">
                  <SkeletonMeetingRow />
                  <SkeletonMeetingRow />
                  <SkeletonMeetingRow />
                </div>
              </div>
              <div className="glass rounded-2xl border border-white/20 overflow-hidden">
                <div className="p-6 border-b border-border/50">
                  <div className="h-6 w-32 rounded bg-muted/50 animate-pulse"></div>
                </div>
                <div className="p-6 space-y-3">
                  <SkeletonMeetingRow />
                  <SkeletonMeetingRow />
                  <SkeletonMeetingRow />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Meetings Stat Card */}
              <StatCard
                title="Total"
                value={meetings.length}
                gradient="bg-gradient-to-br from-purple-50/50 to-transparent dark:from-purple-900/10"
                icon={
                  <div className="ai-gradient shadow-primary/20 w-full h-full rounded-xl flex items-center justify-center">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                }
                indicator={
                  meetings.length > 0 ? (
                    <div className="flex items-center gap-1 text-xs text-primary mt-2">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      <span>Active</span>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Meetings</p>
                  )
                }
                onClick={() => router.push('/meetings')}
              />

              {/* AI Summaries Stat Card */}
              <StatCard
                title="AI Generated"
                value={summariesCount}
                gradient="bg-gradient-to-br from-green-50/50 to-transparent dark:from-green-900/10"
                icon={
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 shadow-green-500/20 w-full h-full rounded-xl flex items-center justify-center">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                }
                indicator={
                  summariesCount > 0 ? (
                    <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 mt-2">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L9 9L2 12L9 15L12 22L15 15L22 12L15 9L12 2Z" />
                      </svg>
                      <span>Powered by AI</span>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Summaries</p>
                  )
                }
                onClick={() => router.push('/meetings')}
              />

              {/* Pending Tasks Stat Card */}
              <StatCard
                title="Pending"
                value={pendingTasks.length}
                gradient="bg-gradient-to-br from-orange-50/50 to-transparent dark:from-orange-900/10"
                icon={
                  <div className="bg-gradient-to-br from-orange-500 to-red-600 shadow-orange-500/20 w-full h-full rounded-xl flex items-center justify-center">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                }
                indicator={
                  pendingTasks.length > 0 ? (
                    <div className="flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400 mt-2">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Action needed</span>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Tasks</p>
                  )
                }
                onClick={() => router.push('/tasks')}
              />
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Meetings */}
              <div className="glass rounded-2xl border border-white/20 overflow-hidden">
                <div className="p-6 border-b border-border/50">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Recent Meetings</h3>
                    <button
                      onClick={() => router.push('/meetings')}
                      className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                    >
                      View All →
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  {recentMeetings.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="flex justify-center mb-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                          <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-4">No meetings yet</p>
                      <button
                        onClick={() => router.push('/meetings')}
                        className="px-4 py-2 ai-gradient text-white rounded-lg 
                                   hover:shadow-lg hover:scale-105 active:scale-95
                                   transition-all duration-200"
                      >
                        Create Your First Meeting
                      </button>
                    </div>
                  ) : (
                    <ul className="space-y-3">
                      {recentMeetings.map((meeting) => (
                        <li key={meeting.id}>
                          <button
                            onClick={() => router.push(`/meetings/${meeting.id}`)}
                            className="w-full text-left p-4 rounded-xl border border-border/50
                                       hover:bg-accent hover:shadow-md hover:border-primary/30
                                       transition-all duration-200 group"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold mb-1 group-hover:text-primary transition-colors truncate">
                                  {meeting.title}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {formatRelativeDate(meeting.meetingDateTime)}
                                </p>
                              </div>
                              {meeting.summary ? (
                                <AIBadge variant="success" />
                              ) : (
                                <StatusBadge variant="warning">
                                  Needs Summary
                                </StatusBadge>
                              )}
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Pending Tasks */}
              <div className="glass rounded-2xl border border-white/20 overflow-hidden">
                <div className="p-6 border-b border-border/50">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Pending Tasks</h3>
                    <button
                      onClick={() => router.push('/tasks')}
                      className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                    >
                      View All →
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  {pendingTasks.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="flex justify-center mb-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                          <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-2">No pending tasks</p>
                      <p className="text-sm text-muted-foreground">You're all caught up! 🎉</p>
                    </div>
                  ) : (
                    <ul className="space-y-3">
                      {pendingTasks.map((task) => (
                        <li key={task.id}>
                          <div className="p-4 rounded-xl border border-border/50
                                          hover:bg-accent hover:shadow-md hover:border-primary/30
                                          transition-all duration-200">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold mb-1 truncate">{task.title}</h4>
                                <p className="text-sm text-muted-foreground truncate">{task.meeting.title}</p>
                              </div>
                              <StatusBadge variant={task.status === 'TODO' ? 'pending' : 'info'}>
                                {task.status === 'TODO' ? 'To Do' : 'In Progress'}
                              </StatusBadge>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </AppLayout>
    </ProtectedRoute>
  );
}
