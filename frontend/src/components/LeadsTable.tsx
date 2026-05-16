import React from 'react';
import { Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import type { ILead, IPagination } from '../types';

interface LeadsTableProps {
  leads: ILead[];
  pagination: IPagination;
  isLoading: boolean;
  onEdit: (lead: ILead) => void;
  onDelete: (id: string) => void;
  onPageChange: (page: number) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'New':
      return 'bg-blue-500/10 text-blue-500 border border-blue-500/20';
    case 'Contacted':
      return 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20';
    case 'Qualified':
      return 'bg-green-500/10 text-green-500 border border-green-500/20';
    case 'Lost':
      return 'bg-red-500/10 text-red-500 border border-red-500/20';
    default:
      return 'bg-gray-500/10 text-gray-500 border border-gray-500/20';
  }
};

const LeadsTable: React.FC<LeadsTableProps> = ({
  leads,
  pagination,
  isLoading,
  onEdit,
  onDelete,
  onPageChange,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!leads || leads.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-8 text-center border border-gray-700">
        <p className="text-gray-400">No leads found.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-900 border-b border-gray-700 text-sm font-semibold text-gray-400">
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Status</th>
              <th className="p-4">Source</th>
              <th className="p-4">Created By</th>
              <th className="p-4">Created At</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-300 divide-y divide-gray-700">
            {leads.map((lead) => (
              <tr key={lead._id} className="hover:bg-gray-750 transition-colors">
                <td className="p-4 font-medium text-white">{lead.name}</td>
                <td className="p-4">{lead.email}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                    {lead.status}
                  </span>
                </td>
                <td className="p-4">{lead.source}</td>
                <td className="p-4">
                  {typeof lead.createdBy === 'object' && lead.createdBy !== null
                    ? (lead.createdBy as { name: string }).name
                    : lead.createdBy}
                </td>
                <td className="p-4">{new Date(lead.createdAt).toLocaleDateString()}</td>
                <td className="p-4 text-right flex justify-end gap-2">
                  <button
                    onClick={() => onEdit(lead)}
                    className="p-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition-colors"
                    title="Edit Lead"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(lead._id)}
                    className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded transition-colors"
                    title="Delete Lead"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-700 bg-gray-900 px-4 py-3 sm:px-6">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="relative inline-flex items-center rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.pages}
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-400">
                Showing page <span className="font-medium text-white">{pagination.page}</span> of{' '}
                <span className="font-medium text-white">{pagination.pages}</span> (
                <span className="font-medium text-white">{pagination.total}</span> total)
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button
                  onClick={() => onPageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-700 hover:bg-gray-700 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                {/* Simplified page numbers could go here, omitting for brevity/generality */}
                <button
                  onClick={() => onPageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.pages}
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-700 hover:bg-gray-700 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Next</span>
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsTable;
