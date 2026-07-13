'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { PLANS } from '@/data/plans';
import { MOBILE_MONEY_NUMERO, WHATSAPP } from '@/lib/paiement';

const fmt = (n) => n.toLocaleString('fr-FR').replace(/\u202f|\u00a0/g, ' ');

export default function Payer({ params }) {
  const router = useRouter();
  const plan = PLANS.find((p) => p.id === params.plan);
  const [profil, setProfil] = useState(null);
  const [me, setMe] = useState(null);
  const [tel, setTel] = useState('');
  const [loading, setLoading] = useState(false);
  const [manuel, setManuel] = useState(false);
  const [reference, setReference] = useState('');
  const [envoye, setEnvoye] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (!supabase) return;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/connexion'); return; }
      setMe(user.id);
      const { data } = await supabase.from('profiles').select('nom,telephone').eq('id', user.id).maybeSingle();
      setProfil(data);
      if (data && data.telephone) setTel(data.telephone);
    })();
  }, [router]);

  if (!plan || plan.prix === 0) {
    return <main className="sec"><div className="wrap"><div className="card">
      <h1>Plan introuvable</h1><Link className="btn btn-sm" href="/abonnements">Voir les formules</Link>
    </div></div></main>;
  }

  // Paiement automatique : on redirige vers la page Mobile Money de CinetPay
  const payer = async () => {
    setLoading(true); setMsg('');
    try {
      const res = await fetch('/api/paiement/initier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: plan.id, montant: plan.prix, userId: me,
          nom: (profil && profil.nom) || 'Membre', telephone: tel,
        }),
      });
      const data = await res.json();
      if (data.payment_url) { window.location.href = data.payment_url; return; }
      // Pas encore configuré -> paiement manuel
      setManuel(true);
      setLoading(false);
    } catch (e) {
      setManuel(true); setLoading(false);
    }
  };

  const declarer = async (e) => {
    e.preventDefault();
    if (!reference.trim()) { setMsg('Indiquez la référence de votre paiement.'); return; }
    setLoading(true); setMsg('');
    const { error } = await supabase.from('abonnements').insert({
      utilisateur: me, plan: plan.id, montant: plan.prix, moyen: 'mobile_money', reference: reference.trim(),
    });
    setLoading(false);
    if (error) { setMsg(error.message); return; }
    setEnvoye(true);
  };

  const waMsg = encodeURIComponent(
    `Bonjour Ayôrôfa Connect 👋\nJ'ai payé le plan ${plan.nom} (${fmt(plan.prix)} FCFA)\nRéférence : ${reference || '…'}\nMerci d'activer mon compte.`);

  if (envoye) {
    return (
      <main className="sec"><div className="wrap" style={{ maxWidth: 520 }}>
        <div className="card ok">
          <h1>Paiement déclaré ✓</h1>
          <p className="muted">Nous vérifions votre paiement. Votre plan <strong>{plan.nom}</strong> sera activé sous peu.</p>
          <a className="btn" href={`https://wa.me/${WHATSAPP}?text=${waMsg}`} target="_blank" rel="noopener" style={{ background: '#25D366', color: '#fff' }}>Confirmer sur WhatsApp</a>
        </div>
      </div></main>
    );
  }

  return (
    <main className="sec"><div className="wrap" style={{ maxWidth: 540 }}>
      <p className="eyebrow">Abonnement</p>
      <h1>Plan {plan.nom}</h1>
      <p className="muted">{plan.desc}</p>

      <div className="card" style={{ marginTop: 16 }}>
        <div className="plan-p">{fmt(plan.prix)} F<small> CFA / {plan.periode}</small></div>
        <ul style={{ marginTop: 14 }}>
          {plan.atouts.map((a) => <li key={a} className="pay-a">{a}</li>)}
        </ul>

        {!manuel ? (
          <>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '.9rem', marginTop: 8 }}>
              Numéro Mobile Money
              <input value={tel} onChange={(e) => setTel(e.target.value)} placeholder="07 00 00 00 00"
                style={{ width: '100%', marginTop: 6, padding: 13, border: '1px solid var(--line)', borderRadius: 11, fontSize: 16 }} />
            </label>
            <button className="btn full" onClick={payer} disabled={loading} style={{ marginTop: 14 }}>
              {loading ? 'Redirection…' : `Payer ${fmt(plan.prix)} FCFA`}
            </button>
            <p className="muted sm" style={{ marginTop: 10, textAlign: 'center' }}>
              Wave · Orange Money · MTN · Moov — paiement sécurisé
            </p>
            <p className="muted sm" style={{ marginTop: 6, textAlign: 'center' }}>
              Le badge est activé automatiquement après le paiement.
            </p>
          </>
        ) : (
          <>
            <div className="plan-note" style={{ marginTop: 14 }}>
              Paiement en ligne momentanément indisponible — payez par Mobile Money :
            </div>
            <div className="paybox">
              <span className="paybox-n">{MOBILE_MONEY_NUMERO}</span>
              <span className="muted sm">Wave · Orange · MTN · Moov — Groupe Ayôrôfa</span>
            </div>
            <form onSubmit={declarer} style={{ marginTop: 16 }}>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '.9rem' }}>
                Référence de la transaction
                <input value={reference} onChange={(e) => setReference(e.target.value)} placeholder="Code reçu par SMS"
                  style={{ width: '100%', marginTop: 6, padding: 13, border: '1px solid var(--line)', borderRadius: 11, fontSize: 16 }} />
              </label>
              {msg && <div style={{ color: '#b3261e', marginTop: 8 }}>{msg}</div>}
              <button className="btn full" type="submit" disabled={loading} style={{ marginTop: 12 }}>
                {loading ? '…' : "J'ai payé"}
              </button>
            </form>
          </>
        )}
      </div>
    </div></main>
  );
}
