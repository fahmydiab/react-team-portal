import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { fetchProjects } from '../api/mockApi';
import { withLoading } from '../hoc/withPortalGuards';
import { usePortalPreferences } from '../context/portalPreferences';
import type { Project, ProjectStatus } from '../types';

function isProjectStatus(value: string): value is ProjectStatus {
  return value === 'active' || value === 'on_hold' || value === 'completed';
}

interface BaseProjectListProps {
  projects: Project[];
}

function BaseProjectList({ projects }: BaseProjectListProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const selectedStatus = searchParams.get('status') || 'all';
  const { compactList } = usePortalPreferences();

  const updateFilters = (next: { q?: string; status?: string }) => {
    const currentQ = next.q ?? searchQuery;
    const currentStatus = next.status ?? selectedStatus;
    const params = new URLSearchParams();

    if (currentStatus !== 'all') {
      params.set('status', currentStatus);
    }

    if (currentQ.trim()) {
      params.set('q', currentQ.trim());
    }

    setSearchParams(params);
  };

  const filteredProjects = projects.filter((project) => {
    const matchesQuery =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatus === 'all' || (isProjectStatus(selectedStatus) && project.status === selectedStatus);

    return matchesQuery && matchesStatus;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '0.75rem', flexWrap: 'wrap' }}>
        <h2 style={{ margin: 0 }}>Projects</h2>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <select
            aria-label="Filter by status"
            value={selectedStatus}
            onChange={(event) => updateFilters({ status: event.target.value })}
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="on_hold">On hold</option>
            <option value="completed">Completed</option>
          </select>

          <input
            type="text"
            placeholder="Search by name"
            value={searchQuery}
            onChange={(event) => updateFilters({ q: event.target.value })}
            style={{ padding: '0.5rem 0.75rem', border: '1px solid var(--border)', borderRadius: '6px', width: '240px' }}
          />
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        <div style={{ display: 'grid', gap: compactList ? '0.5rem' : '1rem' }}>
          {filteredProjects.map((project) => (
            <div key={project.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: compactList ? 'center' : 'flex-start', padding: compactList ? '0.75rem' : '1rem' }}>
              <div>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.125rem' }}>{project.name}</h4>
                {!compactList && <p style={{ margin: '0 0 0.5rem 0' }}>{project.description}</p>}
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem' }}>
                  <span>Owner: {project.ownerName}</span>
                  <span>Due: {project.dueDate}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className={`status-badge ${project.status}`} style={{ display: 'inline-block', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                  {project.status.replace('_', ' ')}
                </span>
                <br />
                <Link
                  to={`/dashboard/projects/${project.id}`}
                  state={{ fromApp: true }}
                  className="btn"
                  style={{ textDecoration: 'none', fontSize: '0.875rem' }}
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const ListWithLoading = withLoading(BaseProjectList);

export function ProjectList() {
  const [data, setData] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let ignore = false;

    fetchProjects()
      .then((res) => {
        if (ignore) return;
        setData(res);
        setLoading(false);
      })
      .catch((err: Error) => {
        if (ignore) return;
        setErrorMsg(err.message || 'An unexpected runtime connection loss was sustained.');
        setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [reloadKey]);

  const retry = () => {
    setLoading(true);
    setErrorMsg(null);
    setReloadKey((key) => key + 1);
  };

  if (errorMsg) {
    return (
      <div className="error-banner" style={{ padding: '1rem' }}>
        <p>{errorMsg}</p>
        <button className="btn" onClick={retry}>Retry</button>
      </div>
    );
  }

  return <ListWithLoading isLoading={loading} projects={data} />;
}
