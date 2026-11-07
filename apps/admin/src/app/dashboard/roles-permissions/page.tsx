'use client';

import React from 'react';
import {
  Check,
  X,
} from 'lucide-react';

interface RoleDefinition {
  role: string;
  name: string;
  description: string;
  assignedUsers: number;
  permissions: {
    readCatalog: boolean;
    manageScholarships: boolean;
    verifyPartners: boolean;
    manageStudents: boolean;
    manageAdmins: boolean;
    systemConfig: boolean;
    viewAuditLogs: boolean;
  };
}

const ROLES: RoleDefinition[] = [
  {
    role: 'SUPER_ADMIN',
    name: 'Super Administrator',
    description: 'Root authority with unrestricted platform access, secret rotation, and role assignment.',
    assignedUsers: 1,
    permissions: {
      readCatalog: true,
      manageScholarships: true,
      verifyPartners: true,
      manageStudents: true,
      manageAdmins: true,
      systemConfig: true,
      viewAuditLogs: true,
    },
  },
  {
    role: 'ADMIN',
    name: 'Platform Administrator',
    description: 'Day-to-day operations: review scholarship updates, verify partners, and moderate student issues.',
    assignedUsers: 3,
    permissions: {
      readCatalog: true,
      manageScholarships: true,
      verifyPartners: true,
      manageStudents: true,
      manageAdmins: false,
      systemConfig: false,
      viewAuditLogs: true,
    },
  },
  {
    role: 'COLLEGE',
    name: 'University / College Partner',
    description: 'Workspace authority to list institutional programs, set applicant quotas, and review direct admissions.',
    assignedUsers: 32,
    permissions: {
      readCatalog: true,
      manageScholarships: false,
      verifyPartners: false,
      manageStudents: false,
      manageAdmins: false,
      systemConfig: false,
      viewAuditLogs: false,
    },
  },
  {
    role: 'CONSULTANCY',
    name: 'Educational Consultancy',
    description: 'Workspace authority to manage student counsel pipelines, track document vaults, and process visa filings.',
    assignedUsers: 52,
    permissions: {
      readCatalog: true,
      manageScholarships: false,
      verifyPartners: false,
      manageStudents: false,
      manageAdmins: false,
      systemConfig: false,
      viewAuditLogs: false,
    },
  },
  {
    role: 'STUDENT',
    name: 'Student Applicant',
    description: 'Public student portal access: scholarship search, matching criteria, application submission, and tracking.',
    assignedUsers: 12480,
    permissions: {
      readCatalog: true,
      manageScholarships: false,
      verifyPartners: false,
      manageStudents: false,
      manageAdmins: false,
      systemConfig: false,
      viewAuditLogs: false,
    },
  },
];

export default function RolesPermissionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
              15
            </span>
            <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-slate-900">
              Roles & Permissions Matrix
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Role-Based Access Control (RBAC) governance across Student, Admin, Super Admin, and Workspace targets.
          </p>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-900 border border-purple-200">
          Super Admin Guard Active
        </span>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-6">
        <h2 className="text-sm font-semibold text-slate-900">Platform RBAC Matrix</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
                <th className="pb-3 w-64">Role Name & Details</th>
                <th className="pb-3 text-center">Catalog</th>
                <th className="pb-3 text-center">Scholarships</th>
                <th className="pb-3 text-center">Verification</th>
                <th className="pb-3 text-center">Students</th>
                <th className="pb-3 text-center">Admins</th>
                <th className="pb-3 text-center">System</th>
                <th className="pb-3 text-center">Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ROLES.map((r) => (
                <tr key={r.role} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 pr-4">
                    <div className="font-bold text-slate-900">{r.name}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{r.description}</div>
                    <div className="text-[10px] text-purple-700 font-mono font-semibold mt-1">
                      {r.assignedUsers.toLocaleString()} active users
                    </div>
                  </td>
                  <td className="py-4 text-center">
                    {r.permissions.readCatalog ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>
                  <td className="py-4 text-center">
                    {r.permissions.manageScholarships ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>
                  <td className="py-4 text-center">
                    {r.permissions.verifyPartners ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>
                  <td className="py-4 text-center">
                    {r.permissions.manageStudents ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>
                  <td className="py-4 text-center">
                    {r.permissions.manageAdmins ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>
                  <td className="py-4 text-center">
                    {r.permissions.systemConfig ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>
                  <td className="py-4 text-center">
                    {r.permissions.viewAuditLogs ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
