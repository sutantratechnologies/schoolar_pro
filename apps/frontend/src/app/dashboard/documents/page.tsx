'use client';

import React, { useState } from 'react';
import {
  FolderCheck,
  FileText,
  Upload,
  CheckCircle2,
  Eye,
  Download,
} from 'lucide-react';

interface DocumentItem {
  id: string;
  name: string;
  category: string;
  fileName: string;
  fileSize: string;
  updatedAt: string;
  status: 'Ready' | 'Draft / Review' | 'Pending Collection';
  statusColor: string;
  isRequired: boolean;
  notes?: string;
}

const INITIAL_DOCS: DocumentItem[] = [
  {
    id: 'doc-1',
    name: 'Undergraduate Academic Transcript & Degree Certificate',
    category: 'Academic Records',
    fileName: 'Tribhuvan_University_Official_Transcript_Aarav.pdf',
    fileSize: '2.4 MB',
    updatedAt: 'Apr 28, 2026',
    status: 'Ready',
    statusColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    isRequired: true,
    notes: 'Certified by TU Examination Controller Office & MoEST Sanothimi.',
  },
  {
    id: 'doc-2',
    name: 'Statement of Purpose (Field of Study & Research Plan)',
    category: 'Essays & Proposals',
    fileName: 'MEXT_Japan_SOP_Research_Plan_v2.4.docx',
    fileSize: '840 KB',
    updatedAt: 'May 02, 2026',
    status: 'Draft / Review',
    statusColor: 'bg-amber-50 text-amber-800 border-amber-200',
    isRequired: true,
    notes: 'Under review with academic advisor for methodology clarity.',
  },
  {
    id: 'doc-3',
    name: 'Academic Letter of Recommendation 1 (Campus Chief / Dean)',
    category: 'Recommendations',
    fileName: 'LOR_Dean_Prof_Adhikari_Signed.pdf',
    fileSize: '1.1 MB',
    updatedAt: 'Apr 30, 2026',
    status: 'Ready',
    statusColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    isRequired: true,
    notes: 'Official letterhead with university seal and digital signature.',
  },
  {
    id: 'doc-4',
    name: 'Academic Letter of Recommendation 2 (Senior Project Supervisor)',
    category: 'Recommendations',
    fileName: 'LOR_Supervisor_Dr_Kafle.pdf',
    fileSize: '950 KB',
    updatedAt: 'May 01, 2026',
    status: 'Ready',
    statusColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    isRequired: true,
    notes: 'Covers senior thesis work in Distributed Machine Learning.',
  },
  {
    id: 'doc-5',
    name: 'IELTS Academic Test Report Form (TRF)',
    category: 'Language Proficiency',
    fileName: 'IELTS_Academic_TRF_Overall_7.5.pdf',
    fileSize: '620 KB',
    updatedAt: 'Feb 15, 2026',
    status: 'Ready',
    statusColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    isRequired: true,
    notes: 'Overall: 7.5 (L: 8.0, R: 8.0, W: 7.0, S: 7.0) • Valid until Feb 2028.',
  },
  {
    id: 'doc-6',
    name: 'Certificate of Physical Examination (MEXT Prescribed Form)',
    category: 'Medical & Embassy',
    fileName: 'Pending hospital checkup...',
    fileSize: '-',
    updatedAt: 'Pending',
    status: 'Pending Collection',
    statusColor: 'bg-rose-50 text-rose-800 border-rose-200',
    isRequired: true,
    notes: 'Must be completed by authorized hospital (e.g., Sukraraj or Bir Hospital).',
  },
];

export default function MyDocumentsPage() {
  const [documents] = useState<DocumentItem[]>(INITIAL_DOCS);
  const [uploadNotice, setUploadNotice] = useState('');

  const readyCount = documents.filter((d) => d.status === 'Ready').length;

  const handleSimulateUpload = () => {
    setUploadNotice('Document successfully uploaded to your encrypted document vault.');
    setTimeout(() => setUploadNotice(''), 3000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-[#4b37df] uppercase tracking-wider block">
            Application Vault
          </span>
          <h1 className="text-2xl sm:text-3xl font-light text-slate-900 tracking-tight">
            My Documents
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Securely store and organize your certified transcripts, recommendation letters, and SOP drafts.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSimulateUpload}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#4b37df] hover:bg-[#3c2cc5] text-white text-xs font-medium transition-colors shadow-xs cursor-pointer shrink-0"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Document</span>
        </button>
      </div>

      {uploadNotice && (
        <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{uploadNotice}</span>
        </div>
      )}

      {/* Vault Readiness Bar */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#4b37df] flex items-center justify-center shrink-0">
            <FolderCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-slate-900">
              Document Readiness: {readyCount} of {documents.length} Core Files Ready
            </h3>
            <p className="text-xs text-slate-500">
              Keep original certified PDFs handy for physical embassy submissions.
            </p>
          </div>
        </div>

        <div className="w-full sm:w-48 bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
          <div
            className="bg-emerald-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${(readyCount / documents.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Documents List */}
      <div className="space-y-3">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-slate-300 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
          >
            <div className="flex items-start gap-3.5 flex-1 min-w-0">
              <div className="p-2.5 rounded-xl bg-slate-100 text-slate-600 shrink-0 mt-0.5">
                <FileText className="w-5 h-5" />
              </div>

              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
                    {doc.name}
                  </h3>
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-medium border ${doc.statusColor}`}>
                    {doc.status}
                  </span>
                </div>

                <p className="text-xs text-slate-500 flex flex-wrap items-center gap-2">
                  <span>{doc.fileName}</span>
                  <span>•</span>
                  <span>{doc.fileSize}</span>
                  <span>•</span>
                  <span>Updated: {doc.updatedAt}</span>
                </p>

                {doc.notes && (
                  <p className="text-[11px] text-slate-400 italic">
                    Note: {doc.notes}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
              <button
                type="button"
                className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                <span>Preview</span>
              </button>

              <button
                type="button"
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                title="Download file"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
