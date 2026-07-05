import { notFound } from 'next/navigation';
import Link from 'next/link';
import { GUIDES, guideBySlug } from '@/data/guides';
import { AdSlot } from '@/components/AdSense';

export function generateStaticParams() { return GUIDES.map((g) => ({ slug: g.slug })); }
export function generateMetadata({ params }) {
  const g = guideBySlug(params.slug); if (!g) return {};
  return { title: g.titre, description: g.extrait };
}

export default function Guide({ params }) {
  const g = guideBySlug(params.slug);
  if (!g) return notFound();
  return (
    <main className="sec">
      <article className="wrap prose">
        <Link href="/guides" className="muted sm">← Tous les guides</Link>
        <h1 style={{ marginTop: 12 }}>{g.titre}</h1>
        <p className="muted">{g.extrait}</p>
        <div style={{ margin: '20px 0' }}><AdSlot slot="1111111111" /></div>
        <p>Ce guide fait partie du contenu de la plateforme. Remplacez ce texte par votre article complet (prix, étapes, conseils) — c’est ce contenu qui attire le trafic et permet la monétisation.</p>
        <h2>À retenir</h2>
        <ul>
          <li>Demandez toujours plusieurs devis pour comparer.</li>
          <li>Vérifiez les références et les avis du professionnel.</li>
          <li>Privilégiez les pros “vérifiés” pour la sécurité de votre chantier.</li>
        </ul>
        <div style={{ marginTop: 24 }}><Link className="btn" href="/devis">Demander un devis gratuit</Link></div>
      </article>
    </main>
  );
}
