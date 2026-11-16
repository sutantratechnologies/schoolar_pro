'use client';

import React, { useState } from 'react';
import {
  Bell,
  Clock,
  CheckCircle2,
  Sparkles,
  Check,
  Trash2,
} from 'lucide-react';

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'deadline' | 'match' | 'system' | 'document';
  read: boolean;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'MEXT Japan Physical Submission Deadline in 8 Days',
    description: 'Ensure your completed research plan and medical certificate are delivered to Panipokhari by May 15.',
    time: '2 hours ago',
    type: 'deadline',
    read: false,
  },
  {
    id: 'notif-2',
    title: 'New High-Match Grant: Australia Awards 2026',
    description: 'A 95% academic profile match was identified for Computer Science candidates.',
    time: '1 day ago',
    type: 'match',
    read: false,
  },
  {
    id: 'notif-3',
    title: 'Document Verified: Undergraduate Transcripts',
    description: 'Your Tribhuvan University transcript was successfully indexed and marked as ready for embassy submissions.',
    time: '3 days ago',
    type: 'document',
    read: true,
  },
  {
    id: 'notif-4',
    title: 'Security Notice: New Session Authenticated',
    description: 'Your BidyaGo student account was successfully accessed from Kathmandu, Nepal.',
    time: '5 days ago',
    type: 'system',
    read: true,
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-[#4b37df] uppercase tracking-wider block">
            Updates & Alerts
          </span>
          <h1 className="text-2xl sm:text-3xl font-light text-slate-900 tracking-tight">
            Notifications
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Stay on top of scholarship releases, deadline reminders, and document verifications.
          </p>
        </div>

        <button
          type="button"
          onClick={markAllRead}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors cursor-pointer shrink-0"
        >
          <Check className="w-3.5 h-3.5 text-emerald-600" />
          <span>Mark all as read</span>
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`p-5 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
              notif.read
                ? 'bg-white border-slate-200/80 shadow-2xs text-slate-600'
                : 'bg-purple-50/40 border-purple-200/80 shadow-xs text-slate-900'
            }`}
          >
            <div className="flex items-start gap-3.5 flex-1">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  notif.type === 'deadline'
                    ? 'bg-orange-50 text-orange-600'
                    : notif.type === 'match'
                      ? 'bg-purple-50 text-[#4b37df]'
                      : notif.type === 'document'
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-blue-50 text-blue-600'
                }`}
              >
                {notif.type === 'deadline' ? (
                  <Clock className="w-4 h-4" />
                ) : notif.type === 'match' ? (
                  <Sparkles className="w-4 h-4" />
                ) : notif.type === 'document' ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Bell className="w-4 h-4" />
                )}
              </div>

              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs sm:text-sm font-semibold text-slate-900">
                    {notif.title}
                  </h3>
                  {!notif.read && (
                    <span className="w-2 h-2 rounded-full bg-[#4b37df] shrink-0" />
                  )}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{notif.description}</p>
                <span className="text-[10px] text-slate-400 block pt-0.5">{notif.time}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => deleteNotification(notif.id)}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              title="Dismiss notification"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
