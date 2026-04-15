import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { GraduationCap, LogOut, User, Sun, Moon } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="nav-brand">
          <GraduationCap color="var(--primary)" /> Sikhoo
        </Link>
        <div className="nav-links">
          <button onClick={toggleTheme} className="btn" aria-label="Toggle Theme" style={{ padding: '8px', background: 'transparent', color: 'var(--text-main)' }}>
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          {user ? (
            <>
              <Link to="/dashboard" className="btn btn-primary" style={{ padding: '8px 16px' }}>Dashboard</Link>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={18} />
                <span>{user.name} ({user.role})</span>
              </div>
              <button onClick={handleLogout} className="btn btn-secondary">
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary">Login</Link>
              <Link to="/register" className="btn btn-primary">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
