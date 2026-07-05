import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Analytics from '@/components/Analytics';
import { AdSenseScript } from '@/components/AdSense';
import CookieConsent from '@/components/CookieConsent';

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://btp.ayorofa.com'),
  title: { default: 'Ayôrôfa BTP — Trouvez un pro du BTP & de l’échafaudage en Côte d’Ivoire', template: '%s · Ayôrôfa BTP' },
  description: 'Trouvez, comparez et contactez des professionnels du BTP et de l’échafaudage à Abidjan. Devis rapides, pros vérifiés.',
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
