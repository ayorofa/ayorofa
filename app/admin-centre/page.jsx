'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { ilya } from '@/lib/meta';
import { PLANS } from '@/data/plans';

/* Centre de contrôle : tout ce qui attend une décision, en temps réel. */
export default function AdminCentre() {
  const [me, setMe] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [sig, setSig] = useState([]);
  const [abos, setAbos] = useState([]);
  const [boosts, setBoosts] = useState([]);
  const [badges, setBadges] = useState([]);
  const [profils, setProfils] = useState({});
  const [busy, setBusy] = useState(null);
  const [son, setSon] = useState(true);

  const nomDe = (id) => profils[id]?.nom || 'Membre';

  const charger = useCallback(async () => {
    const [s, a, b, g] = await Promise.all([
      supabase.from('signalements').select('*').eq('statut', 'ouvert')
        .order('created_at', { ascending: true }).limit(50),
      supabase.from('abonnements').select('*').eq('statut', 'en_attente')
        .order('created_at', { ascending: true }).limit(50),
      supabase.from('demandes_boost').select('*').eq('statut', 'en_attente')
        .order('created_at', { ascending: true }).limit(50),
      supabase.from('demandes_badge').select('*').eq('statut', 'en_attente')
        .order('created_at', { ascending: true }).limit(50),
    ]);
    setSig(s.data || []); setAbos(a.data || []); setBoosts(b.data || []); setBadges(g.data || []);

    const ids = [...new Set([
      ...(s.data || []).map((x) => x.signale_par),
      ...(a.data || []).map((x) => x.utilisateur),
      ...(b.data || []).map((x) => x.membre),
      ...(g.data || []).map((x) => x.membre),
    ].filter(Boolean))];
    if (ids.length) {
      const { data: ps } = await supabase.from('profiles').select('id,nom').in('id', ids);
      const m = {}; (ps || []).forEach((p) => { m[p.id] = p; });
      setProfils(m);
    }
  }, []);

  const deciderBadge = async (d, ok) => {
    if (ok) {
      const { data: p } = await supabase.from('profiles').select('badges').eq('id', d.membre).maybeSingle();
      const actuels = p?.badges || [];
      if (!actuels.includes(d.badge)) {
        await supabase.from('profiles').update({ badges: [...actuels, d.badge] }).eq('id', d.membre);
      }
      if (d.badge === 'verifie') await supabase.from('profiles').update({ verifie: true }).eq('id', d.membre);
    }
    await supabase.from('demandes_badge').update({ statut: ok ? 'acceptee' : 'refusee' }).eq('id', d.id);
    charger();
  };

  const bip = () => {
    if (!son) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.frequency.value = 880; g.gain.value = 0.06;
      o.start(); setTimeout(() => { o.stop(); ctx.close(); }, 180);
    } catch (e) {}
  };

  useEffect(() => {
    if (!supabase) return;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = '/connexion'; return; }
      setMe(user.id);
      const { data: p } = await supabase.from('profiles').select('is_admin').eq('id', user.id).maybeSingle();
      if (!p?.is_admin) { setAdmin(false); return; }
      setAdmin(true);
      await charger();

      const canal = supabase.channel('centre-admin')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'signalements' }, () => { bip(); charger(); })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'abonnements' }, () => { bip(); charger(); })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'demandes_boost' }, () => { bip(); charger(); })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'demandes_badge' }, () => { bip(); charger(); })
        .subscribe();
      return () => supabase.removeChannel(canal);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const traiterSignalement = async (s, action) => {
    setBusy(s.id);
    await supabase.from('signalements').update({ statut: action === 'traiter' ? 'traite' : 'rejete' }).eq('id', s.id);
    setBusy(null); charger();
  };

  const deciderAbo = async (d, ok) => {
    setBusy(d.id);
    await supabase.from('abonnements').update({ statut: ok ? 'valide' : 'refuse' }).eq('id', d.id);
    setBusy(null); charger();
  };

  const deciderBoost = async (d, action) => {
    setBusy(d.id);
    const { data: { session } } = await supabase.auth.getSession();
    const r = await fetch('/api/admin/boost', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.access_token}` },
      body: JSON.stringify({ demande_id: d.id, action }),
    });
    if (!r.ok) { const j = await r.json(); alert(j.error || 'Erreur'); }
    setBusy(null); charger();
  };

  const total = sig.length + abos.length + boosts.length + badges.length;
  const planNom = (code) => PLANS.find((p) => p.id === code)?.nom || code;

  if (!supabase) return <main className="sec"><div className="wrap"><div className="card">Configuration manquante.</div></div></main>;
  if (admin === null) return <main className="sec"><div className="wrap"><p className="muted">Chargement…</p></div></main>;
  if (admin === false) return (
    <main className="sec"><div className="wrap"><div className="card">
      <p style={{ margin: 0 }}>Cette page est réservée à l’équipe Ayôrôfa.</p>
      <Link className="btn btn-sm" href="/fil" style={{ marginTop: 10 }}>Retour au fil</Link>
    </div></div></main>
  );

  return (
    <main className="sec"><div className="wrap" style={{ maxWidth: 760 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <div style={{ marginRight: 'auto' }}>
          <p className="eyebrow">Administration</p>
          <h1 style={{ margin: 0 }}>Centre de contrôle</h1>
        </div>
        <button className="btn btn-sm btn-ghost" onClick={() => setSon(!son)}
          title="Signal sonore à l'arrivée d'un élément">{son ? '🔔 Son activé' : '🔕 Son coupé'}</button>
      </div>

      <div className={'centre-etat' + (total === 0 ? ' ok' : '')}>
        {total === 0
          ? <><strong>✓ Rien en attente.</strong> Tout est traité — cette page se met à jour toute seule.</>
          : <><strong>{total} élément{total > 1 ? 's' : ''} à traiter.</strong> Les nouveautés apparaissent ici en direct.</>}
      </div>

      <section style={{ marginTop: 22 }}>
        <h2 style={{ fontSize: '1.05rem' }}>
          🚩 Signalements {sig.length > 0 && <span className="onglet-n">{sig.length}</span>}
        </h2>
        <p className="muted sm" style={{ margin: '2px 0 10px' }}>
          À traiter en priorité : un contenu frauduleux laissé en ligne engage la plateforme.
        </p>
        {sig.length ? sig.map((s) => (
          <div key={s.id} className="card centre-item">
            <div style={{ flex: 1, minWidth: 0 }}>
              <strong>{s.motif || 'Signalement'}</strong>
              <p className="muted sm" style={{ margin: '3px 0 0' }}>
                Par {nomDe(s.signale_par)} · {ilya(s.created_at)}
                {s.cible_id && s.type === 'besoin'
                  ? <> · <Link href={`/annonce/${s.cible_id}`}>voir l’annonce ↗</Link></> : null}
                {s.auteur_cible
                  ? <> · <Link href={`/profil/${s.auteur_cible}`}>voir l’auteur ↗</Link></> : null}
              </p>
              {s.details && <p style={{ fontSize: '.9rem', margin: '6px 0 0' }}>{s.details}</p>}
            </div>
            <div className="centre-actions">
              <button className="btn btn-sm" disabled={busy === s.id}
                onClick={() => traiterSignalement(s, 'traiter')}>✓ Traité</button>
              <button className="btn btn-sm btn-ghost" disabled={busy === s.id}
                onClick={() => traiterSignalement(s, 'rejeter')}>Rejeter</button>
            </div>
          </div>
        )) : <p className="muted sm">Aucun signalement ouvert.</p>}
      </section>

      <section style={{ marginTop: 26 }}>
        <h2 style={{ fontSize: '1.05rem' }}>
          💳 Paiements d’abonnement {abos.length > 0 && <span className="onglet-n">{abos.length}</span>}
        </h2>
        <p className="muted sm" style={{ margin: '2px 0 10px' }}>
          Vérifiez la réception du paiement Mobile Money <strong>avant</strong> de valider.
        </p>
        {abos.length ? abos.map((d) => (
          <div key={d.id} className="card centre-item">
            <div style={{ flex: 1, minWidth: 0 }}>
              <strong>{planNom(d.plan)}</strong>
              <p className="muted sm" style={{ margin: '3px 0 0' }}>
                <Link href={`/profil/${d.utilisateur}`}>{nomDe(d.utilisateur)}</Link> · {ilya(d.created_at)}
                {d.montant ? ` · ${Number(d.montant).toLocaleString('fr-FR')} F` : ''}
                {d.reference ? ` · réf. ${d.reference}` : ''}
              </p>
            </div>
            <div className="centre-actions">
              <button className="btn btn-sm" disabled={busy === d.id} onClick={() => deciderAbo(d, true)}>✓ Valider</button>
              <button className="btn btn-sm btn-ghost" disabled={busy === d.id} onClick={() => deciderAbo(d, false)}>Refuser</button>
            </div>
          </div>
        )) : <p className="muted sm">Aucune demande en attente.</p>}
      </section>

      <section style={{ marginTop: 26 }}>
        <h2 style={{ fontSize: '1.05rem' }}>
          ✔ Demandes de badge {badges.length > 0 && <span className="onglet-n">{badges.length}</span>}
        </h2>
        <p className="muted sm" style={{ margin: '2px 0 10px' }}>
          Vérifiez l’identité et l’activité réelle <strong>avant</strong> d’accorder. Un badge accordé à la légère
          détruit la valeur de tous les autres.
        </p>
        {badges.length ? badges.map((d) => (
          <div key={d.id} className="card centre-item">
            <div style={{ flex: 1, minWidth: 0 }}>
              <strong>{nomDe(d.membre)}</strong> — demande le badge <strong>{d.badge}</strong>
              {d.message && <p className="sm" style={{ margin: '5px 0 0' }}>{d.message}</p>}
              <p className="muted sm" style={{ margin: '5px 0 0' }}>
                {d.telephone ? `☎ ${d.telephone} · ` : ''}{d.rccm ? `RCCM ${d.rccm} · ` : ''}
                <a href={`/profil/${d.membre}`} target="_blank" rel="noopener">voir le profil ↗</a>
              </p>
              {d.piece && (
                <p className="sm" style={{ margin: '5px 0 0' }}>
                  <a href={d.piece} target="_blank" rel="noopener">📎 Pièce justificative</a>
                </p>
              )}
            </div>
            <div className="centre-actions">
              <button className="btn btn-sm" onClick={() => deciderBadge(d, true)}>✓ Accorder</button>
              <button className="btn btn-sm btn-ghost" onClick={() => deciderBadge(d, false)}>✕ Refuser</button>
            </div>
          </div>
        )) : <p className="muted sm">Aucune demande en attente.</p>}
      </section>

      <section style={{ marginTop: 26 }}>
        <h2 style={{ fontSize: '1.05rem' }}>
          🚀 Boosts d’annonces {boosts.length > 0 && <span className="onglet-n">{boosts.length}</span>}
        </h2>
        <p className="muted sm" style={{ margin: '2px 0 10px' }}>
          1 000 F pour 7 jours — vérifiez la réception du paiement (réf. BOOST-…).
        </p>
        {boosts.length ? boosts.map((d) => (
          <div key={d.id} className="card centre-item">
            <div style={{ flex: 1, minWidth: 0 }}>
              <strong>réf. BOOST-{String(d.id).slice(0, 6).toUpperCase()}</strong>
              <p className="muted sm" style={{ margin: '3px 0 0' }}>
                <Link href={`/profil/${d.membre}`}>{nomDe(d.membre)}</Link> · {ilya(d.created_at)}
                {d.besoin ? <> · <Link href={`/annonce/${d.besoin}`}>voir l’annonce ↗</Link></> : null}
              </p>
            </div>
            <div className="centre-actions">
              <button className="btn btn-sm" disabled={busy === d.id} onClick={() => deciderBoost(d, 'valider')}>✓ Valider</button>
              <button className="btn btn-sm btn-ghost" disabled={busy === d.id} onClick={() => deciderBoost(d, 'refuser')}>Refuser</button>
            </div>
          </div>
        )) : <p className="muted sm">Aucun boost en attente.</p>}
      </section>

      <div style={{ display: 'flex', gap: 8, marginTop: 26, flexWrap: 'wrap' }}>
        <Link className="btn btn-sm btn-ghost" href="/tableau-de-bord">📊 Tableau de bord</Link>
        <Link className="btn btn-sm btn-ghost" href="/admin-moderation">Modération</Link>
        <Link className="btn btn-sm btn-ghost" href="/admin-plans">Historique des paiements</Link>
        <Link className="btn btn-sm btn-ghost" href="/admin">Annonces & vérifiés</Link>
      </div>

      <p className="mention-legale">
        Conservez une trace de vos décisions : traiter les signalements et pouvoir le prouver
        est ce qui protège le mieux la plateforme en cas de litige.
      </p>
    </div></main>
  );
}
