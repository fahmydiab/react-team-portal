import { useEffect, useState } from 'react';
import { fetchProjects } from '../api/mockApi';
import type { ProjectStatus } from '../types';

const STATUS_ORDER: ProjectStatus[] = ['active', 'on_hold', 'completed'];

export function Overview() {
  const [counts, setCounts] = useState<Record<ProjectStatus, number> | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    fetchProjects()
      .then((projects) => {
        if (ignore) {
          return;
        }

        const nextCounts: Record<ProjectStatus, number> = {
          active: 0,
          on_hold: 0,
          completed: 0,
        };

        for (const project of projects) {
          nextCounts[project.status] += 1;
        }

        setCounts(nextCounts);
        setLoading(false);
      })
      .catch((error: Error) => {
        if (ignore) {
          return;
        }
        setErrorMessage(error.message);
        setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  if (loading) {
    return <p>Loading overview...</p>;
  }

  if (errorMessage) {
    return <p>{errorMessage}</p>;
  }

  if (!counts) {
    return null;
  }

  return (
    <div>
      <h2>Overview</h2>
      <p>Project counts by status:</p>
      <ul>
        {STATUS_ORDER.map((status) => (
          <li key={status}>
            {status.replace('_', ' ')}: {counts[status]}
          </li>
        ))}
      </ul>
    </div>
  );
}
