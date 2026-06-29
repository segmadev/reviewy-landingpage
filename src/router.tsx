import { createBrowserRouter } from 'react-router-dom';
import LandingPage             from './pages/LandingPage';
import LoginPage               from './pages/auth/LoginPage';
import BuilderPage             from './pages/builder/BuilderPage';
import BuilderResultPage       from './pages/builder/BuilderResultPage';
import ChooseTemplatePage      from './pages/builder/ChooseTemplatePage';
import DashboardPage           from './pages/dashboard/DashboardPage';
import AccountPage             from './pages/dashboard/AccountPage';
import DashboardTemplatesPage  from './pages/dashboard/DashboardTemplatesPage';
import CheckoutPage            from './pages/checkout/CheckoutPage';

const router = createBrowserRouter([
  { path: '/',                      element: <LandingPage />            },
  { path: '/auth/login',            element: <LoginPage />              },
  { path: '/builder',               element: <BuilderPage />            },
  { path: '/builder/template',      element: <ChooseTemplatePage />     },
  { path: '/builder/result',        element: <BuilderResultPage />      },
  { path: '/dashboard',             element: <DashboardPage />          },
  { path: '/dashboard/account',     element: <AccountPage />            },
  { path: '/dashboard/templates',   element: <DashboardTemplatesPage /> },
  { path: '/checkout',              element: <CheckoutPage />           },
  { path: '*',                      element: <LandingPage />            },
]);

export default router;
