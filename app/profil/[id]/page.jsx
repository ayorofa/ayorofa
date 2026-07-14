'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { metierBySlug } from '@/data/metiers';
import { ilya } from '@/lib/meta';
import Avatar from '@/components/Avatar';
import BadgeVerifie from '@/components/BadgeVerifie';
import Presence from '@/components/Presence';
import BoutonReseau from '@/components/BoutonReseau';
import BesoinCard from '@/components/BesoinCard';

const TYPE_LABEL = { entreprise: 'Entreprise', particulier: 'Particulier', chercheur: "Chercheur d'emploi" };

export default function Profil({ params }) {
  const id = params.id;
  const [p, setP] = useState(null);
  const [me, setMe] = useState(null);
  const [stats, setStats] = useState({ reseau: 0, abonnes: 0, abonnements: 0, annonces: 0 });
  const [posts, setPosts] = useState([]);
  const [avis, setAvis] = useState([]);
  const [note, setNote] = useState(5);
  const [texte, setTexte] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);
  // liste (abonnés / abonnements / réseau)
  const [liste, setListe] = useState(null);      // null | 'reseau' | 'abonnes' | 'abonnements'
  const [membres, setMembres] = useState([]);
  const [listeCharge, setListeCharge] = useState(false);

  const load = async () => {
    const { data } = await supabase.from('profiles').select('*').eq('id', id).maybeSingle();
    setP(data);

    const [cx1, cx2, ab, abm, an] = await Promise.all([
      supabase.from('connexions').select('id', { count: 'exact', head: true }).eq('demandeur', id).eq('statut', 'acceptee'),
      supabase.from('connexions').select('id', { count: 'exact', head: true }).eq('destinataire', id).eq('statut', 'acceptee'),
      supabase.from('abonnes').select('id', { count: 'exact', head: true }).eq('suivi', id),
      supabase.from('abonnes').select('id', { count: 'exact', head: true }).eq('suiveur', id),
      supabase.from('besoins').select('id', { count: 'exact', head: true }).eq('auteur', id),
    ]);
    setStats({
      reseau: (cx1.count || 0) + (cx2.count || 0),
      abonnes: ab.count || 0,
      abonnements: abm.count || 0,
      annonces: an.count || 0,
    });

    const { data: bs } = await supabase.from('besoins').select('*')
      .eq('auteur', id).order('created_at', { ascending: false }).limit(3);
    setPosts(bs || []);

    const { data: av } = await supabase.from('avis').select('*').eq('cible', id)
      .order('created_at', { ascending: false }).limit(20);
    const ids = [...new Set((av || []).map((a) => a.auteur))];
    let nm = {};
    if (ids.length) {
      const { data: ps } = await supabase.from('profiles').select('id,nom,avatar_url').in('id', ids);
      (ps || []).forEach((x) => { nm[x.id] = x; });
    }
    setAvis((av || []).map((a) => ({ ...a, prof: nm[a.auteur] || { nom: 'Utilisateur' } })));
  };

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setMe(user ? user.id : null);
      await load();
      setLoading(false);
    })();
  }, [id]);

  // Ouvrir une liste (abonnés / abonnements / réseau)
  const ouvrirListe = async (quoi) => {
    setListe(quoi); setListeCharge(false); setMembres([]);
    let ids = [];
    if (quoi === 'abonnes') {
      const { data } = await supabase.from('abonnes').select('suiveur').eq('suivi', id);
      ids = (data || []).map((x) => x.suiveur);
    } else if (quoi === 'abonnements') {
      const { data } = await supabase.from('abonnes').select('suivi').eq('suiveur', id);
      ids = (data || []).map((x) => x.suivi);
    } else {
      const [{ data: d1 }, { data: d2 }] = await Promise.all([
        supabase.from('connexions').select('destinataire').eq('demandeur', id).eq('statut', 'acceptee'),
        supabase.from('connexions').select('demandeur').eq('destinataire', id).eq('statut', 'acceptee'),
      ]);
      ids = [...(d1 || []).map((x) => x.destinataire), ...(d2 || []).map((x) => x.demandeur)];
    }
    ids = [...new Set(ids)].slice(0, 50);
    if (ids.length) {
      const { data: ps } = await supabase.from('profiles')
        .select('id,nom,avatar_url,type,ville,verifie').in('id', ids);
      setMembres(ps || []);
    }
    setListeCharge(true);
  };

  const submitAvis = async (e) => {
    e.preventDefault();
    setMsg('');
    if (!me) { window.location.href = '/inscription'; return; }
    const { error } = await supabase.from('avis')
      .upsert({ cible: id, auteur: me, note, texte }, { onConflict: 'cible,auteur' });
    if (error) { setMsg(error.message); return; }
    setTexte('');
    await load();
  };

  if (!supabase) return <main className="sec"><div className="wrap"><div className="card">Configuration Supabase manquante.</div></div></main>;
  if (loading) return <main className="sec"><div className="wrap"><p className="muted">Chargement…</p></div></main>;
  if (!p) return <main className="sec"><div className="wrap"><div className="card">Profil introuvable.</div></div></main>;

  const interets = (p.interets || []).map((s) => (metierBySlug(s) ? metierBySlug(s).name : s));
  const moy = avis.length ? (avis.reduce((s, a) => s + a.note, 0) / avis.length).toFixed(1) : null;
  const enLigne = p.derniere_activite && (Date.now() - new Date(p.derniere_activite).getTime()) / 1000 < 300;
  const TITRES = { reseau: 'Son réseau', abonnes: 'Abonnés', abonnements: 'Abonnements' };

  return (
    <main className="sec profil-page"><div className="wrap" style={{ maxWidth: 720, paddingTop: 0 }}>

      {/* ── Bannière + carte d'identité (façon LinkedIn, à l'ivoirienne) ── */}
      <div className="profil-hero card">
        <div className="cover" aria-hidden="true">
          <span className="cover-motif" />
        </div>
        <div className="profil-id">
          <div className="profil-photo">
            <Avatar url={p.avatar_url} nom={p.nom} size={96} />
            {enLigne && <span className="pastille-on" style={{ width: 20, height: 20 }} />}
          </div>
          <div className="post-n" style={{ marginTop: 8 }}>
            <h1 style={{ margin: 0, fontSize: '1.45rem' }}>{p.nom || 'Utilisateur'}</h1>
            {p.verifie && <BadgeVerifie size="sm" />}
          </div>
          {p.bio && <p className="profil-titre">{p.bio}</p>}
          <p className="muted sm" style={{ margin: '4px 0 0' }}>
            {TYPE_LABEL[p.type] || p.type}{p.ville ? ` · ${p.ville}, Côte d’Ivoire` : ' · Côte d’Ivoire'}
            {moy ? ` · ★ ${moy} (${avis.length})` : ''}
          </p>
          <Presence date={p.derniere_activite} />

          {/* Statistiques cliquables */}
          <div className="stats-bar">
            <button onClick={() => ouvrirListe('reseau')}>
              <span className="stat-n">{stats.reseau}</span><span className="stat-l">Réseau</span>
            </button>
            <button onClick={() => ouvrirListe('abonnes')}>
              <span className="stat-n">{stats.abonnes}</span><span className="stat-l">Abonnés</span>
            </button>
            <button onClick={() => ouvrirListe('abonnements')}>
              <span className="stat-n">{stats.abonnements}</span><span className="stat-l">Abonnements</span>
            </button>
            <span className="stat-fix">
              <span className="stat-n">{stats.annonces}</span><span className="stat-l">Annonces</span>
            </span>
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
            {me === id ? (
              <Link className="btn" href="/espace">Modifier mon profil</Link>
            ) : (
              <>
                <BoutonReseau cibleId={id} me={me} />
                {me && <a className="btn btn-ghost" href={`/messages?to=${id}`}>Message</a>}
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── À propos ── */}
      {p.bio && (
        <div className="card" style={{ marginTop: 14 }}>
          <h2 className="profil-h2">À propos</h2>
          <p style={{ margin: '8px 0 0' }}>{p.bio}</p>
        </div>
      )}

      {/* ── Centres d'intérêt ── */}
      {interets.length > 0 && (
        <div className="card" style={{ marginTop: 14 }}>
          <h2 className="profil-h2">Centres d’intérêt</h2>
          <div className="chips" style={{ marginTop: 10 }}>
            {interets.map((i) => <span key={i} className="chip on" style={{ cursor: 'default' }}>{i}</span>)}
          </div>
        </div>
      )}

      {/* ── Activité (ses annonces) ── */}
      <div style={{ marginTop: 22 }}>
        <h2 className="profil-h2">Activité</h2>
        {posts.length ? (
          <div style={{ display: 'grid', gap: 14, marginTop: 10 }}>
            {posts.map((b) => <BesoinCard key={b.id} b={b} me={me} />)}
          </div>
        ) : (
          <div className="card" style={{ marginTop: 10 }}>
            <p className="muted" style={{ margin: 0 }}>
              {me === id ? 'Vous n’avez encore rien publié.' : 'Aucune publication pour l’instant.'}
            </p>
            {me === id && <Link className="btn btn-sm" href="/publier" style={{ marginTop: 10 }}>Publier ma première annonce</Link>}
          </div>
        )}
      </div>

      {/* ── Avis ── */}
      <div style={{ marginTop: 26 }}>
        <h2 className="profil-h2">Avis {moy ? <span className="stars" style={{ fontSize: '1rem' }}>★ {moy}</span> : ''}</h2>

        {me && me !== id && (
          <form className="card" onSubmit={submitAvis} style={{ margin: '10px 0 14px' }}>
            <label style={{ fontWeight: 600, fontSize: '.9rem' }}>Votre note
              <select value={note} onChange={(e) => setNote(Number(e.target.value))}
                style={{ marginLeft: 10, padding: 8, borderRadius: 9, border: '1px solid var(--line)', fontSize: 16 }}>
                {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{'★'.repeat(n)}</option>)}
              </select>
            </label>
            <textarea value={texte} onChange={(e) => setTexte(e.target.value)} rows={3} placeholder="Votre avis…"
              style={{ width: '100%', marginTop: 10, padding: 11, border: '1px solid var(--line)', borderRadius: 11, fontFamily: 'inherit', fontSize: 16 }} />
            {msg && <div style={{ color: '#b3261e', marginTop: 6 }}>{msg}</div>}
            <button className="btn btn-sm" type="submit" style={{ marginTop: 10 }}>Publier mon avis</button>
          </form>
        )}

        {avis.length ? avis.map((a) => (
          <div key={a.id} className="card" style={{ marginBottom: 10, display: 'flex', gap: 11 }}>
            <Avatar url={a.prof.avatar_url} nom={a.prof.nom} size={38} href={`/profil/${a.auteur}`} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0 }}>
                <Link href={`/profil/${a.auteur}`}><strong>{a.prof.nom}</strong></Link>{' '}
                <span className="stars">{'★'.repeat(a.note)}</span>{' '}
                <span className="muted sm">{ilya(a.created_at)}</span>
              </p>
              {a.texte && <p style={{ margin: '4px 0 0' }}>{a.texte}</p>}
            </div>
          </div>
        )) : <p className="muted" style={{ marginTop: 8 }}>Pas encore d’avis.</p>}
      </div>

      {/* ── Liste abonnés / abonnements / réseau ── */}
      {liste && (
        <div className="modal-bg" onClick={() => setListe(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-label={TITRES[liste]}>
            <h3 style={{ marginBottom: 10 }}>{TITRES[liste]}</h3>
            {!listeCharge ? (
              <p className="muted">Chargement…</p>
            ) : membres.length ? (
              <div style={{ display: 'grid', gap: 10, maxHeight: '55vh', overflowY: 'auto' }}>
                {membres.map((m) => (
                  <div key={m.id} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <Avatar url={m.avatar_url} nom={m.nom} size={40} href={`/profil/${m.id}`} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Link href={`/profil/${m.id}`} onClick={() => setListe(null)}>
                        <strong>{m.nom || 'Utilisateur'}</strong>
                      </Link>
                      {m.verifie && <BadgeVerifie size="sm" />}
                      <p className="muted sm" style={{ margin: 0 }}>
                        {TYPE_LABEL[m.type] || m.type}{m.ville ? ` · ${m.ville}` : ''}
                      </p>
                    </div>
                    {me && me !== m.id && <BoutonReseau cibleId={m.id} me={me} petit />}
                  </div>
                ))}
              </div>
            ) : (
              <p className="muted">Personne pour l’instant.</p>
            )}
            <button className="btn btn-sm" style={{ marginTop: 14 }} onClick={() => setListe(null)}>Fermer</button>
          </div>
        </div>
      )}
    </div></main>
  );
}
