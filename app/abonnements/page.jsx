'use client';
import Link from 'next/link';
import { PLANS, PUBLICATION_GRATUITE } from '@/data/plans';
import BadgeVerifie from '@/components/BadgeVerifie';

const fmt = (n) => n.toLocaleString('fr-FR').replace(/\u202f|\u00a0/g, ' ');

export default function Abonnements() {
  return (
    <main className="sec">
      <div className="wrap">
        <p className="eyebrow">Nos formules</p>
        <h1>Choisissez votre plan</h1>
        <p className="muted" style={{ maxWidth: 620 }}>
          Rejoindre Ayôrôfa Connect est gratuit. Passez à un plan supérieur quand vous voulez publier
          et gagner en visibilité.
        </p>

        <div className="plans">
          {PLANS.map((p) => (
            <div key={p.id} className={'plan' + (p.vedette ? ' mid' : '') + (p.top ? ' top' : '')}>
              {p.vedette && <span className="plan-tag">Le plus choisi</span>}
              <h3>{p.nom}{p.top && <BadgeVerifie size="sm" label={false} />}</h3>
              <p className="plan-d">{p.desc}</p>
              <div className="plan-p">
                {p.prix === 0 ? 'Gratuit' : `${fmt(p.prix)} F`}
                {p.prix > 0 && <small> CFA / {p.periode}</small>}
              </div>
              {p.prix === 0 && <div className="plan-p" style={{ fontSize: '.85rem', fontWeight: 600, color: 'var(--muted)' }}>Sans engagement</div>}

              {p.id === 'pro' && PUBLICATION_GRATUITE && (
                <div className="plan-note" style={{ marginTop: 14 }}>🎁 Offert pendant le lancement</div>
              )}

              <ul>
                {p.atouts.map((a) => <li key={a}>{a}</li>)}
              </ul>

              <Link
                href={p.id === 'pro' && PUBLICATION_GRATUITE ? '/publier' : p.href}
                className={'btn' + (p.id === 'decouverte' ? ' ghost' : '')}
              >
                {p.id === 'pro' && PUBLICATION_GRATUITE ? 'Publier gratuitement' : p.cta}
              </Link>
            </div>
          ))}
        </div>

        <div className="card" style={{ marginTop: 26, maxWidth: 720 }}>
          <h3>Questions fréquentes</h3>
          <p style={{ marginBottom: 10 }}><strong>Puis-je essayer sans payer ?</strong><br />
            <span className="muted">Oui. L’inscription, le fil d’actualité, la recherche et la messagerie sont gratuits, pour toujours.</span></p>
          <p style={{ marginBottom: 10 }}><strong>Comment payer ?</strong><br />
            <span className="muted">Par Mobile Money (Orange, MTN, Moov, Wave). Contactez-nous pour activer votre plan.</span></p>
          <p style={{ margin: 0 }}><strong>Puis-je arrêter quand je veux ?</strong><br />
            <span className="muted">Oui, les plans sont sans engagement.</span></p>
        </div>
      </div>
    </main>
  );
}
