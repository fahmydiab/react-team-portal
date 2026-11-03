import { Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PortalPreferencesProvider } from './context/PortalPreferencesContext';
import { RootLayout } from './layouts/RootLayout';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { NotFound } from './pages/NotFound';
import { withAuth } from './hoc/withPortalGuards';

import {
  ProtectedAdminSettings,
  ProtectedDashboardOverview,
  ProtectedProjectDetails,
  ProtectedProjectList,
} from './pages/ProtectedPages';

const ProtectedDashboardShell = withAuth(DashboardLayout);

export default function App() {
  return (
    <AuthProvider>
      <PortalPreferencesProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<RootLayout />}>
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />

              <Route path="dashboard" element={<ProtectedDashboardShell />}>
                <Route index element={<ProtectedDashboardOverview />} />
                <Route path="projects" element={<ProtectedProjectList />} />
                <Route path="projects/:projectId" element={<ProtectedProjectDetails />} />
                <Route
                  path="settings"
                  element={
                    <Suspense fallback={<div style={{ padding: '2rem' }}>Loading settings...</div>}>
                      <ProtectedAdminSettings />
                    </Suspense>
                  }
                />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </PortalPreferencesProvider>
    </AuthProvider>
  );
}
