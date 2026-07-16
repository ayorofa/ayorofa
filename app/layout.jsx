import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BottomNav from '@/components/BottomNav';
import InstallApp from '@/components/InstallApp';
import RegisterSW from '@/components/RegisterSW';
import PingPresence from '@/components/PingPresence';
import Analytics from '@/components/Analytics';
import { AdSenseScript } from '@/components/AdSense';
import CookieConsent from '@/components/CookieConsent';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#161310',
};

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://connect.ayorofa.com'),
  title: {
    default: 'Ayôrôfa Connect — La mise en relation BTP, emploi & services en Côte d’Ivoire',
    template: '%s · Ayôrôfa Connect',
  },
  description: 'Ayôrôfa Connect met en relation entreprises, particuliers et chercheurs d’emploi : besoins, offres et services en Côte d’Ivoire, en temps réel.',
  manifest: '/manifest.json',
  openGraph: {
    siteName: 'Ayôrôfa Connect',
    images: [{ url: '/og.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ayôrôfa Connect — Le réseau professionnel de la Côte d’Ivoire',
    description: 'Un besoin d’un côté. Un talent de l’autre.',
    images: ['/og.png'],
  },
  appleWebApp: {
    capable: true,
    title: 'Ayôrôfa Connect',
    statusBarStyle: 'black-translucent',
  },
  icons: {
    icon: [{ url: '/icon-192.png', sizes: '192x192' }, { url: '/icon-512.png', sizes: '512x512' }],
    apple: '/icon-192.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <InstallApp />
        <a href="#contenu" className="skip-lien">Aller au contenu principal</a>
        <Header />
        <div id="contenu">{children}</div>
        <Footer />
        <BottomNav />
        <RegisterSW />
        <PingPresence />
        <Analytics />
        <AdSenseScript />
        <CookieConsent />
      </body>
    </html>
  );
}
