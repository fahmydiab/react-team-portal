import React, { useState } from 'react';
import { useNavigate, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login } from '../api/mockApi';

interface LocationState {
  from?: {
    pathname: string;
  };
}

export function Login() {
  const { user, setUserSession } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('');
  const [inFlight, setInFlight] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const extractFromPath = (state: unknown): string => {
    if (!state || typeof state !== 'object') {
      return '/dashboard';
    }

    const maybeState = state as LocationState;
    if (maybeState.from?.pathname) {
      return maybeState.from.pathname;
    }

    return '/dashboard';
  };

  const fromPath = extractFromPath(location.state);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = username.trim();
    if (!cleanName) return;

    setInFlight(true);
    setErrorMsg(null);

    login(cleanName)
      .then((validUser) => {
        setUserSession(validUser);
        navigate(fromPath, { replace: true });
      })
      .catch((err: Error) => {
        setErrorMsg(err.message);
      })
      .finally(() => {
        setInFlight(false);
      });
  };

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '2rem', background: '#fff', border: '1px solid var(--border)', borderRadius: '8px' }}>
      <h2 style={{ marginTop: 0 }}>Portal Authentication</h2>
      <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
        Log in with <strong>sara</strong> (Admin) or <strong>youssef</strong> (Member).
      </p>

      {errorMsg && (
        <div className="error-banner" style={{ marginTop: '1rem' }}>
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="username" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
            Username Handle
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={inFlight}
            placeholder="e.g., sara"
            style={{ width: '100%', padding: '0.625rem', border: '1px solid var(--border)', borderRadius: '4px', boxSizing: 'border-box' }}
          />
        </div>

        <button
          type="submit"
          className="btn"
          disabled={inFlight || !username.trim()}
          style={{ width: '100%', padding: '0.75rem', opacity: inFlight ? 0.6 : 1 }}
        >
          {inFlight ? 'Verifying Identity...' : 'Access Portal'}
        </button>
      </form>
    </div>
  );
}
