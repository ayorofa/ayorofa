import Link from 'next/link';
import { GUIDES } from '@/data/guides';
export const metadata = { title: 'Guides BTP & échafaudage', description: 'Conseils, prix et sécurité pour vos chantiers en Côte d’Ivoire.' };
export default function Guides() {
  return (
    <main className="sec">
      <div className="wrap">
        <p className="eyebrow">Guides</p>
        <h1>Conseils & prix pour vos chantiers</h1>
        <div className="grid g3" style={{ marginTop: 22 }}>
          {GUIDES.map((g) => (
            <Link key={g.slug} href={`/guides/${g.slug}`} className="card metier-card">
              <h3>{g.titre}</h3>
              <p className="muted sm">{g.extrait}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
