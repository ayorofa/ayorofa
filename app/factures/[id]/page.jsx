'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { PLANS } from '@/data/plans';

const F = (n) => Number(n).toLocaleString('fr-FR');

function Recu({ params }) {
  const sp = useSearchParams();
  const src = sp.get('src') === 'p' ? 'paiements' : 'abonnements';
  const [l, setL] = useState(null);
  const [nom, setNom] = useState('');

  useEffect(() => {
    if (!supabase) return;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = '/connexion'; return; }
      const { data } = await supabase.from(src).select('*').eq('id', params.id).maybeSingle();
      setL(data || false);
      const { data: p } = await supabase.from('profiles').select('nom,entreprise').eq('id', user.id).maybeSingle();
      setNom(p?.entreprise || p?.nom || '');
    })();
  }, [params.id, src]);

  if (l === null) return <main className="sec"><div className="wrap"><p className="muted">Chargement…</p></div></main>;
  if (l === false) return <main className="sec"><div className="wrap"><div className="card">Reçu introuvable.</div></div></main>;

  const plan = PLANS.find((p) => p.id === l.plan);
  const date = new Date(l.paye_at || l.created_at);
  const ref = (l.transaction_id || l.reference || l.id).toString().slice(0, 18).toUpperCase();

  return (
    <main className="sec recu-page"><div className="wrap" style={{ maxWidth: 560 }}>
      <div className="card recu">
        <div className="recu-tete">
          <div>
            <p className="recu-marque">🏛 AYÔRÔFA CONNECT</p>
            <p className="muted sm" style={{ margin: 0 }}>La maison du savoir · Abidjan, Côte d’Ivoire<br />contact@ayorofa.com</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: 0, fontWeight: 800 }}>REÇU DE PAIEMENT</p>
            <p className="muted sm" style={{ margin: 0 }}>N° {ref}</p>
          </div>
        </div>
        <hr className="recu-tr" />
        <table className="recu-table">
          <tbody>
            <tr><td>Client</td><td>{nom || '—'}</td></tr>
            <tr><td>Date</td><td>{date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</td></tr>
            <tr><td>Prestation</td><td>Abonnement <strong>{plan?.nom || l.plan}</strong> — Ayôrôfa Connect (1 mois)</td></tr>
            <tr><td>Moyen de paiement</td><td>{l.operateur || (l.moyen ? `Mobile Money (${l.moyen})` : 'Mobile Money')}</td></tr>
            <tr className="recu-total"><td>Montant réglé</td><td><strong>{F(l.montant)} FCFA</strong></td></tr>
          </tbody>
        </table>
        <p className="muted sm" style={{ marginTop: 14 }}>
          Merci de votre confiance 🙏 Ce reçu atteste du règlement de l’abonnement ci-dessus.
          Ayôrôfa — RCCM : en cours d’immatriculation (CEPICI, Abidjan).
        </p>
      </div>
      <div className="recu-actions">
        <button className="btn" onClick={() => window.print()}>🖨 Imprimer / Enregistrer en PDF</button>
      </div>
    </div></main>
  );
}

export default function Page({ params }) {
  return (
    <Suspense fallback={<main className="sec"><div className="wrap"><p className="muted">Chargement…</p></div></main>}>
      <Recu params={params} />
    </Suspense>
  );
}
