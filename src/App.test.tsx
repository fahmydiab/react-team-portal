import { beforeEach, describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotFound } from './pages/NotFound';
import { Login } from './pages/Login';
import { withAuth } from './hoc/withPortalGuards';

function TargetDashboardPage() {
  return <div>Welcome to the Core Dashboard Vault</div>;
}
const ProtectedTestPage = withAuth(TargetDashboardPage);

describe('Portal Navigation and Access Control Protections', () => {
  beforeEach(() => {
    localStorage.clear();
  });
  
  test('an unknown URL pattern path string correctly renders the Not Found page view', () => {
    render(
      <MemoryRouter initialEntries={['/some-undefined-broken-route']}>
        <Routes>
          <Route path="/404" element={<NotFound />} />
          {/* Mocking the fallback behavior of the router assembly */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Not found/i)).toBeInTheDocument();
    expect(screen.getByText(/Return Home/i)).toBeInTheDocument();
  });

  test('withAuth intercepts an anonymous signed-out session request and redirects to /login', () => {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/dashboard/settings']}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard/settings" element={<ProtectedTestPage />} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );

    expect(screen.queryByText(/Welcome to the Core Dashboard Vault/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Portal Authentication/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/e\.g\., sara/i)).toBeInTheDocument();
  });
});
