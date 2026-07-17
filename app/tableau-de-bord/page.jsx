'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import GraphBarres from '@/components/GraphBarres';

const MOIS = ['jan', 'fév', 'mar', 'avr', 'mai', 'juin', 'juil', 'août', 'sep', 'oct', 'nov', 'déc'];
const BADGES = [
  ['expert', '🏆 Expert'], ['top', '⭐ Top Prestataire'], ['premium', '💎 Premium'], ['partenaire', '👑 Partenaire'],
];

export default function TableauDeBord() {
  const [me, setMe] = useState(null);
  const [admin, setAdmin] = useState(false);
  const [s, setS] = useState(null);
  const [graph, setGraph] = useState([]);
  const [global_, setGlobal] = useState(null);
  const [boosts, setBoosts] = useState([]);
  // attribution badges
  const [email, setEmail] = useState('');
  const [choix, setChoix] = useState([]);
  const [bmsg, setBmsg] = useState('');
  const [bbusy, setBbusy] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = '/connexion'; return; }
      setMe(user.id);

      const [prof, vues, abonnes, annonces, rx, cmts, devisEnv, devisRecus, favs] = await Promise.all([
        supabase.from('profiles').select('is_admin,nom').eq('id', user.id).maybeSingle(),
        supabase.from('vues_profils').select('n').eq('cible', user.id).maybeSingle(),
        supabase.from('abonnes').select('id', { count: 'exact', head: true }).eq('suivi', user.id),
        supabase.from('besoins').select('id,created_at').eq('auteur', user.id),
        supabase.from('reactions').select('id, besoins!inner(auteur)', { count: 'exact', head: true }).eq('besoins.auteur', user.id),
        supabase.from('commentaires').select('id, besoins!inner(auteur)', { count: 'exact', head: true }).eq('besoins.auteur', user.id),
        supabase.from('demandes_devis').select('id', { count: 'exact', head: true }).eq('client', user.id),
        supabase.from('devis').select('id', { count: 'exact', head: true }).eq('pro', user.id),
        supabase.from('favoris').select('id', { count: 'exact', head: true }).eq('proprietaire', user.id),
      ]);

      setAdmin(!!prof.data?.is_admin);
      const posts = annonces.data || [];
      setS({
        vues: vues.data?.n || 0,
        abonnes: abonnes.count || 0,
        annonces: posts.length,
        reactions: rx.count || 0,
        commentaires: cmts.count || 0,
        devisEnvoyes: devisRecus.count || 0,
        demandes: devisEnv.count || 0,
        favoris: favs.count || 0,
      });

      // publications sur 6 mois
      const now = new Date();
      const buckets = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        buckets.push({ y: d.getFullYear(), m: d.getMonth(), l: MOIS[d.getMonth()], v: 0 });
      }
      posts.forEach((p) => {
        const d = new Date(p.created_at);
        const b = buckets.find((x) => x.y === d.getFullYear() && x.m === d.getMonth());
        if (b) b.v++;
      });
      setGraph(buckets.map(({ l, v }) => ({ l, v })));

      if (prof.data?.is_admin) {
        const [{ count: nm }, { count: na }, { count: nd }, { count: nsig }] = await Promise.all([
          supabase.from('profiles').select('id', { count: 'exact', head: true }),
          supabase.from('besoins').select('id', { count: 'exact', head: true }),
          supabase.from('demandes_devis').select('id', { count: 'exact', head: true }),
          supabase.from('signalements').select('id', { count: 'exact', head: true }).eq('statut', 'nouveau'),
        ]);
        setGlobal({ membres: nm || 0, annonces: na || 0, devis: nd || 0, signalements: nsig || 0 });
        const { data: bo } = await supabase.from('demandes_boost')
          .select('id,besoin,membre,created_at,besoins(titre),profiles(nom)')
          .eq('statut', 'en_attente').order('created_at', { ascending: true });
        setBoosts(bo || []);
      }
    })();
  }, []);

  const deciderBoost = async (d, action) => {
    const { data: { session } } = await supabase.auth.getSession();
    const r = await fetch('/api/admin/boost', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.access_token}` },
      body: JSON.stringify({ demande_id: d.id, action }),
    });
    if (r.ok) setBoosts((l) => l.filter((x) => x.id !== d.id));
    else { const j = await r.json(); alert(j.error || 'Erreur'); }
  };

  const attribuer = async (e) => {
    e.preventDefault();
    setBmsg(''); setBbusy(true);
    const { data: { session } } = await supabase.auth.getSession();
    const r = await fetch('/api/admin/badges', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.access_token}` },
      body: JSON.stringify({ email: email.trim(), badges: choix }),
    });
    const j = await r.json();
    setBbusy(false);
    setBmsg(j.ok ? `✓ Badges mis à jour pour ${email} : ${choix.length ? choix.join(', ') : 'aucun (retirés)'}` : `✗ ${j.error}`);
  };

  const Carte = ({ n, l, href }) => {
    const inner = (
      <div className="dash-carte card">
        <span className="dash-n">{n}</span>
        <span className="dash-l">{l}</span>
      </div>
    );
    return href ? <Link href={href} style={{ display: 'block' }}>{inner}</Link> : inner;
  };

  if (!supabase) return <main className="sec"><div className="wrap"><div className="card">Configuration manquante.</div></div></main>;

  return (
    <main className="sec"><div className="wrap" style={{ maxWidth: 720 }}>
      <p className="eyebrow">Mon activité</p>
      <h1>Tableau de bord</h1>

      {!s ? <p className="muted" style={{ marginTop: 14 }}>Chargement…</p> : (
        <>
          <div className="dash-grille">
            <Carte n={s.vues} l="Vues du profil" />
            <Carte n={s.abonnes} l="Abonnés" href={`/profil/${me}`} />
            <Carte n={s.annonces} l="Publications" />
            <Carte n={s.reactions} l="Réactions reçues" />
            <Carte n={s.commentaires} l="Commentaires reçus" />
            <Carte n={s.devisEnvoyes} l="Devis envoyés (pro)" href="/devis" />
            <Carte n={s.demandes} l="Demandes de devis" href="/devis" />
            <Carte n={s.favoris} l="Profils enregistrés" href="/favoris" />
          </div>

          <div className="card" style={{ marginTop: 16 }}>
            <h2 style={{ fontSize: '1.05rem', margin: '0 0 6px' }}>Mes publications — 6 derniers mois</h2>
            <GraphBarres donnees={graph} />
          </div>

          <div className="card" style={{ marginTop: 14, background: '#FFFDF6' }}>
            <p style={{ margin: 0, fontSize: '.93rem' }}>
              🧾 <Link href="/factures"><strong>Mes reçus & factures</strong></Link> · abonnements et paiements.<br />💡 <strong>Pour faire grimper ces chiffres :</strong> complétez votre <Link href="/profil/modifier"><strong>profil pro</strong></Link> (compétences,
              portfolio, zone), publiez régulièrement, et répondez vite aux <Link href="/devis"><strong>demandes de devis</strong></Link>.
            </p>
          </div>

          {admin && global_ && (
            <div style={{ marginTop: 26 }}>
              <p className="eyebrow">Administration</p>
              <h2 style={{ margin: 0 }}>La plateforme en un coup d’œil</h2>
              <div className="dash-grille" style={{ marginTop: 12 }}>
                <Carte n={global_.membres} l="Membres inscrits" />
                <Carte n={global_.annonces} l="Annonces totales" />
                <Carte n={global_.devis} l="Demandes de devis" />
                <Carte n={global_.signalements} l="Signalements à traiter" href="/admin-moderation" />
              </div>

              <div className="card" style={{ marginTop: 14 }}>
                <h3 style={{ margin: '0 0 8px', fontSize: '1rem' }}>
                  🚀 Boosts à valider {boosts.length > 0 && <span className="onglet-n">{boosts.length}</span>}
                </h3>
                {boosts.length ? (
                  <div style={{ display: 'grid', gap: 8 }}>
                    {boosts.map((d) => (
                      <div key={d.id} className="boost-ligne">
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <strong>{d.besoins?.titre || 'Annonce'}</strong>
                          <p className="muted sm" style={{ margin: 0 }}>par {d.profiles?.nom || 'membre'} · réf. BOOST-{d.id.slice(0, 6).toUpperCase()}</p>
                        </div>
                        <button className="btn btn-sm" onClick={() => deciderBoost(d, 'valider')}>✓ Valider</button>
                        <button className="btn btn-sm btn-ghost" onClick={() => deciderBoost(d, 'refuser')}>✕</button>
                      </div>
                    ))}
                  </div>
                ) : <p className="muted sm" style={{ margin: 0 }}>Aucune demande de boost en attente. Vérifiez le paiement Mobile Money (réf. BOOST-…) avant de valider.</p>}
              </div>

              <form className="card form" onSubmit={attribuer} style={{ marginTop: 14 }}>
                <h3 style={{ margin: 0, fontSize: '1rem' }} className="full">Attribuer des badges pro</h3>
                <label className="full">Email du membre
                  <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="membre@exemple.com" />
                </label>
                <div className="full chips">
                  {BADGES.map(([v, l]) => (
                    <button key={v} type="button" className={'chip' + (choix.includes(v) ? ' on' : '')}
                      onClick={() => setChoix((c) => c.includes(v) ? c.filter((x) => x !== v) : [...c, v])}>{l}</button>
                  ))}
                </div>
                <p className="muted sm full" style={{ margin: 0 }}>Cochez les badges à donner (aucun coché = tout retirer).</p>
                {bmsg && <div className="full" style={{ color: bmsg.startsWith('✓') ? '#1A6B50' : '#b3261e' }}>{bmsg}</div>}
                <button className="btn full" type="submit" disabled={bbusy}>{bbusy ? '…' : 'Appliquer'}</button>
              </form>

              <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                <Link className="btn btn-sm btn-ghost" href="/admin">Annonces & vérifiés</Link>
                <Link className="btn btn-sm btn-ghost" href="/admin-plans">Paiements & plans</Link>
                <Link className="btn btn-sm btn-ghost" href="/admin-moderation">Modération</Link>
              </div>
            </div>
          )}
        </>
      )}
    </div></main>
  );
}
