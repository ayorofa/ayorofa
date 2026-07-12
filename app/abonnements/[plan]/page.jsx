'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { PLANS } from '@/data/plans';
import { MOBILE_MONEY, WHATSAPP, MODE_AUTOMATIQUE } from '@/lib/paiement';

const fmt = (n) => n.toLocaleString('fr-FR').replace(/\u202f|\u00a0/g, ' ');

export default function Payer({ params }) {
  const router = useRouter();
  const plan = PLANS.find((p) => p.id === params.plan);
  const [me, setMe] = useState(null);
  const [moyen, setMoyen] = useState('wave');
  const [reference, setReference] = useState('');
  const [envoye, setEnvoye] = useState(false);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/connexion'); return; }
      setMe(user.id);
    })();
  }, [router]);

  if (!plan || plan.prix === 0) {
    return <main className="sec"><div className="wrap"><div className="card">
      <h1>Plan introuvable</h1><Link className="btn btn-sm" href="/abonnements">Voir les formules</Link>
    </div></div></main>;
  }

  const mm = MOBILE_MONEY[moyen];

  const declarer = async (e) => {
    e.preventDefault();
    if (!reference.trim()) { setMsg('Indiquez la référence de votre paiement.'); return; }
    setLoading(true); setMsg('');
    const { error } = await supabase.from('abonnements').insert({
      utilisateur: me, plan: plan.id, montant: plan.prix, moyen, reference: reference.trim(),
    });
    setLoading(false);
    if (error) { setMsg(error.message); return; }
    setEnvoye(true);
  };

  const waMsg = encodeURIComponent(
    `Bonjour Ayôrôfa Connect 👋\nJ'ai payé le plan ${plan.nom} (${fmt(plan.prix)} FCFA)\nMoyen : ${mm.nom}\nRéférence : ${reference || '…'}\nMerci d'activer mon compte.`);

  if (envoye) {
    return (
      <main className="sec"><div className="wrap" style={{ maxWidth: 520 }}>
        <div className="card ok">
          <h1>Paiement déclaré ✓</h1>
          <p className="muted">Nous vérifions votre paiement. Votre plan <strong>{plan.nom}</strong> sera activé sous peu (généralement en quelques heures).</p>
          <a className="btn" href={`https://wa.me/${WHATSAPP}?text=${waMsg}`} target="_blank" rel="noopener" style={{ background: '#25D366', color: '#fff', marginTop: 8 }}>
            Confirmer sur WhatsApp (plus rapide)
          </a>
          <Link className="btn btn-sm" href="/espace" style={{ marginTop: 10, background: 'transparent', border: '1px solid var(--line)', color: 'var(--text)' }}>Retour à mon espace</Link>
        </div>
      </div></main>
    );
  }

  return (
    <main className="sec"><div className="wrap" style={{ maxWidth: 560 }}>
      <p className="eyebrow">Abonnement</p>
      <h1>Plan {plan.nom}</h1>
      <p className="muted">{plan.desc}</p>

      <div className="card" style={{ marginTop: 16 }}>
        <div className="plan-p">{fmt(plan.prix)} F<small> CFA / {plan.periode}</small></div>

        <p style={{ marginTop: 16, fontWeight: 700 }}>1. Choisissez votre moyen de paiement</p>
        <div className="chips" style={{ marginTop: 8 }}>
          {Object.keys(MOBILE_MONEY).map((k) => (
            <button key={k} type="button" className={'chip' + (moyen === k ? ' on' : '')} onClick={() => setMoyen(k)}>
              {MOBILE_MONEY[k].nom}
            </button>
          ))}
        </div>

        <p style={{ marginTop: 18, fontWeight: 700 }}>2. Envoyez {fmt(plan.prix)} FCFA à ce numéro</p>
        <div className="paybox">
          <span className="paybox-n">{mm.numero}</span>
          <span className="muted sm">{mm.nom} · Groupe Ayôrôfa</span>
        </div>

        <form onSubmit={declarer} style={{ marginTop: 18 }}>
          <p style={{ fontWeight: 700, marginBottom: 8 }}>3. Déclarez votre paiement</p>
          <label style={{ display: 'block', fontWeight: 600, fontSize: '.9rem' }}>
            Référence de la transaction
            <input value={reference} onChange={(e) => setReference(e.target.value)}
              placeholder="Ex. le code reçu par SMS"
              style={{ width: '100%', marginTop: 6, padding: 13, border: '1px solid var(--line)', borderRadius: 11, fontSize: 16 }} />
          </label>
          {msg && <div style={{ color: '#b3261e', marginTop: 8 }}>{msg}</div>}
          <button className="btn full" type="submit" disabled={loading} style={{ marginTop: 14 }}>
            {loading ? '…' : "J'ai payé — activer mon plan"}
          </button>
        </form>

        <p className="muted sm" style={{ marginTop: 14 }}>
          Votre plan est activé après vérification (quelques heures maximum). Sans engagement.
        </p>
      </div>

      {MODE_AUTOMATIQUE && (
        <p className="muted sm" style={{ marginTop: 12 }}>Paiement automatique activé.</p>
      )}
    </div></main>
  );
}
