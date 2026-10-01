import { NavLink, Outlet } from 'react-router-dom';

export default function AdminLayout({ children }) {
  return (
    <div className="container admin-layout">
      <aside className="admin-side">
        <NavLink to="/admin" end>Dashboard</NavLink>
        <NavLink to="/admin/projects">Projects</NavLink>
        <NavLink to="/admin/messages">Messages</NavLink>
      </aside>
      <section className="admin-content">
        {children || <Outlet />}
      </section>
    </div>
  );
}
