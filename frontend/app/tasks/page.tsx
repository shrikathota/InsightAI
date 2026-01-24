"use client";

import ProtectedRoute from '@/components/protected-route';
import AppLayout from '@/components/app-layout';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axiosInstance from '@/lib/api';
import { Task } from '@/lib/types';
import { SkeletonTaskCard } from '@/components/ui/skeleton';

export default function TasksPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axiosInstance.get('/api/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId: number, newStatus: string) => {
    try {
      await axiosInstance.put(`/api/tasks/${taskId}`, { status: newStatus });
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus as any } : task
      ));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const todoTasks = tasks.filter(t => t.status === 'TODO');
  const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS');
  const doneTasks = tasks.filter(t => t.status === 'DONE');

  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-2xl font-bold mb-1">Tasks</h2>
            <p className="text-muted-foreground">
              Action items extracted from meeting summaries
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass rounded-2xl border-2 border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/20 overflow-hidden">
                <div className="p-6 border-b border-border/50">
                  <div className="h-6 w-24 rounded bg-muted/50 animate-pulse"></div>
                </div>
                <div className="p-4 space-y-3">
                  <SkeletonTaskCard />
                  <SkeletonTaskCard />
                  <SkeletonTaskCard />
                </div>
              </div>
              <div className="glass rounded-2xl border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 overflow-hidden">
                <div className="p-6 border-b border-border/50">
                  <div className="h-6 w-32 rounded bg-muted/50 animate-pulse"></div>
                </div>
                <div className="p-4 space-y-3">
                  <SkeletonTaskCard />
                  <SkeletonTaskCard />
                </div>
              </div>
              <div className="glass rounded-2xl border-2 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 overflow-hidden">
                <div className="p-6 border-b border-border/50">
                  <div className="h-6 w-20 rounded bg-muted/50 animate-pulse"></div>
                </div>
                <div className="p-4 space-y-3">
                  <SkeletonTaskCard />
                </div>
              </div>
            </div>
          ) : tasks.length === 0 ? (
            <div className="glass rounded-2xl border border-white/20 p-12 text-center">
              <div className="flex justify-center mb-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl ai-gradient">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">No tasks yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Tasks will automatically appear here when you generate AI summaries for your meetings
              </p>
              <button
                onClick={() => router.push('/meetings')}
                className="px-6 py-3 ai-gradient text-white rounded-xl 
                           hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]
                           transition-all duration-200 font-semibold inline-flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Go to Meetings
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <TaskColumn
                title="To Do"
                tasks={todoTasks}
                status="TODO"
                onStatusChange={handleStatusChange}
                router={router}
                color="gray"
              />
              <TaskColumn
                title="In Progress"
                tasks={inProgressTasks}
                status="IN_PROGRESS"
                onStatusChange={handleStatusChange}
                router={router}
                color="blue"
              />
              <TaskColumn
                title="Done"
                tasks={doneTasks}
                status="DONE"
                onStatusChange={handleStatusChange}
                router={router}
                color="green"
              />
            </div>
          )}
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}

function TaskColumn({ 
  title, 
  tasks, 
  status, 
  onStatusChange,
  router,
  color
}: { 
  title: string; 
  tasks: Task[]; 
  status: string;
  onStatusChange: (taskId: number, newStatus: string) => void;
  router: any;
  color: 'gray' | 'blue' | 'green';
}) {
  const colorStyles = {
    gray: {
      bg: 'bg-gray-50 dark:bg-gray-900/20',
      border: 'border-gray-200 dark:border-gray-800',
      badge: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
      icon: 'text-gray-600 dark:text-gray-400'
    },
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      badge: 'bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300',
      icon: 'text-blue-600 dark:text-blue-400'
    },
    green: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      badge: 'bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300',
      icon: 'text-green-600 dark:text-green-400'
    }
  };

  const styles = colorStyles[color];

  return (
    <div className={`glass rounded-2xl border-2 ${styles.border} ${styles.bg} overflow-hidden
                     hover:shadow-xl transition-all duration-300`}>
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg">{title}</h3>
          <span className={`px-3 py-1.5 text-sm ${styles.badge} rounded-full font-semibold`}>
            {tasks.length}
          </span>
        </div>
      </div>

      <div className="p-4 space-y-3 min-h-[400px]">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${styles.badge} mb-4`}>
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm text-muted-foreground font-medium">
              {status === 'TODO' && 'No tasks to do'}
              {status === 'IN_PROGRESS' && 'No tasks in progress'}
              {status === 'DONE' && 'No completed tasks'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {status === 'TODO' && 'New tasks will appear here'}
              {status === 'IN_PROGRESS' && 'Start working on a task'}
              {status === 'DONE' && 'Completed tasks will show here'}
            </p>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="bg-card border-l-4 border-t border-r border-b border-border rounded-xl p-5 
                         shadow-sm hover:shadow-xl hover:scale-[1.02] hover:border-primary/30
                         transition-all duration-300 group relative overflow-hidden
                         border-l-primary"
              style={{
                borderLeftColor: status === 'TODO' ? '#9ca3af' : status === 'IN_PROGRESS' ? '#3b82f6' : '#10b981'
              }}
            >
              {/* Drag handle indicator */}
              <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-30 transition-opacity">
                <svg className="w-4 h-4 text-muted-foreground" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 3h2v2H9V3zm0 4h2v2H9V7zm0 4h2v2H9v-2zm0 4h2v2H9v-2zm0 4h2v2H9v-2zm4-16h2v2h-2V3zm0 4h2v2h-2V7zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2z"/>
                </svg>
              </div>

              <div className="flex items-start gap-3 mb-3 pl-4">
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${styles.badge} flex-shrink-0
                                 group-hover:scale-110 transition-transform duration-300`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h4 className="font-semibold flex-1 leading-snug group-hover:text-primary transition-colors">
                  {task.title}
                </h4>
              </div>

              <div className="pl-4 space-y-3">
                <button
                  onClick={() => router.push(`/meetings/${task.meeting.id}`)}
                  className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="truncate">{task.meeting.title}</span>
                </button>

                {task.assignedTo && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {/* User avatar placeholder */}
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-[10px]">
                      {task.assignedTo.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                    <span className="truncate">{task.assignedTo.fullName}</span>
                  </div>
                )}

                <select
                  value={task.status}
                  onChange={(e) => onStatusChange(task.id, e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border-2 border-border rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent 
                             transition-all bg-background font-medium cursor-pointer 
                             hover:border-primary hover:shadow-md active:scale-[0.98]"
                >
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="DONE">Done</option>
                </select>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
