import React, { useState } from 'react';
import { FileDown, Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { exportLeadsCsvApi } from '../api/leads.api';
import type { FetchLeadsParams } from '../api/leads.api';

interface ExportCSVButtonProps {
  params?: FetchLeadsParams;
  className?: string;
  label?: string;
}

const ExportCSVButton: React.FC<ExportCSVButtonProps> = ({
  params,
  className = '',
  label = 'Export CSV',
}) => {
  const { user } = useAuthStore();
  const [isExporting, setIsExporting] = useState(false);

  // Hidden for non-admins as per RBAC requirements
  if (user?.role !== 'admin') {
    return null;
  }

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const cleanParams = params
        ? (Object.fromEntries(
            Object.entries(params).filter(([, v]) => v !== '' && v !== undefined)
          ) as FetchLeadsParams)
        : undefined;

      await exportLeadsCsvApi(cleanParams);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      console.error('Failed to export CSV', err);
      alert(e.response?.data?.message || 'Failed to export CSV. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className={`flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg border border-emerald-500/50 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${className}`}
    >
      {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
      {isExporting ? 'Exporting...' : label}
    </button>
  );
};

export default ExportCSVButton;
