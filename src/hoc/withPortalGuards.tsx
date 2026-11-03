import type { ComponentType } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Role } from '../types';

interface AuthOptions {
  role?: Role;
}

export function withAuth<P extends object>(
  WrappedComponent: ComponentType<P>,
  options?: AuthOptions
) {
  function WithAuthComponent(props: P) {
    const { user } = useAuth();
    const location = useLocation();

    if (!user) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (options?.role && user.role !== options.role) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p>You do not have access to this page.</p>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  }

  const name = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  WithAuthComponent.displayName = `withAuth(${name})`;

  return WithAuthComponent;
}

export interface WithLoadingProps {
  isLoading: boolean;
}

export function withLoading<P extends object>(
  WrappedComponent: ComponentType<P>
) {
  function WithLoadingComponent(props: WithLoadingProps & P) {
    const { isLoading, ...rest } = props;

    if (isLoading) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <div>Loading...</div>
        </div>
      );
    }

    return <WrappedComponent {...(rest as P)} />;
  }

  const name = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  WithLoadingComponent.displayName = `withLoading(${name})`;

  return WithLoadingComponent;
}
