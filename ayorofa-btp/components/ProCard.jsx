import Link from 'next/link';
import { metierBySlug } from '@/data/metiers';
export default function ProCard({ pro }) {
  const m = metierBySlug(pro.metier);
  return (
    <Link href={`/pro/${pro.slug}`} className="card pro-card">
      <div className="pro-top">
        <div className="pro-avatar">{pro.nom.charAt(0)}</div>
        <div>
          <h3>{pro.nom} {pro.verifie && <span className="badge">✓ Vérifié</span>}</h3>
          <p className="muted sm">{m ? m.name : pro.metier} · {pro.ville}</p>
        </div>
      </div>
      <p className="pro-desc">{pro.desc}</p>
      <div className="pro-foot"><span className="stars">★ {pro.note.toFixed(1)}</span><span className="muted sm">{pro.avis} avis</span></div>
    </Link>
  );
}
