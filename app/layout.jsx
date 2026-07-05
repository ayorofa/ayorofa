import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Analytics from '@/components/Analytics';
import { AdSenseScript } from '@/components/AdSense';
import CookieConsent from '@/components/CookieConsent';

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://btp.ayorofa.com'),
  title: { default: 'Ayôrôfa Connect — La mise en relation BTP, emploi & services en Côte d’Ivoire', template: '%s · Ayôrôfa Connect' },
  description: 'Ayôrôfa Connect met en relation entreprises, particuliers et chercheurs d’emploi : besoins, offres et services (BTP, échafaudage et plus) en Côte d’Ivoire, en temps réel.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <Header />
        {children}
        <Footer />
        <Analytics />
        <AdSenseScript />
        <CookieConsent />
      </body>
    </html>
  );
}
