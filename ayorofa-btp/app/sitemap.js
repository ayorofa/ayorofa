import { PROS } from '@/data/pros';
import { GUIDES } from '@/data/guides';
import { METIERS } from '@/data/metiers';
export default function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://btp.ayorofa.com';
  const now = new Date();
  const routes = ['', '/annuaire', '/guides', '/devis', '/confidentialite'].map((r) => ({ url: base + r, lastModified: now }));
  const metiers = METIERS.map((m) => ({ url: `${base}/annuaire?metier=${m.slug}`, lastModified: now }));
  const pros = PROS.map((p) => ({ url: `${base}/pro/${p.slug}`, lastModified: now }));
  const guides = GUIDES.map((g) => ({ url: `${base}/guides/${g.slug}`, lastModified: now }));
  return [...routes, ...metiers, ...pros, ...guides];
}
