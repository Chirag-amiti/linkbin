import { Link, NavLink, useNavigate } from 'react-router-dom';
import { BarChart3, FileText, Link2, LogOut, Plus, User } from 'lucide-react';

import { useAuth } from '../context/AuthContext.jsx';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="topbar">
      <Link className="brand" to={isAuthenticated ? '/dashboard' : '/'}>
        <span className="brand-mark">LB</span>
        <span>LinkBin</span>
      </Link>

      <nav className="nav-links">
        {isAuthenticated ? (
          <>
            <NavLink to="/dashboard">
              <BarChart3 size={18} />
              Dashboard
            </NavLink>
            <NavLink to="/urls/new">
              <Link2 size={18} />
              Short URL
            </NavLink>
            <NavLink to="/pastes/new">
              <FileText size={18} />
              Paste
            </NavLink>
            <span className="user-chip">
              <User size={16} />
              {user?.name}
            </span>
            <button className="icon-button" type="button" onClick={handleLogout} aria-label="Logout">
              <LogOut size={18} />
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <Link className="button primary compact" to="/register">
              <Plus size={17} />
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
