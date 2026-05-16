import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';

export interface LeadFiltersProps {
  filters: {
    search?: string;
    status?: string;
    source?: string;
    sort?: 'latest' | 'oldest';
  };
  onFilterChange: (newFilters: Partial<LeadFiltersProps['filters']>) => void;
}

const LeadFilters: React.FC<LeadFiltersProps> = ({ filters, onFilterChange }) => {
  const [localSearch, setLocalSearch] = useState(filters.search || '');

  // Debounce search effect
  useEffect(() => {
    const handler = setTimeout(() => {
      if (localSearch !== filters.search) {
        onFilterChange({ search: localSearch });
      }
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [localSearch, filters.search, onFilterChange]);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ status: e.target.value });
  };

  const handleSourceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ source: e.target.value });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ sort: e.target.value as 'latest' | 'oldest' });
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6 shadow-sm">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-500" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
            placeholder="Search leads by name or email..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-wrap md:flex-nowrap items-center gap-3">
          <div className="flex items-center text-gray-400 pl-1 md:pl-0">
            <Filter className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium mr-1 tracking-wide">Filters:</span>
          </div>
          
          <select
            className="bg-gray-900 border border-gray-700 text-gray-300 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block p-2 transition-colors cursor-pointer"
            value={filters.status || ''}
            onChange={handleStatusChange}
          >
            <option value="">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Lost">Lost</option>
          </select>

          <select
            className="bg-gray-900 border border-gray-700 text-gray-300 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block p-2 transition-colors cursor-pointer"
            value={filters.source || ''}
            onChange={handleSourceChange}
          >
            <option value="">All Sources</option>
            <option value="Website">Website</option>
            <option value="Instagram">Instagram</option>
            <option value="Referral">Referral</option>
          </select>

          <div className="hidden md:block w-px h-6 bg-gray-700 mx-1"></div>

          <select
            className="bg-gray-900 border border-gray-700 text-gray-300 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block p-2 transition-colors cursor-pointer"
            value={filters.sort || 'latest'}
            onChange={handleSortChange}
          >
            <option value="latest">Sort: Latest</option>
            <option value="oldest">Sort: Oldest</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default LeadFilters;
