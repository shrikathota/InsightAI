"use client";

import ProtectedRoute from '@/components/protected-route';
import AppLayout from '@/components/app-layout';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axiosInstance from '@/lib/api';
import { Meeting } from '@/lib/types';
import { AIBadge } from '@/components/ui/ai-badge';
import { SkeletonMeetingCard } from '@/components/ui/skeleton';
import { formatRelativeDate } from '@/lib/utils';
import { StatusBadge } from '@/components/ui/status-badge';

export default function MeetingsPage() {
  const router = useRouter();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      const response = await axiosInstance.get('/api/meetings');
      setMeetings(response.data);
    } catch (error) {
      console.error('Error fetching meetings:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-1">Meetings</h2>
              <p className="text-muted-foreground">
                Manage your meetings and generate AI summaries
              </p>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-6 py-3 ai-gradient text-white rounded-xl 
                         hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]
                         transition-all duration-200 font-semibold flex items-center gap-2 justify-center"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Meeting
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <SkeletonMeetingCard />
              <SkeletonMeetingCard />
              <SkeletonMeetingCard />
              <SkeletonMeetingCard />
              <SkeletonMeetingCard />
              <SkeletonMeetingCard />
            </div>
          ) : meetings.length === 0 ? (
            <div className="glass rounded-2xl border border-white/20 p-12 text-center">
              <div className="flex justify-center mb-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl ai-gradient">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">No meetings yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Create your first meeting to get started with AI-powered summaries and action item extraction
              </p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-6 py-3 ai-gradient text-white rounded-xl 
                           hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]
                           transition-all duration-200 font-semibold inline-flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Your First Meeting
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {meetings.map((meeting, index) => (
                <div
                  key={meeting.id}
                  onClick={() => router.push(`/meetings/${meeting.id}`)}
                  className={`glass rounded-2xl border border-white/20 p-6 
                             hover:shadow-2xl hover:scale-[1.02] hover:border-primary/30
                             transition-all duration-300 cursor-pointer group
                             relative overflow-hidden
                             animate-fade-in-up stagger-${Math.min(index + 1, 6)}`}
                >
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl ai-gradient 
                                      group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/30
                                      transition-all duration-300">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      {meeting.summary ? (
                        <AIBadge variant="success" />
                      ) : (
                        <StatusBadge variant="default">
                          No Summary
                        </StatusBadge>
                      )}
                    </div>

                    <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {meeting.title}
                    </h3>
                    
                    {meeting.description && (
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {meeting.description}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {formatRelativeDate(meeting.meetingDateTime)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {meeting.createdBy.fullName.split(' ')[0]}
                      </span>
                    </div>

                    {/* View Details hint on hover */}
                    <div className="flex items-center gap-2 text-sm text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span>View Details</span>
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {showCreateForm && (
          <CreateMeetingModal
            onClose={() => setShowCreateForm(false)}
            onSuccess={() => {
              setShowCreateForm(false);
              fetchMeetings();
            }}
          />
        )}
      </AppLayout>
    </ProtectedRoute>
  );
}

function CreateMeetingModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    transcript: '',
    meetingDateTime: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axiosInstance.post('/api/meetings', formData);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create meeting');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="glass rounded-2xl border border-white/20 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="flex justify-between items-center mb-6">
          <h2 id="modal-title" className="text-2xl font-bold">Create New Meeting</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-accent rounded-lg
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-2">
              Title <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 bg-background border border-input rounded-xl 
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent 
                         transition-all"
              placeholder="e.g., Q1 Planning Meeting"
              aria-required="true"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Date & Time <span className="text-destructive">*</span>
            </label>
            <input
              type="datetime-local"
              required
              value={formData.meetingDateTime}
              onChange={(e) => setFormData({ ...formData, meetingDateTime: e.target.value })}
              className="w-full px-4 py-3 bg-background border border-input rounded-xl 
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent 
                         transition-all"
              aria-required="true"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
              rows={3}
              placeholder="Brief description of the meeting"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Transcript
            </label>
            <textarea
              value={formData.transcript}
              onChange={(e) => setFormData({ ...formData, transcript: e.target.value })}
              className="w-full px-4 py-3 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none custom-scrollbar"
              rows={6}
              placeholder="Paste meeting transcript here (optional, can be added later)"
            />
          </div>

          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl flex items-start gap-2">
              <svg className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-border rounded-xl 
                         hover:bg-accent active:scale-[0.98]
                         transition-all duration-200 font-semibold"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 ai-gradient text-white rounded-xl 
                         hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]
                         disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed
                         transition-all duration-200 font-semibold"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Creating...
                </span>
              ) : (
                'Create Meeting'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
