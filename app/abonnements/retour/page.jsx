'use client';
import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

function RetourInner() {
  const sp = useSearchParams();
  const txid = sp.get('transaction_id');
  const [etat, setEtat] = useState('verif'); // verif | ok | attente | echec

  useEffect(() => {
    if (!supabase || !txid) { setEtat('echec'); return; }
    let essais = 0;
    const timer = setInterval(async () => {
      essais++;
      const { data } = await supabase.from('paiements').select('statut').eq('transaction_id', txid).maybeSingle();
      if (data && data.statut === 'paye') { setEtat('ok'); clearInterval(timer); }
      else if (data && data.statut === 'echoue') { setEtat('echec'); clearInterval(timer); }
      else if (essais >= 10) { setEtat('attente'); clearInterval(timer); }
    }, 2000);
    return () => clearInterval(timer);
  }, [txid]);

  if (etat === 'verif') {
    return <main className="sec"><div className="wrap" style={{ maxWidth: 480 }}>
      <div className="card"><h1>Vérification du paiement…</h1>
        <p className="muted">Merci de patienter quelques secondes.</p></div>
    </div></main>;
  }
  if (etat === 'ok') {
    return <main className="sec"><div className="wrap" style={{ maxWidth: 480 }}>
      <div className="card ok">
        <h1>Paiement confirmé ✓</h1>
        <p className="muted">Votre plan est actif et votre <strong>badge Vérifié</strong> est activé.</p>
        <Link className="btn" href="/espace" style={{ marginTop: 10 }}>Voir mon espace</Link>
      </div>
    </div></main>;
  }
  if (etat === 'attente') {
    return <main className="sec"><div className="wrap" style={{ maxWidth: 480 }}>
      <div className="card">
        <h1>Paiement en cours de traitement</h1>
        <p className="muted">Votre plan sera activé dès la confirmation de l’opérateur (quelques minutes).</p>
        <Link className="btn btn-sm" href="/espace" style={{ marginTop: 10 }}>Retour à mon espace</Link>
      </div>
    </div></main>;
  }
  return <main className="sec"><div className="wrap" style={{ maxWidth: 480 }}>
    <div className="card">
      <h1>Paiement non abouti</h1>
      <p className="muted">Le paiement n’a pas été confirmé. Vous pouvez réessayer.</p>
      <Link className="btn btn-sm" href="/abonnements" style={{ marginTop: 10 }}>Voir les formules</Link>
    </div>
  </div></main>;
}

export default function Retour() {
  return (
    <Suspense fallback={<main className="sec"><div className="wrap"><p className="muted">Chargement…</p></div></main>}>
      <RetourInner />
    </Suspense>
  );
}
