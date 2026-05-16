import { create } from 'zustand';
import type { ILead, IPagination } from '../types';
import { fetchLeadsApi } from '../api/leads.api'; import type { FetchLeadsParams } from '../api/leads.api';

interface LeadsState {
  leads: ILead[];
  pagination: IPagination | null;
  isLoading: boolean;
  error: string | null;
  
  // Current active filters/params
  params: FetchLeadsParams;

  // Actions
  setParams: (newParams: Partial<FetchLeadsParams>) => void;
  fetchLeads: () => Promise<void>;
  resetParams: () => void;
}

const defaultParams: FetchLeadsParams = {
  page: 1,
  sort: 'latest',
  search: '',
  status: '',
  source: '',
};

export const useLeadsStore = create<LeadsState>((set, get) => ({
  leads: [],
  pagination: null,
  isLoading: false,
  error: null,
  params: defaultParams,

  setParams: (newParams) => {
    set((state) => {
      // If we change filters like search, status, source, sort -> reset page to 1
      const isFilterChange = 
        (newParams.search !== undefined && newParams.search !== state.params.search) ||
        (newParams.status !== undefined && newParams.status !== state.params.status) ||
        (newParams.source !== undefined && newParams.source !== state.params.source) ||
        (newParams.sort !== undefined && newParams.sort !== state.params.sort);
      
      const newPage = isFilterChange ? 1 : newParams.page || state.params.page;

      return {
        params: { ...state.params, ...newParams, page: newPage },
      };
    });
    // Immediately fetch when params are updated
    get().fetchLeads();
  },

  fetchLeads: async () => {
    set({ isLoading: true, error: null });
    try {
      const currentParams = get().params;
      
      // Clean up empty params before sending
      const cleanParams = Object.fromEntries(
        Object.entries(currentParams).filter(([, v]) => v !== '' && v !== undefined)
      );

      const data = await fetchLeadsApi(cleanParams);
      
      set({ 
        leads: data.leads, 
        pagination: data.pagination, 
        isLoading: false 
      });
    } catch (error: unknown) {
      set({ 
        isLoading: false, 
        error: (error as any).response?.data?.message || 'Failed to fetch leads' 
      });
    }
  },

  resetParams: () => {
    set({ params: defaultParams });
    get().fetchLeads();
  },
}));
