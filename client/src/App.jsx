import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Projects from './pages/Projects.jsx';
import ProjectDetail from './pages/ProjectDetail.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import AdminProjects from './pages/admin/ProjectsList.jsx';
import ProjectForm from './pages/admin/ProjectForm.jsx';
import AdminMessages from './pages/admin/Messages.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/projects" element={<AdminProjects />} />
            <Route path="/admin/projects/new" element={<ProjectForm />} />
            <Route path="/admin/projects/:id/edit" element={<ProjectForm />} />
            <Route path="/admin/messages" element={<AdminMessages />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
