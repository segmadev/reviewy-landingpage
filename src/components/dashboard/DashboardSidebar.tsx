import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FilePlus, Layers, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { label: 'My CVs',        href: '/dashboard',          icon: LayoutDashboard },
  { label: 'Create New CV', href: '/builder',             icon: FilePlus        },
  { label: 'Templates',     href: '/dashboard/templates', icon: Layers          },
];

interface DashboardSidebarProps {
  isMobile?: boolean;
  onItemClick?: () => void;
}

export default function DashboardSidebar({ isMobile = false, onItemClick }: DashboardSidebarProps) {
  const location = useLocation();
  const navigate  = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => { logout(); navigate('/auth/login'); };
  const handleNavigate = (path: string) => {
    onItemClick?.();
    navigate(path);
  };

  const initials = (user?.fullName ?? 'U')
    .split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <aside
      className={`${isMobile ? 'flex' : 'hidden sm:flex'} w-64 shrink-0 flex-col ${isMobile ? 'h-full' : 'h-screen sticky top-0'} overflow-hidden border-r border-gray-100`}
      style={{ backgroundColor: '#FAFBF9' }}
    >
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-100 shrink-0">
        <Link to="/">
          <img src="/asstes/onwhite-logo.png" alt="ReviewyMe" className="h-7 w-auto" />
        </Link>
      </div>

      {/* User */}
      <div className="px-4 py-4 border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
            style={{ backgroundColor: '#68AE24' }}
          >
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-gray-900 text-sm font-semibold truncate">{user?.fullName ?? 'Job Seeker'}</p>
            <p className="text-gray-400 text-xs truncate">{user?.email ?? ''}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-3 mb-2">Menu</p>
        <ul className="space-y-0.5">
          {navItems.map(({ label, href, icon: Icon }) => {
            const active = location.pathname === href || location.pathname.startsWith(href + '/');
            return (
              <li key={href}>
                <button
                  onClick={() => handleNavigate(href)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium text-left ${
                    active
                      ? 'text-[#58AF24]'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  style={active ? { backgroundColor: 'rgba(104, 174, 36, 0.12)' } : {}}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {label}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="mt-6">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-3 mb-2">Account</p>
          <button
            onClick={() => handleNavigate('/dashboard/account')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium text-left ${
              location.pathname === '/dashboard/account'
                ? 'text-[#58AF24]'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
            style={location.pathname === '/dashboard/account' ? { backgroundColor: 'rgba(104, 174, 36, 0.12)' } : {}}
          >
            <User className="w-4 h-4 shrink-0" />
            Profile
          </button>
        </div>
      </nav>

      {/* Sign Out */}
      <div className="px-3 py-4 border-t border-gray-100 shrink-0">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-all text-sm font-medium"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
