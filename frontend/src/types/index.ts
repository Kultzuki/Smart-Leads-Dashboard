export type UserRole = 'admin' | 'sales';
export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Lost';
export type LeadSource = 'Website' | 'Instagram' | 'Referral';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface IAuthResponse {
  token: string;
  user: IUser;
}

export interface ILead {
  _id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdBy: string | IUser;
  createdAt: string;
  updatedAt: string;
}

export interface IPagination {
  total: number;
  page: number;
  pages: number;
  limit: number;
}

export interface ILeadsResponse {
  leads: ILead[];
  pagination: IPagination;
}