import { Outlet, useLocation } from 'react-router-dom';
import Footer from './Footer';
import CookieConsentBanner from './legal/CookieConsentBanner';

export default function RootLayout() {
  const { pathname } = useLocation();

  return (
    <>
      <Outlet />
      <Footer variant={pathname === '/' ? 'marketing' : 'compact'} />
      <CookieConsentBanner />
    </>
  );
}
