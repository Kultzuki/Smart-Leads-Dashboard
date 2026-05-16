import api from './axios';
import type { ILeadsResponse, ILead } from '../types';

export interface FetchLeadsParams {
  page?: number;
  search?: string;
  status?: string;
  source?: string;
  sort?: 'latest' | 'oldest';
}

export interface CreateLeadData {
  name: string;
  email: string;
  status?: 'New' | 'Contacted' | 'Qualified' | 'Lost';
  source: 'Website' | 'Instagram' | 'Referral';
}

export interface UpdateLeadData {
  name?: string;
  email?: string;
  status?: 'New' | 'Contacted' | 'Qualified' | 'Lost';
  source?: 'Website' | 'Instagram' | 'Referral';
}

export const fetchLeadsApi = async (params: FetchLeadsParams): Promise<ILeadsResponse> => {
  const response = await api.get<ILeadsResponse>('/leads', { params });
  return response.data;
};

export const createLeadApi = async (leadData: CreateLeadData): Promise<ILead> => {
  const response = await api.post<ILead>('/leads', leadData);
  return response.data;
};

export const updateLeadApi = async (id: string, leadData: UpdateLeadData): Promise<ILead> => {
  const response = await api.put<ILead>(`/leads/${id}`, leadData);
  return response.data;
};

export const deleteLeadApi = async (id: string): Promise<void> => {
  await api.delete(`/leads/${id}`);
};

export const exportLeadsCsvApi = async (params?: FetchLeadsParams): Promise<void> => {
  const response = await api.get('/leads/export', {
    params,
    responseType: 'blob',
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;

  const dateStr = new Date().toISOString().split('T')[0];
  link.setAttribute('download', `leads_export_${dateStr}.csv`);

  document.body.appendChild(link);
  link.click();
  link.parentNode?.removeChild(link);
  window.URL.revokeObjectURL(url);
};
