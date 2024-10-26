import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import ProtectedRoute from './ProtectedRoute';
import PersonManagement from 'views/management/pages/person';
import CollectionManagement from 'views/management/pages/collections';
import DeveloperManagement from 'views/management/pages/developers';
// import { element } from 'prop-types';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

// utilities routing
const UtilsTypography = Loadable(lazy(() => import('views/utilities/Typography')));
// ...
const DashboardSetting = Loadable(lazy(() => import('views/dashboard/Setting/FaceAuth')));
// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: (
        <ProtectedRoute>
          <DashboardDefault />
        </ProtectedRoute>
      )
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: (
            <ProtectedRoute>
              <DashboardDefault />
            </ProtectedRoute>
          )
        },
        {
          path: 'setting',
          element: (
            <ProtectedRoute>
              <DashboardSetting />
            </ProtectedRoute>
          )
        }
      ]
    },
    {
      path: 'utils',
      children: [
        {
          path: 'util-typography',
          element: (
            <ProtectedRoute>
              <UtilsTypography />
            </ProtectedRoute>
          )
        }
      ]
    },
    {
      path: 'pages', 
      children: [
        {
          path: 'poi-management',
          element: (
            <ProtectedRoute>
              <PersonManagement/>
            </ProtectedRoute>
          )
        }
      ]
    },
    {
      path: 'pages', 
      children: [
        {
          path: 'collection-management',
          element: (
            <ProtectedRoute>
              <CollectionManagement/>
            </ProtectedRoute>
          )
        }
      ]
    },
    {
      path: 'pages', 
      children: [
        {
          path: 'app/developer-keys',
          element: (
            <ProtectedRoute>
              <DeveloperManagement/>
            </ProtectedRoute>
          )
        }
      ]
    }
  ]
};

export default MainRoutes;