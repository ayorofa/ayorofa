import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BottomNav from '@/components/BottomNav';
import Analytics from '@/components/Analytics';
import { AdSenseScript } from '@/components/AdSense';
import CookieConsent from '@/components/CookieConsent';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#161a1f',
};

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://connect.ayorofa.com'),
  title: {
    default: 'Ayôrôfa Connect — La mise en relation BTP, emploi & services en Côte d’Ivoire',
    template: '%s · Ayôrôfa Connect',
  },
  description: 'Ayôrôfa Connect met en relation entreprises, particuliers et chercheurs d’emploi : besoins, offres et services en Côte d’Ivoire, en temps réel.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <Header />
        {children}
        <Footer />
        <BottomNav />
        <Analytics />
        <AdSenseScript />
        <CookieConsent />
      </body>
    </html>
  );
}
