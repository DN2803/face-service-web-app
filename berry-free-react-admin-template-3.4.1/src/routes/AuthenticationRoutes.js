import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';
import MinimalLayout from 'layout/MinimalLayout';
import { EmailProvider } from 'hooks/context/EmailContext';  // Import EmailProvider

// Lazy load các component
const AuthLogin3 = Loadable(lazy(() => import('views/pages/authentication/authentication3/Login3')));
const AuthRegister3 = Loadable(lazy(() => import('views/pages/authentication/authentication3/Register3')));
const ForgotPassword3 = Loadable(lazy(() => import('views/pages/forgot-password/forgot-password/ForgotPassword')));
const ResetPassword3 = Loadable(lazy(() => import('views/pages/forgot-password/forgot-password/ResetPassword')));

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AuthenticationRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    {
      index: true,
      element: <AuthLogin3 />
    },
    {
      path: '/pages/login/login3',
      element: <AuthLogin3 />
    },
    {
      path: '/pages/register/register3',
      element: <AuthRegister3 />
    },
    // Group routes for forgot and reset password wrapped by EmailProvider
    {
      path: '/pages/forgot-password',
      element: (
        <EmailProvider> {/* Bọc các route bằng EmailProvider */}
          <ForgotPassword3 />
        </EmailProvider>
      )
    },
    {
      path: '/pages/reset-password',
      element: (
        <EmailProvider>
          <ResetPassword3 />
        </EmailProvider>
      )
    }
  ]
};

export default AuthenticationRoutes;
