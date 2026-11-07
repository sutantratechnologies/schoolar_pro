'use client';

import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface NotificationBroadcast {
  id: string;
  title: string;
  message: string;
  targetAudience: 'ALL_STUDENTS' | 'ALL_ORGANIZATIONS' | 'SPECIFIC_CYCLE' | 'SYSTEM_WIDE';
  channel: 'IN_APP' | 'EMAIL' | 'PUSH' | 'OMNICHANNEL';
  sentAt: string;
  recipientCount: number;
  openRate: string;
}

const SAMPLE_NOTIFICATIONS: NotificationBroadcast[] = [
  {
    id: 'NOTIF-901',
    title: 'MEXT 2027 Embassy Recommendation Window Now Open',
    message: 'Applications are officially open. Submit your verified academic credentials and research proposals.',
    targetAudience: 'ALL_STUDENTS',
    channel: 'OMNICHANNEL',
    sentAt: 'Today at 09:00 AM',
    recipientCount: 12450,
    openRate: '68.4%',
  },
  {
    id: 'NOTIF-902',
    title: 'Partner Compliance: Submission of Annual Education Agency Renewals',
    message: 'All registered consultancies in Nepal must upload active MOEST authorization certificates.',
    targetAudience: 'ALL_ORGANIZATIONS',
    channel: 'EMAIL',
    sentAt: 'Nov 04, 2026',
    recipientCount: 84,
    openRate: '92.1%',
  },
  {
    id: 'NOTIF-903',
    title: 'Scheduled Platform Maintenance Notice',
    message: 'BidyaGo API & Auth services will undergo a 15-minute maintenance window on Sunday 02:00 AM UTC.',
    targetAudience: 'SYSTEM_WIDE',
    channel: 'IN_APP',
    sentAt: 'Nov 01, 2026',
    recipientCount: 14200,
    openRate: '45.0%',
  },
];

export default function NotificationsPage() {
  const [broadcasts] = useState<NotificationBroadcast[]>(SAMPLE_NOTIFICATIONS);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
              11
            </span>
            <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-slate-900">
              Notifications & Broadcasts
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Publish system announcements, deadline warnings, and targeted in-app or email broadcast alerts.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-purple-700 text-white text-xs sm:text-sm font-medium transition-all shadow-xs cursor-pointer shrink-0"
        >
          <Send className="w-4 h-4" />
          <span>New Broadcast Announcement</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-semibold text-slate-900">Broadcast History & Deliverability</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
                <th className="pb-3">Announcement</th>
                <th className="pb-3">Audience Target</th>
                <th className="pb-3">Delivery Channel</th>
                <th className="pb-3">Recipients</th>
                <th className="pb-3">Open Rate</th>
                <th className="pb-3">Sent At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {broadcasts.map((n) => (
                <tr key={n.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 pr-4 max-w-sm">
                    <div className="font-semibold text-slate-900">{n.title}</div>
                    <div className="text-[11px] text-slate-500 line-clamp-1">{n.message}</div>
                  </td>
                  <td className="py-3.5 pr-3">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                      {n.targetAudience.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 pr-3 font-semibold text-purple-700">{n.channel}</td>
                  <td className="py-3.5 pr-3 font-mono text-slate-800">{n.recipientCount.toLocaleString()}</td>
                  <td className="py-3.5 pr-3 font-mono text-emerald-600 font-semibold">{n.openRate}</td>
                  <td className="py-3.5 pr-3 text-slate-400">{n.sentAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
