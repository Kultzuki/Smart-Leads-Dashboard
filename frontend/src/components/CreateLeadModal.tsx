import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2, CheckCircle2 } from 'lucide-react';
import Modal from './Modal';
import { createLeadApi } from '../api/leads.api';
import { useLeadsStore } from '../store/leadsStore';

interface CreateLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LeadFormData {
  name: string;
  email: string;
  status: "New" | "Contacted" | "Qualified" | "Lost";
  source: "Website" | "Instagram" | "Referral";
}

const CreateLeadModal: React.FC<CreateLeadModalProps> = ({ isOpen, onClose }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<LeadFormData>({
    defaultValues: {
      status: 'New',
      source: 'Website',
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const fetchLeads = useLeadsStore((state) => state.fetchLeads);

  const onSubmit = async (data: LeadFormData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await createLeadApi(data);
      setSuccess(true);
      fetchLeads(); // Refresh leads dynamically
      
      // Auto-close after a short delay
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (err: unknown) {
      setError((err as any).response?.data?.message || (err as any).response?.data?.errors?.[0]?.msg || 'Failed to create lead');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    setError(null);
    setSuccess(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Lead">
      {success ? (
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <div className="rounded-full bg-green-500/20 p-3">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </div>
          <p className="text-lg font-medium text-white">Lead Created Successfully!</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
            <input
              type="text"
              {...register('name', { required: 'Name is required' })}
              className="w-full bg-gray-900 border border-gray-700 rounded-md px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              placeholder="Enter lead name"
            />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <input
              type="email"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              className="w-full bg-gray-900 border border-gray-700 rounded-md px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              placeholder="lead@example.com"
            />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
              <select
                {...register('status')}
                className="w-full bg-gray-900 border border-gray-700 rounded-md px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Lost">Lost</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Source</label>
              <select
                {...register('source', { required: 'Source is required' })}
                className="w-full bg-gray-900 border border-gray-700 rounded-md px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              >
                <option value="Website">Website</option>
                <option value="Instagram">Instagram</option>
                <option value="Referral">Referral</option>
              </select>
              {errors.source && <p className="text-red-400 text-xs mt-1">{errors.source.message}</p>}
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center min-w-[120px] px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Lead'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default CreateLeadModal;
