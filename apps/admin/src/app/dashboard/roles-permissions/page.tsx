'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  UserPlus,
  Mail,
  User,
  Check,
  X,
  Clock,
  Copy,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Send,
  KeyRound,
  Trash2,
} from 'lucide-react';

interface AdminAccount {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'SUPER_ADMIN';
  emailVerified: boolean;
  createdAt: string;
}

interface PendingInvitation {
  id: string;
  email: string;
  expiresAt: string;
  createdAt: string;
  invitedBy: string;
}

interface RoleMatrixItem {
  role: string;
  name: string;
  badgeColor: string;
  description: string;
  permissions: {
    scholarships: boolean;
    verification: boolean;
    students: boolean;
    operations: boolean;
    adminManagement: boolean;
    systemConfig: boolean;
  };
}

const ROLE_MATRIX: RoleMatrixItem[] = [
  {
    role: 'SUPER_ADMIN',
    name: 'Super Administrator',
    badgeColor: 'bg-purple-50 text-[#4b37df] border-purple-200',
    description: 'Root platform controller with absolute authority across all modules, staff creation, and system configurations.',
    permissions: {
      scholarships: true,
      verification: true,
      students: true,
      operations: true,
      adminManagement: true,
      systemConfig: true,
    },
  },
  {
    role: 'ADMIN',
    name: 'Platform Administrator',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
    description: 'Day-to-day operations: scholarship indexing, consultancy verification, student issue moderation, and reporting.',
    permissions: {
      scholarships: true,
      verification: true,
      students: true,
      operations: true,
      adminManagement: false,
      systemConfig: false,
    },
  },
  {
    role: 'COLLEGE',
    name: 'University / College Partner',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    description: 'Workspace authority to list degree scholarships, review applicants, and coordinate institutional enrollment.',
    permissions: {
      scholarships: false,
      verification: false,
      students: false,
      operations: false,
      adminManagement: false,
      systemConfig: false,
    },
  },
  {
    role: 'CONSULTANCY',
    name: 'Educational Consultancy',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    description: 'Workspace authority to manage student counsel files, track visa documents, and coordinate college filings.',
    permissions: {
      scholarships: false,
      verification: false,
      students: false,
      operations: false,
      adminManagement: false,
      systemConfig: false,
    },
  },
];

export default function RolesPermissionsPage() {
  const [admins, setAdmins] = useState<AdminAccount[]>([]);
  const [pendingInvitations, setPendingInvitations] = useState<PendingInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  // Notifications / Banner State
  const [actionAlert, setActionAlert] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Invite Admin Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'ADMIN' | 'SUPER_ADMIN'>('ADMIN');
  const [submitting, setSubmitting] = useState(false);
  const [inviteError, setInviteError] = useState('');
  const [inviteSuccess, setInviteSuccess] = useState<{
    email: string;
    activationLink: string;
  } | null>(null);

  // Reset Password Modal State
  const [resetModalData, setResetModalData] = useState<{
    email: string;
    resetLink: string;
  } | null>(null);
  const [resettingId, setResettingId] = useState<string | null>(null);

  // Delete Confirmation Modal State
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState<AdminAccount | null>(null);
  const [deleting, setDeleting] = useState(false);

  const superAdminCount = admins.filter((a) => a.role === 'SUPER_ADMIN').length;

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/admins');
      if (res.ok) {
        const data = await res.json();
        setAdmins(data.admins || []);
        setPendingInvitations(data.pendingInvitations || []);
      }
    } catch (err) {
      console.error('Failed to load administrators:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchAdmins();
  }, []);

  const handleCreateAdmin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setInviteError('');
    setInviteSuccess(null);
    setSubmitting(true);

    try {
      const res = await fetch('/api/admin/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: inviteName.trim(),
          email: inviteEmail.trim(),
          role: inviteRole,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setInviteError(data.message || 'Failed to create administrator invitation.');
        setSubmitting(false);
        return;
      }

      setInviteSuccess({
        email: data.email,
        activationLink: data.activationLink,
      });

      setInviteName('');
      setInviteEmail('');
      setInviteRole('ADMIN');

      void fetchAdmins();
    } catch {
      setInviteError('Unable to reach the server. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Trigger Password Reset Dispatch
  const handleTriggerPasswordReset = async (admin: AdminAccount) => {
    setResettingId(admin.id);
    setActionAlert(null);

    try {
      const res = await fetch('/api/admin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId: admin.id }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setActionAlert({
          type: 'error',
          message: data.message || 'Failed to dispatch password reset email.',
        });
        return;
      }

      setResetModalData({
        email: admin.email,
        resetLink: data.resetLink,
      });

      setActionAlert({
        type: 'success',
        message: `Password reset email has been sent to ${admin.email}.`,
      });
    } catch {
      setActionAlert({
        type: 'error',
        message: 'Unable to communicate with the authentication server.',
      });
    } finally {
      setResettingId(null);
    }
  };

  // Delete Administrator
  const handleConfirmDelete = async () => {
    if (!deleteConfirmTarget) return;
    setDeleting(true);
    setActionAlert(null);

    try {
      const res = await fetch(`/api/admin/${deleteConfirmTarget.id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setActionAlert({
          type: 'error',
          message: data.message || 'Failed to delete administrator.',
        });
        setDeleting(false);
        setDeleteConfirmTarget(null);
        return;
      }

      setActionAlert({
        type: 'success',
        message: data.message || 'Administrator deleted successfully.',
      });

      setDeleteConfirmTarget(null);
      void fetchAdmins();
    } catch {
      setActionAlert({
        type: 'error',
        message: 'Unable to reach the server. Failed to delete administrator.',
      });
    } finally {
      setDeleting(false);
    }
  };

  // Revoke Pending Invitation
  const handleRevokeInvitation = async (invitationId: string) => {
    try {
      const res = await fetch(`/api/admin/invitations/${invitationId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setActionAlert({
          type: 'success',
          message: 'Administrator invitation has been revoked.',
        });
        void fetchAdmins();
      }
    } catch {
      setActionAlert({
        type: 'error',
        message: 'Failed to revoke invitation.',
      });
    }
  };

  const copyToClipboard = (text: string) => {
    void navigator.clipboard.writeText(text);
    setCopiedLink(text);
    setTimeout(() => setCopiedLink(null), 2500);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-[#4b37df] text-xs font-semibold uppercase tracking-wider mb-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Root Governance Authority</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-slate-900">
            Roles & Permissions Control Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Super Administrator console to govern platform RBAC, appoint administrators, reset credentials, and manage staff.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setModalOpen(true);
            setInviteError('');
            setInviteSuccess(null);
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#4b37df] hover:bg-[#3d2ac9] text-white text-xs sm:text-sm font-semibold transition-all shadow-sm cursor-pointer shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Create New Admin</span>
        </button>
      </div>

      {/* Global Alert Banner */}
      {actionAlert && (
        <div
          role="alert"
          className={`p-4 rounded-2xl border text-xs flex items-center justify-between gap-3 ${
            actionAlert.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {actionAlert.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{actionAlert.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionAlert(null)}
            className="p-1 hover:opacity-70 transition-opacity cursor-pointer"
            aria-label="Dismiss alert"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. Top Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Active Administrators</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#4b37df] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-slate-900">{admins.length}</span>
            <span className="text-[11px] text-emerald-600 font-medium">Verified Staff</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            {superAdminCount} Super Admin{superAdminCount !== 1 ? 's' : ''} (min. 1 protected)
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Pending Activations</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-slate-900">{pendingInvitations.length}</span>
            <span className="text-[11px] text-amber-600 font-medium">Awaiting Password Setup</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Activation links valid for 48h</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Super Admin Clearance</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-slate-900">Root Governance</span>
            <span className="text-[11px] text-purple-600 font-medium">Unrestricted</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Sole superadmin deletion disabled</p>
        </div>
      </div>

      {/* 3. Pending Admin Invitations (If Any) */}
      {pendingInvitations.length > 0 && (
        <div className="bg-white rounded-3xl border border-amber-200/80 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  Pending Administrator Activations ({pendingInvitations.length})
                </h2>
                <p className="text-xs text-slate-500">
                  Invitations sent. These users must click their activation link and set a password before accessing the portal.
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {pendingInvitations.map((inv) => (
              <div
                key={inv.id}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 font-mono">{inv.email}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-medium">
                      Link Sent
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Invited by {inv.invitedBy} • Expires:{' '}
                    <span className="text-slate-600 font-medium">
                      {new Date(inv.expiresAt).toLocaleString()}
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleRevokeInvitation(inv.id)}
                    className="px-3 py-1 rounded-full text-[11px] font-medium text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer"
                  >
                    Revoke Link
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Active Platform Administrators Table with Actions */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Active Platform Administrators
            </h2>
            <p className="text-xs text-slate-500">
              Staff authorized to access admin.bidyago.com. Super Admins can reset passwords or delete accounts.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchAdmins}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            title="Refresh list"
            aria-label="Refresh administrators"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
                <th className="pb-3">Administrator</th>
                <th className="pb-3">Role & Clearance</th>
                <th className="pb-3">Account Status</th>
                <th className="pb-3">Appointed Date</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {admins.map((adm) => {
                const isOnlySuperAdmin =
                  adm.role === 'SUPER_ADMIN' && superAdminCount <= 1;

                return (
                  <tr key={adm.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#4b37df] to-[#6d5ae6] text-white text-xs font-bold flex items-center justify-center shrink-0">
                          {adm.name ? adm.name.slice(0, 2).toUpperCase() : 'AD'}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{adm.name}</p>
                          <p className="text-[11px] text-slate-500 font-mono">{adm.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4">
                      <span
                        className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border ${
                          adm.role === 'SUPER_ADMIN'
                            ? 'bg-purple-50 text-[#4b37df] border-purple-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        {adm.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'}
                      </span>
                    </td>

                    <td className="py-4">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>Active Credentials</span>
                      </span>
                    </td>

                    <td className="py-4 text-slate-500 text-[11px]">
                      {new Date(adm.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>

                    {/* Action Buttons: Reset Password & Delete */}
                    <td className="py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        {/* Reset Password Button */}
                        <button
                          type="button"
                          disabled={resettingId === adm.id}
                          onClick={() => handleTriggerPasswordReset(adm)}
                          title={`Dispatch password reset email to ${adm.email}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-[#4b37df] bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                          <span>{resettingId === adm.id ? 'Sending...' : 'Reset Password'}</span>
                        </button>

                        {/* Delete Admin Button */}
                        <button
                          type="button"
                          disabled={isOnlySuperAdmin}
                          onClick={() => setDeleteConfirmTarget(adm)}
                          title={
                            isOnlySuperAdmin
                              ? 'Cannot delete the only remaining Super Administrator'
                              : `Permanently delete ${adm.name}`
                          }
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                            isOnlySuperAdmin
                              ? 'text-slate-300 bg-slate-50 border border-slate-200 cursor-not-allowed opacity-60'
                              : 'text-rose-600 hover:text-white hover:bg-rose-600 border border-rose-200 hover:border-rose-600 cursor-pointer'
                          }`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. System Roles & Capabilities Matrix */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs space-y-6">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Platform Roles & Capabilities Matrix
          </h2>
          <p className="text-xs text-slate-500">
            Detailed breakdown of access rights and governance boundaries across all platform targets.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
                <th className="pb-3 w-72">Role & Authority</th>
                <th className="pb-3 text-center">Scholarships</th>
                <th className="pb-3 text-center">Partner KYB</th>
                <th className="pb-3 text-center">Students</th>
                <th className="pb-3 text-center">Operations</th>
                <th className="pb-3 text-center">Admin Controls</th>
                <th className="pb-3 text-center">System Root</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ROLE_MATRIX.map((item) => (
                <tr key={item.role} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900">{item.name}</span>
                      <span
                        className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.2 rounded-full border ${item.badgeColor}`}
                      >
                        {item.role}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </td>

                  <td className="py-4 text-center">
                    {item.permissions.scholarships ? (
                      <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-slate-300 mx-auto" />
                    )}
                  </td>

                  <td className="py-4 text-center">
                    {item.permissions.verification ? (
                      <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-slate-300 mx-auto" />
                    )}
                  </td>

                  <td className="py-4 text-center">
                    {item.permissions.students ? (
                      <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-slate-300 mx-auto" />
                    )}
                  </td>

                  <td className="py-4 text-center">
                    {item.permissions.operations ? (
                      <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-slate-300 mx-auto" />
                    )}
                  </td>

                  <td className="py-4 text-center">
                    {item.permissions.adminManagement ? (
                      <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-slate-300 mx-auto" />
                    )}
                  </td>

                  <td className="py-4 text-center">
                    {item.permissions.systemConfig ? (
                      <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-slate-300 mx-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. CREATE NEW ADMIN MODAL DIALOG */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
        >
          <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#4b37df] flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-900">
                    Appoint Platform Administrator
                  </h3>
                  <p className="text-xs text-slate-500">
                    Dispatches an invitation email with a secure password creation link
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {inviteSuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-3 text-xs">
                <div className="flex items-start gap-2.5 text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Administrator Appointed & Email Sent!</p>
                    <p className="text-emerald-700 mt-0.5 leading-relaxed">
                      An activation email has been delivered to{' '}
                      <strong>{inviteSuccess.email}</strong>. When the user clicks the link, they will be prompted to set their password.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-emerald-200 space-y-1.5">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Secure Activation Link (Valid for 48 Hours)
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={inviteSuccess.activationLink}
                      className="w-full text-[11px] font-mono text-slate-700 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200"
                    />
                    <button
                      type="button"
                      onClick={() => copyToClipboard(inviteSuccess.activationLink)}
                      className="p-2 bg-[#4b37df] text-white hover:bg-[#3c2cc5] rounded-lg transition-colors cursor-pointer shrink-0"
                      title="Copy activation link"
                    >
                      {copiedLink === inviteSuccess.activationLink ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setInviteSuccess(null);
                      setModalOpen(false);
                    }}
                    className="px-4 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-medium transition-colors cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCreateAdmin} className="space-y-4">
                {inviteError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>{inviteError}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-700">
                    Administrator Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aayush Sharma"
                      value={inviteName}
                      onChange={(e) => setInviteName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#4b37df] focus:ring-1 focus:ring-[#4b37df] transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-700">
                    Administrator Work Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. aayush.admin@bidyago.com"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#4b37df] focus:ring-1 focus:ring-[#4b37df] transition-colors"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    The activation link will be dispatched to this email address.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-700">
                    Assigned Role & Privileges
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label
                      className={`p-3 rounded-2xl border cursor-pointer transition-all flex flex-col gap-1 ${
                        inviteRole === 'ADMIN'
                          ? 'border-[#4b37df] bg-purple-50/50'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="role"
                        value="ADMIN"
                        checked={inviteRole === 'ADMIN'}
                        onChange={() => setInviteRole('ADMIN')}
                        className="sr-only"
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-900">
                          Platform Admin
                        </span>
                        {inviteRole === 'ADMIN' && (
                          <Check className="w-3.5 h-3.5 text-[#4b37df]" />
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500">
                        Operational governance across catalog, KYB & students
                      </span>
                    </label>

                    <label
                      className={`p-3 rounded-2xl border cursor-pointer transition-all flex flex-col gap-1 ${
                        inviteRole === 'SUPER_ADMIN'
                          ? 'border-[#4b37df] bg-purple-50/50'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="role"
                        value="SUPER_ADMIN"
                        checked={inviteRole === 'SUPER_ADMIN'}
                        onChange={() => setInviteRole('SUPER_ADMIN')}
                        className="sr-only"
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-900">
                          Super Admin
                        </span>
                        {inviteRole === 'SUPER_ADMIN' && (
                          <Check className="w-3.5 h-3.5 text-[#4b37df]" />
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500">
                        Root platform authority, roles & security controls
                      </span>
                    </label>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded-full border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submitting || !inviteName.trim() || !inviteEmail.trim()}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#4b37df] hover:bg-[#3d2ac9] text-white text-xs font-semibold transition-all shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submitting ? 'Dispatching...' : 'Dispatch Activation Link'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 7. RESET PASSWORD LINK SUCCESS MODAL */}
      {resetModalData && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
        >
          <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#4b37df] flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-900">
                    Password Reset Link Dispatched
                  </h3>
                  <p className="text-xs text-slate-500">
                    Direct password reset link valid for 24 hours
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setResetModalData(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600 leading-relaxed">
                An email containing password reset instructions has been delivered to{' '}
                <strong className="text-slate-900 font-mono">{resetModalData.email}</strong>.
              </p>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Password Reset URL
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={resetModalData.resetLink}
                    className="w-full text-[11px] font-mono text-slate-700 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200"
                  />
                  <button
                    type="button"
                    onClick={() => copyToClipboard(resetModalData.resetLink)}
                    className="p-2 bg-[#4b37df] text-white hover:bg-[#3c2cc5] rounded-lg transition-colors cursor-pointer shrink-0"
                    title="Copy reset link"
                  >
                    {copiedLink === resetModalData.resetLink ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setResetModalData(null)}
                className="px-5 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. DELETE CONFIRMATION MODAL */}
      {deleteConfirmTarget && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
        >
          <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  Delete Administrator Account
                </h3>
                <p className="text-xs text-slate-500">This action cannot be undone</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-100 text-xs text-rose-900 leading-relaxed space-y-1">
              <p>
                Are you sure you want to permanently delete{' '}
                <strong>{deleteConfirmTarget.name}</strong> (
                <span className="font-mono">{deleteConfirmTarget.email}</span>)?
              </p>
              <p className="text-[11px] text-rose-700">
                Their active sessions, credentials, and access to the Administration Portal will be immediately invalidated.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmTarget(null)}
                disabled={deleting}
                className="px-4 py-2 rounded-full border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-all shadow-sm cursor-pointer disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{deleting ? 'Deleting...' : 'Confirm Deletion'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
