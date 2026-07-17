'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { PLANS } from '@/data/plans';

const F = (n) => Number(n).toLocaleString('fr-FR');
const nomPlan = (id) => (PLANS.find((p) => p.id === id)?.nom) || id;

export default function Factures() {
  const [lignes, setLignes] = useState(null);

  useEffect(() => {
    if (!supabase) return;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = '/connexion'; return; }
      const [{ data: ab }, { data: pa }] = await Promise.all([
        supabase.from('abonnements').select('*').eq('utilisateur', user.id).eq('statut', 'valide'),
        supabase.from('paiements').select('*').eq('utilisateur', user.id).eq('statut', 'paye'),
      ]);
      const tout = [
        ...(ab || []).map((x) => ({ ...x, src: 'a', date: x.created_at, moyenAff: x.moyen ? `Mobile Money (${x.moyen})` : 'Mobile Money' })),
        ...(pa || []).map((x) => ({ ...x, src: 'p', date: x.paye_at || x.created_at, moyenAff: x.operateur || 'CinetPay' })),
      ].sort((a, b) => new Date(b.date) - new Date(a.date));
      setLignes(tout);
    })();
  }, []);

  return (
    <main className="sec"><div className="wrap" style={{ maxWidth: 680 }}>
      <p className="eyebrow">Mes paiements</p>
      <h1>Factures & reçus 🧾</h1>
      {lignes === null ? <p className="muted" style={{ marginTop: 14 }}>Chargement…</p> :
      lignes.length ? (
        <div style={{ display: 'grid', gap: 10, marginTop: 16 }}>
          {lignes.map((l) => (
            <div key={l.src + l.id} className="card" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <strong>Abonnement {nomPlan(l.plan)}</strong>
                <p className="muted sm" style={{ margin: '2px 0 0' }}>
                  {new Date(l.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })} · {l.moyenAff}
                </p>
              </div>
              <strong style={{ fontFamily: 'Georgia,serif', fontSize: '1.1rem' }}>{F(l.montant)} F</strong>
              <Link className="btn btn-sm" href={`/factures/${l.id}?src=${l.src}`}>Reçu</Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="card" style={{ marginTop: 16 }}>
          <p className="muted" style={{ margin: 0 }}>Aucun paiement validé pour l’instant.
          Vos reçus apparaîtront ici après chaque abonnement.</p>
          <Link className="btn btn-sm" href="/abonnements" style={{ marginTop: 10 }}>Voir les formules</Link>
        </div>
      )}
    </div></main>
  );
}
