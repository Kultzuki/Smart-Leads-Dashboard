import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LayoutDashboard, Users, FileDown, LogOut, Menu, X } from 'lucide-react';
import api from '../api/axios';

interface NavItemProps {
  to?: string;
  icon: React.ElementType;
  children: React.ReactNode;
  onClick?: () => void;
  setSidebarOpen?: (open: boolean) => void;
}

const NavItem = ({ to, icon: Icon, children, onClick, setSidebarOpen }: NavItemProps) => {
  const baseClasses =
    'flex items-center w-full space-x-3 px-4 py-3 rounded-lg transition-colors';

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`${baseClasses} text-gray-400 hover:text-white hover:bg-gray-800`}
      >
        <Icon className="w-5 h-5 flex-shrink-0" />
        <span className="font-medium">{children}</span>
      </button>
    );
  }

  return (
    <NavLink
      to={to!}
      onClick={() => setSidebarOpen && setSidebarOpen(false)}
      className={({ isActive }) =>
        `${baseClasses} ${
          isActive
            ? 'bg-blue-600 text-white shadow-md'
            : 'text-gray-400 hover:text-white hover:bg-gray-800'
        }`
      }
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span className="font-medium">{children}</span>
    </NavLink>
  );
};

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleExport = async () => {
    try {
      const response = await api.get('/leads/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'leads.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Export failed', error);
      alert('Failed to export leads');
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-900 text-gray-100">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-900 border-r border-gray-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-800 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
              S
            </div>
            <span className="text-xl font-bold text-white tracking-tight">SmartLeads</span>
          </div>
          <button
            className="lg:hidden text-gray-400 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          <NavItem to="/dashboard" icon={LayoutDashboard} setSidebarOpen={setSidebarOpen}>
            Dashboard
          </NavItem>
          <NavItem to="/leads" icon={Users} setSidebarOpen={setSidebarOpen}>
            Leads
          </NavItem>

          {user?.role === 'admin' && (
            <div className="pt-4 mt-4 border-t border-gray-800">
              <span className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Admin
              </span>
              <div className="mt-2">
                <NavItem onClick={handleExport} icon={FileDown}>
                  Export CSV
                </NavItem>
              </div>
            </div>
          )}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-800">
          <NavItem onClick={handleLogout} icon={LogOut}>
            Logout
          </NavItem>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-10">
          <button
            className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center space-x-4 ml-auto">
            <div className="hidden sm:block text-right">
              <div className="text-sm font-medium text-white">{user?.name}</div>
              <div className="text-xs text-blue-400 font-medium capitalize">{user?.role}</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg ring-2 ring-gray-800">
              {user?.name?.charAt(0).toUpperCase() ?? 'U'}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-950 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;