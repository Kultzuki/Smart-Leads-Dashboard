import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { useLeadsStore } from '../store/leadsStore';
import { useAuthStore } from '../store/authStore';
import { deleteLeadApi } from '../api/leads.api';
import type { ILead } from '../types';
import LeadFilters from '../components/LeadFilters';
import LeadsTable from '../components/LeadsTable';
import CreateLeadModal from '../components/CreateLeadModal';
import EditLeadModal from '../components/EditLeadModal';
import ExportCSVButton from '../components/ExportCSVButton';

const LeadsPage: React.FC = () => {
  const { leads, pagination, isLoading, params, setParams, fetchLeads } = useLeadsStore();
  const { user } = useAuthStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editLead, setEditLead] = useState<ILead | null>(null);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleDelete = async (id: string) => {
    if (user?.role !== 'admin') {
      alert('Only admins can delete leads.');
      return;
    }

    if (window.confirm('Are you sure you want to delete this lead? This action cannot be undone.')) {
      try {
        await deleteLeadApi(id);
        fetchLeads();
      } catch (error: unknown) {
        const e = error as { response?: { data?: { message?: string } } };
        console.error('Failed to delete lead', error);
        alert(e.response?.data?.message || 'Failed to delete lead');
      }
    }
  };

  const handleEdit = (lead: ILead) => {
    setEditLead(lead);
  };

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Leads Management</h1>
          <p className="text-gray-400 text-sm mt-1">View, track, and manage your incoming leads.</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <ExportCSVButton params={params} />

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex flex-1 sm:flex-none items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            <Plus className="w-4 h-4" />
            Add Lead
          </button>
        </div>
      </div>

      {/* Filters */}
      <LeadFilters filters={params} onFilterChange={setParams} />

      {/* Table */}
      <LeadsTable
        leads={leads}
        pagination={pagination ?? { total: 0, page: 1, pages: 0, limit: 10 }}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onPageChange={(page) => setParams({ page })}
      />

      {/* Create Modal */}
      <CreateLeadModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* Edit Modal */}
      <EditLeadModal
        isOpen={editLead !== null}
        onClose={() => setEditLead(null)}
        lead={editLead}
      />
    </div>
  );
};

export default LeadsPage;
