import { Link } from 'react-router-dom';

export default function ProjectCard({ project }) {
  const cover = project.coverImage || project.media?.find((m) => m.type === 'image')?.url;
  return (
    <Link to={`/projects/${project.slug}`} className="card">
      <div className="card-media">
        {cover ? <img src={cover} alt={project.title} /> : <div />}
      </div>
      <div className="card-body">
        <span className="tag">{project.category}</span>
        <h3 className="card-title">{project.title}</h3>
        <div className="card-meta">
          {[project.location, project.year].filter(Boolean).join(' · ')}
        </div>
        {project.summary && <p className="card-summary">{project.summary}</p>}
      </div>
    </Link>
  );
}
