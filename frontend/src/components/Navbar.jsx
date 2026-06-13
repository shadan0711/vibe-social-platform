import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Home, User, LogOut, Zap } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <Zap className="w-7 h-7 text-accent-violet group-hover:text-accent-cyan transition-colors" />
          <span className="text-xl font-bold gradient-text">Vibe</span>
        </Link>

        <div className="flex items-center gap-1">
          <Link
            to="/"
            className="p-2.5 rounded-xl text-dark-200 hover:text-white hover:bg-dark-600/50 transition-all"
            title="Home"
          >
            <Home className="w-5 h-5" />
          </Link>
          <Link
            to={`/profile/${user?._id}`}
            className="p-2.5 rounded-xl text-dark-200 hover:text-white hover:bg-dark-600/50 transition-all"
            title="Profile"
          >
            <User className="w-5 h-5" />
          </Link>
          <button
            onClick={handleLogout}
            className="p-2.5 rounded-xl text-dark-200 hover:text-accent-rose hover:bg-dark-600/50 transition-all"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>

          <Link
            to={`/profile/${user?._id}`}
            className="ml-2 flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-dark-600/50 transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-violet to-accent-cyan flex items-center justify-center text-white text-sm font-semibold">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium text-dark-100 hidden sm:block">
              {user?.username}
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
