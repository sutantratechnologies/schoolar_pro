'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ScholarshipForm } from '@/components/scholarships/ScholarshipForm';
import { Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function EditScholarshipPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadScholarship() {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/scholarships/${id}`);
        if (!res.ok) {
          throw new Error('Scholarship not found');
        }
        const json = await res.json();
        setData(json.scholarship);
      } catch (err: any) {
        setError(err.message || 'Failed to load scholarship details');
      } finally {
        setLoading(false);
      }
    }
    if (id) {
      loadScholarship();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-[#4b37df] animate-spin" />
        <span className="text-xs text-slate-500 font-medium">Loading scholarship profile...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 bg-white rounded-3xl border border-slate-200 text-center space-y-4">
        <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
        <h2 className="text-base font-semibold text-slate-900">Unable to load scholarship</h2>
        <p className="text-xs text-slate-500">{error || 'Scholarship record does not exist.'}</p>
        <Link
          href="/dashboard/scholarships"
          className="inline-block px-4 py-2 rounded-full bg-slate-900 text-white text-xs font-medium"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  return <ScholarshipForm initialData={data} isEdit={true} />;
}
