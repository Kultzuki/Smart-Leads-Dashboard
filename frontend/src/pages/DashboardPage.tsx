import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { fetchLeadsApi } from '../api/leads.api';
import { Users, TrendingUp, UserCheck, XCircle } from 'lucide-react';

interface LeadStats {
  total: number;
  new: number;
  qualified: number;
  lost: number;
}

const StatCard = ({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
}) => (
  <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-sm flex items-center gap-4">
    <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <p className="text-gray-400 text-sm font-medium">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  </div>
);

const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<LeadStats>({ total: 0, new: 0, qualified: 0, lost: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        // Fetch all leads with a high limit to get counts
        const [allLeads, newLeads, qualifiedLeads, lostLeads] = await Promise.all([
          fetchLeadsApi({ page: 1 }),
          fetchLeadsApi({ status: 'New', page: 1 }),
          fetchLeadsApi({ status: 'Qualified', page: 1 }),
          fetchLeadsApi({ status: 'Lost', page: 1 }),
        ]);

        setStats({
          total: allLeads.pagination.total,
          new: newLeads.pagination.total,
          qualified: qualifiedLeads.pagination.total,
          lost: lostLeads.pagination.total,
        });
      } catch (err) {
        console.error('Failed to load stats:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Welcome back, {user?.name}!</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-gray-800 border border-gray-700 rounded-xl p-6 animate-pulse">
              <div className="h-4 bg-gray-700 rounded w-1/2 mb-3" />
              <div className="h-8 bg-gray-700 rounded w-1/3" />
            </div>
          ))
        ) : (
          <>
            <StatCard label="Total Leads" value={stats.total} icon={Users} color="bg-blue-600" />
            <StatCard label="New Leads" value={stats.new} icon={TrendingUp} color="bg-indigo-600" />
            <StatCard label="Qualified" value={stats.qualified} icon={UserCheck} color="bg-emerald-600" />
            <StatCard label="Lost" value={stats.lost} icon={XCircle} color="bg-red-600" />
          </>
        )}
      </div>

      {/* Info Card */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 shadow-sm">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white text-xl shadow-lg">
            {user?.name?.charAt(0).toUpperCase() ?? 'U'}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">{user?.name}</h2>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 capitalize">
              {user?.role}
            </span>
          </div>
        </div>
        <p className="text-gray-400 text-sm">
          {user?.role === 'admin'
            ? 'You have admin access. You can manage all leads, export data, and delete records.'
            : 'You have sales user access. You can view and manage your own leads.'}
        </p>
      </div>
    </div>
  );
};

export default DashboardPage;
