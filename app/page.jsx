import { Bricolage_Grotesque, Figtree } from 'next/font/google';
import './accueil.css';

import { RedirectSiConnecte } from './VitrineClient';
import DonneesAccueil from '@/components/accueil/DonneesAccueil';
import Hero from '@/components/accueil/Hero';
import Confiance from '@/components/accueil/Confiance';
import Statistiques from '@/components/accueil/Statistiques';
import Metiers from '@/components/accueil/Metiers';
import ProsProches from '@/components/accueil/ProsProches';
import PublierBesoin from '@/components/accueil/PublierBesoin';
import EspacePro from '@/components/accueil/EspacePro';
import CommentCaMarche from '@/components/accueil/CommentCaMarche';
import Opportunites from '@/components/accueil/Opportunites';
import Pourquoi from '@/components/accueil/Pourquoi';
import Temoignages from '@/components/accueil/Temoignages';
import Questions from '@/components/accueil/Questions';
import CtaFinal from '@/components/accueil/CtaFinal';
import { FAQ } from '@/data/accueil';

/* ══════════════════════════════════════════════════════════
   TYPOGRAPHIE DE MARQUE
   Bricolage Grotesque pour les titres, Figtree pour le texte.
   Servies par next/font : les fichiers sont hébergés avec le
   site, sans requête vers un domaine tiers ni saut de rendu.
   ══════════════════════════════════════════════════════════ */
const display = Bricolage_Grotesque({
  subsets: ['latin'], weight: ['600', '800'],
  variable: '--ay-display', display: 'swap',
  fallback: ['Georgia', 'serif'],
});
const texte = Figtree({
  subsets: ['latin'], weight: ['400', '500', '700'],
  variable: '--ay-texte', display: 'swap',
  fallback: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
});

const SITE = 'https://connect.ayorofa.com';

export const metadata = {
  title: 'Ayôrôfa Connect — Le réseau professionnel de la Côte d’Ivoire',
  description:
    'Trouvez un artisan, une entreprise ou une opportunité près de chez vous. Profils vérifiés, avis clients, contact direct et paiement Mobile Money — partout en Côte d’Ivoire.',
  alternates: { canonical: '/' },
  verification: { google: '3Ho8g71uDp7GAgjZtXgYh7SGuuYdnZlA0DPTbs4Yp2I' },
  keywords: [
    'artisan Côte d’Ivoire', 'professionnel Abidjan', 'trouver un plombier Abidjan',
    'électricien Côte d’Ivoire', 'annuaire professionnel ivoirien', 'devis artisan Abidjan',
  ],
  openGraph: {
    title: 'Ayôrôfa Connect — Le réseau professionnel de la Côte d’Ivoire',
    description: 'Un besoin d’un côté. Un talent de l’autre. Trouvez un professionnel vérifié près de chez vous.',
    url: SITE,
    type: 'website',
    locale: 'fr_CI',
  },
};

/* ── Données structurées ──
   Le site + la recherche interne + l'organisation, et la FAQ
   réellement présente en bas de page. */
const JSONLD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITE}/#site`,
      name: 'Ayôrôfa Connect',
      url: SITE,
      inLanguage: 'fr-CI',
      description: 'Le réseau professionnel de la Côte d’Ivoire : mise en relation entre professionnels, clients et chercheurs d’emploi.',
      publisher: { '@id': `${SITE}/#organisation` },
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: `${SITE}/recherche?q={search_term_string}` },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'Organization',
      '@id': `${SITE}/#organisation`,
      name: 'Ayôrôfa',
      alternateName: 'Ayôrôfa Connect',
      slogan: 'La maison du savoir',
      url: SITE,
      logo: `${SITE}/icon-512.png`,
      email: 'contact@ayorofa.com',
      areaServed: { '@type': 'Country', name: 'Côte d’Ivoire' },
      address: { '@type': 'PostalAddress', addressLocality: 'Abidjan', addressCountry: 'CI' },
    },
    {
      '@type': 'FAQPage',
      '@id': `${SITE}/#faq`,
      mainEntity: FAQ.map(([q, r]) => ({
        '@type': 'Question', name: q,
        acceptedAnswer: { '@type': 'Answer', text: r },
      })),
    },
  ],
};

export default function Accueil() {
  return (
    <main className={`ay ${display.variable} ${texte.variable}`}>
      <RedirectSiConnecte />
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }} />

      <DonneesAccueil>
        {/* 02 · 03 — Hero + recherche */}
        <Hero />
        {/* 04 — Indicateurs de confiance */}
        <Confiance />
        {/* 05 — Statistiques */}
        <Statistiques />
        {/* 06 — Métiers populaires */}
        <Metiers />
        {/* 07 — Professionnels près de chez vous */}
        <ProsProches />
        {/* 08 — Publier un besoin */}
        <PublierBesoin />
        {/* 09 — Pour les professionnels */}
        <EspacePro />
        {/* 10 — Comment ça marche */}
        <CommentCaMarche />
        {/* 11 — Opportunités */}
        <Opportunites />
        {/* 12 — Pourquoi Ayôrôfa Connect */}
        <Pourquoi />
        {/* 13 — Témoignages (masqués tant qu'il n'y a pas d'avis réels) */}
        <Temoignages />
        {/* Questions fréquentes — conservées de l'ancienne page */}
        <Questions />
        {/* 15 — CTA final */}
        <CtaFinal />
      </DonneesAccueil>
    </main>
  );
}
