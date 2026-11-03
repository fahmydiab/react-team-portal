import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/auth';

export function RootLayout() {
  const { user, logout } = useAuth();

  const getLinkClass = ({ isActive }: { isActive: boolean }) => 
    isActive ? 'nav-link active' : 'nav-link';

  return (
    <div>
      <header className="app-header">
        <nav className="header-nav">
          <NavLink to="/" end className={getLinkClass}>Home</NavLink>
          <NavLink to="/dashboard" className={getLinkClass}>Dashboard</NavLink>
        </nav>
        
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span>Identity: <strong>{user.name}</strong></span>
            <button onClick={logout} className="btn btn-secondary" style={{ padding: '0.375rem 0.75rem' }}>
              Log out
            </button>
          </div>
        )}
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
