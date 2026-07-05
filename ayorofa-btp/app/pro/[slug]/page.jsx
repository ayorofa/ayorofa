import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PROS, proBySlug } from '@/data/pros';
import { metierBySlug } from '@/data/metiers';

export function generateStaticParams() { return PROS.map((p) => ({ slug: p.slug })); }
export function generateMetadata({ params }) {
  const p = proBySlug(params.slug); if (!p) return {};
  const m = metierBySlug(p.metier);
  return { title: `${p.nom} — ${m ? m.name : ''} à ${p.ville}`, description: p.desc };
}

export default function ProPage({ params }) {
  const p = proBySlug(params.slug);
  if (!p) return notFound();
  const m = metierBySlug(p.metier);
  return (
    <main className="sec">
      <div className="wrap" style={{ maxWidth: 800 }}>
        <Link href="/annuaire" className="muted sm">← Retour à l’annuaire</Link>
        <div className="card" style={{ marginTop: 14 }}>
          <div className="pro-top">
            <div className="pro-avatar" style={{ width: 64, height: 64, fontSize: '1.6rem' }}>{p.nom.charAt(0)}</div>
            <div>
              <h1 style={{ margin: 0 }}>{p.nom} {p.verifie && <span className="badge">✓ Vérifié</span>}</h1>
              <p className="muted">{m ? m.name : p.metier} · {p.ville} · <span className="stars">★ {p.note.toFixed(1)}</span> ({p.avis} avis)</p>
            </div>
          </div>
          <p style={{ marginTop: 10 }}>{p.desc}</p>
          <div style={{ marginTop: 18, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link className="btn" href={`/devis?pro=${p.slug}&metier=${p.metier}`}>Demander un devis</Link>
          </div>
          <p className="muted sm" style={{ marginTop: 14 }}>Le contact du professionnel est communiqué après votre demande de devis.</p>
        </div>
      </div>
    </main>
  );
}
