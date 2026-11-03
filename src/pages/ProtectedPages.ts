import React from 'react';
import { withAuth } from '../hoc/withPortalGuards'; 
import { Overview as RawOverview } from './Overview';
import { ProjectList as RawProjectList } from './ProjectList';
import { ProjectDetails as RawProjectDetails } from './ProjectDetails';
    
export const ProtectedDashboardOverview = withAuth(RawOverview);

const LazySettings = React.lazy(() => 
  import('./AdminSettings').then((module) => ({ default: module.AdminSettings }))
);

export const ProtectedAdminSettings = withAuth(LazySettings, { role: 'admin' });
export const ProtectedProjectList = withAuth(RawProjectList);
export const ProtectedProjectDetails = withAuth(RawProjectDetails);