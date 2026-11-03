import { NavLink, Outlet } from 'react-router-dom';

export function DashboardLayout() {
  const getLinkClass = ({ isActive }: { isActive: boolean }) => 
    isActive ? 'nav-link active' : 'nav-link';

  return (
    <div className="dashboard-grid">
      <aside className="sidebar">
        <NavLink to="/dashboard" end className={getLinkClass}>Overview</NavLink>
        <NavLink to="/dashboard/projects" className={getLinkClass}>Projects</NavLink>
        <NavLink to="/dashboard/settings" className={getLinkClass}>Settings</NavLink>
      </aside>

      <section className="main-content">
        <Outlet />
      </section>
    </div>
  );
}
