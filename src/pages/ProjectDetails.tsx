import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { fetchProject } from '../api/mockApi';
import { withLoading } from '../hoc/withPortalGuards';
import type { Project } from '../types';

interface BaseProjectDetailsProps {
  project: Project | null;
  onBack: () => void;
}

function BaseProjectDetails({ project, onBack }: BaseProjectDetailsProps) {
  if (!project) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h3>Project not found</h3>
        <button className="btn" onClick={onBack}>Back</button>
      </div>
    );
  }

  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const parseAndFormatDate = (dateString: string): string => {
    const parsedDate = new Date(dateString);
    return isNaN(parsedDate.getTime()) ? dateString : dateFormatter.format(parsedDate);
  };

  return (
    <div>
      <button className="btn btn-secondary" onClick={onBack}>Back</button>
      
      <div className="card" style={{ marginTop: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <h2 style={{ margin: '0 0 1rem 0' }}>{project.name}</h2>
          <span className={`status-badge ${project.status}`} style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
            {project.status.replace('_', ' ')}
          </span>
        </div>
        
        <p style={{ color: '#334155', lineHeight: '1.6', fontSize: '1.05rem', margin: '0 0 2rem 0' }}>
          {project.description}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
          <div>
            <span style={{ display: 'block', fontSize: '0.875rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 500 }}>Project Owner</span>
            <strong style={{ fontSize: '1.1rem', color: '#0f172a' }}>{project.ownerName}</strong>
          </div>
          <div>
            <span style={{ display: 'block', fontSize: '0.875rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 500 }}>Start Date</span>
            <strong style={{ fontSize: '1.1rem', color: '#0f172a' }}>{parseAndFormatDate(project.startDate)}</strong>
          </div>
          <div>
            <span style={{ display: 'block', fontSize: '0.875rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 500 }}>Due Date</span>
            <strong style={{ fontSize: '1.1rem', color: '#0f172a' }}>{parseAndFormatDate(project.dueDate)}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

const DetailsWithLoading = withLoading(BaseProjectDetails);

export function ProjectDetails() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const onBack = () => {
    const state =
      location.state && typeof location.state === 'object'
        ? (location.state as Record<string, unknown>)
        : null;

    const cameFromApp = state?.fromApp === true;

    if (cameFromApp) {
      navigate(-1);
      return;
    }

    navigate('/dashboard/projects');
  };

  useEffect(() => {
    let ignore = false;

    if (!projectId) {
      setProject(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    fetchProject(projectId)
      .then((res) => {
        if (ignore) {
          return;
        }
        setProject(res);
        setLoading(false);
      })
      .catch((err: Error) => {
        if (ignore) {
          return;
        }
        setErrorMsg(err.message || 'Failed to initialize project detail handshake.');
        setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [projectId]);

  if (errorMsg) {
    return (
      <div className="error-banner" style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ margin: '0 0 1rem 0' }}>{errorMsg}</p>
        <button className="btn" onClick={() => navigate(0)}>Retry</button>
      </div>
    );
  }

  return <DetailsWithLoading isLoading={loading} project={project} onBack={onBack} />;
}
