import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, LayoutDashboard, FolderKanban } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out');
    navigate('/login');
  }

  function isActive(path) {
    return location.pathname === path;
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* logo */}
        <Link to="/dashboard" className="text-xl font-bold text-slate-800">
          TaskManager
        </Link>

      
        <div className="flex items-center gap-2">
          <Link to="/dashboard">
            <Button
              variant={isActive('/dashboard') ? 'default' : 'ghost'}
              size="sm"
              className="gap-2"
            >
              <LayoutDashboard size={16} />
              Dashboard
            </Button>
          </Link>

          <Link to="/projects">
            <Button
              variant={isActive('/projects') ? 'default' : 'ghost'}
              size="sm"
              className="gap-2"
            >
              <FolderKanban size={16} />
              Projects
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 hidden sm:block">
            Hey, {user.name || 'User'} 
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="gap-2"
          >
            <LogOut size={16} />
            Logout
          </Button>
        </div>

      </div>
    </nav>
  );
}