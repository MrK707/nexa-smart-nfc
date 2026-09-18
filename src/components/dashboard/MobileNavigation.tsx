import React from 'react';
import { Home, User, CreditCard, Settings } from 'lucide-react';
import { useCustomer } from '../../context/CustomerContext';

export const MobileNavigation: React.FC = () => {
  const { currentRoute, navigate } = useCustomer();

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      path: '/dashboard',
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      path: '/dashboard/profile',
    },
    {
      id: 'card',
      label: 'Card',
      icon: CreditCard,
      path: '/dashboard/card',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      path: '/dashboard/settings',
    },
  ];

  return (
    <nav
      id="mobile-bottom-navigation"
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/85 backdrop-blur-[16px] border-t border-[#7c3aed]/15 px-4 py-2 shadow-[0_-4px_20px_rgba(124,58,237,0.06)]"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentRoute === item.path;

          return (
            <button
              key={item.id}
              id={`mobile-nav-${item.id}`}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'text-[#7c3aed]'
                  : 'text-[#6b6478] hover:text-[#1f1b2e]'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform duration-150 ${isActive ? 'scale-110 text-[#7c3aed]' : ''}`} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#7c3aed] rounded-full shadow-xs"></span>
                )}
              </div>
              <span className={`text-[10px] mt-1 font-semibold ${isActive ? 'text-[#7c3aed]' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
