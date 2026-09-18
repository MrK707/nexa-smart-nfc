import React from 'react';
import { CustomerProvider, useCustomer } from './context/CustomerContext';
import { LoginPage } from './pages/LoginPage';
import { DashboardOverview } from './pages/DashboardOverview';
import { EditProfilePage } from './pages/EditProfilePage';
import { DigitalCardPage } from './pages/DigitalCardPage';
import { SharePage } from './pages/SharePage';
import { SettingsPage } from './pages/SettingsPage';
import { PublicProfilePage } from './pages/PublicProfilePage';
import { AdminPage } from './pages/AdminPage';
import { QuickRouteSwitcher } from './components/QuickRouteSwitcher';

const AppRouter: React.FC = () => {
  const { currentRoute, session } = useCustomer();

  // If visiting public profile /u/:username
  if (currentRoute.startsWith('/u/')) {
    return <PublicProfilePage />;
  }

  // If user is not authenticated and trying to access dashboard/admin
  if (!session.isAuthenticated) {
    return <LoginPage />;
  }

  // Strict Role-Based Admin Protection: Only role === 'admin' can access /admin
  if (currentRoute === '/admin') {
    if (session.user?.role !== 'admin') {
      // Normal customers are strictly forbidden from accessing the Admin Fleet
      return <DashboardOverview />;
    }
    return <AdminPage />;
  }

  // If user has admin role and is on dashboard root, optionally show admin or dashboard
  if (session.user?.role === 'admin' && currentRoute === '/dashboard') {
    // Allows admin to see both, with default to AdminPage or switch
    return <AdminPage />;
  }

  // Dashboard Sub-routes
  switch (currentRoute) {
    case '/dashboard/profile':
      return <EditProfilePage />;
    case '/dashboard/card':
      return <DigitalCardPage />;
    case '/dashboard/share':
      return <SharePage />;
    case '/dashboard/settings':
      return <SettingsPage />;
    case '/dashboard':
    default:
      return <DashboardOverview />;
  }
};

export default function App() {
  return (
    <CustomerProvider>
      <AppRouter />
      <QuickRouteSwitcher />
    </CustomerProvider>
  );
}

