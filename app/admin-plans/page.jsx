'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Avatar from '@/components/Avatar';
import { ilya } from '@/lib/meta';

const fmt = (n) => (n || 0).toLocaleString('fr-FR').replace(/\u202f|\u00a0/g, ' ');
const PLAN_LABEL = { pro: 'Pro', verifie: 'Vérifié' };

export default function AdminPlans() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [demandes, setDemandes] = useState([]);
  const [busy, setBusy] = useState(null);

  const charger = async () => {
    const { data } = await supabase.from('abonnements').select('*')
      .order('created_at', { ascending: false }).limit(60);
    const ids = [...new Set((data || []).map((d) => d.utilisateur))];
    let profs = {};
    if (ids.length) {
      const { data: ps } = await supabase.from('profiles').select('id,nom,avatar_url').in('id', ids);
      (ps || []).forEach((p) => { profs[p.id] = p; });
    }
    setDemandes((data || []).map((d) => ({ ...d, profil: profs[d.utilisateur] || { nom: 'Utilisateur' } })));
  };

  useEffect(() => {
    if (!supabase) { setReady(true); return; }
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/connexion'); return; }
      const { data } = await supabase.from('profiles').select('is_admin').eq('id', user.id).maybeSingle();
      const ok = !!(data && data.is_admin);
      setIsAdmin(ok);
      if (ok) await charger();
      setReady(true);
    })();
  }, [router]);

  const valider = async (d) => {
    setBusy(d.id);
    const expire = new Date();
    expire.setMonth(expire.getMonth() + 1);
    // 1) activer le plan (et le badge si "vérifié")
    const maj = { plan: d.plan, plan_expire: expire.toISOString() };
    if (d.plan === 'verifie') maj.verifie = true;
    await supabase.from('profiles').update(maj).eq('id', d.utilisateur);
    // 2) marquer la demande comme validée
    await supabase.from('abonnements').update({ statut: 'valide' }).eq('id', d.id);
    await charger();
    setBusy(null);
  };

  const refuser = async (d) => {
    setBusy(d.id);
    await supabase.from('abonnements').update({ statut: 'refuse' }).eq('id', d.id);
    await charger();
    setBusy(null);
  };

  if (!supabase) return <main className="sec"><div className="wrap"><div className="card">Configuration Supabase manquante.</div></div></main>;
  if (!ready) return <main className="sec"><div className="wrap"><p className="muted">Chargement…</p></div></main>;
  if (!isAdmin) return <main className="sec"><div className="wrap"><div className="card"><h1>Accès réservé</h1><p className="muted">Cette page est réservée à l’administrateur.</p></div></div></main>;

  const attente = demandes.filter((d) => d.statut === 'en_attente');
  const traitees = demandes.filter((d) => d.statut !== 'en_attente');

  return (
    <main className="sec"><div className="wrap" style={{ maxWidth: 720 }}>
      <p className="eyebrow">Admin</p>
      <h1>Paiements à valider</h1>
      <p className="muted">Vérifiez la réception du paiement sur votre Mobile Money, puis activez le plan.</p>

      {attente.length ? attente.map((d) => (
        <div key={d.id} className="card" style={{ marginTop: 14 }}>
          <div className="post-head">
            <Avatar url={d.profil.avatar_url} nom={d.profil.nom} size={44} href={`/profil/${d.utilisateur}`} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="post-n"><strong>{d.profil.nom}</strong></div>
              <p className="muted sm" style={{ margin: 0 }}>{ilya(d.created_at)}</p>
            </div>
            <span className="badge">{PLAN_LABEL[d.plan] || d.plan}</span>
          </div>
          <p style={{ marginTop: 10 }}>
            <strong>{fmt(d.montant)} FCFA</strong> · {d.moyen} · réf. <code>{d.reference || '—'}</code>
          </p>
          <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
            <button className="btn btn-sm" onClick={() => valider(d)} disabled={busy === d.id}>
              {busy === d.id ? '…' : 'Valider et activer'}
            </button>
            <button className="btn btn-sm" onClick={() => refuser(d)} disabled={busy === d.id}
              style={{ background: 'transparent', border: '1px solid var(--line)', color: 'var(--text)' }}>
              Refuser
            </button>
          </div>
        </div>
      )) : <div className="card" style={{ marginTop: 14 }}><p className="muted" style={{ margin: 0 }}>Aucun paiement en attente.</p></div>}

      {traitees.length > 0 && (
        <>
          <h2 style={{ marginTop: 26 }}>Historique</h2>
          {traitees.map((d) => (
            <div key={d.id} className="card" style={{ marginTop: 10 }}>
              <p style={{ margin: 0 }}>
                <strong>{d.profil.nom}</strong> · {PLAN_LABEL[d.plan] || d.plan} · {fmt(d.montant)} FCFA{' '}
                <span className="badge" style={d.statut === 'valide' ? {} : { color: '#b3261e', background: 'rgba(179,38,30,.1)' }}>
                  {d.statut === 'valide' ? 'Validé' : 'Refusé'}
                </span>
              </p>
            </div>
          ))}
        </>
      )}
    </div></main>
  );
}
