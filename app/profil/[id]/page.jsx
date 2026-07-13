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

const TYPE_LABEL = { entreprise: 'Entreprise', particulier: 'Particulier', chercheur: "Chercheur d'emploi" };

export default function Profil({ params }) {
  const id = params.id;
  const [p, setP] = useState(null);
  const [me, setMe] = useState(null);
  const [avis, setAvis] = useState([]);
  const [stats, setStats] = useState({ abonnes: 0, abonnements: 0, annonces: 0 });
  const [note, setNote] = useState(5);
  const [texte, setTexte] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await supabase.from('profiles').select('*').eq('id', id).maybeSingle();
    setP(data);

    const [{ count: ab }, { count: abm }, { count: an }] = await Promise.all([
      supabase.from('abonnes').select('id', { count: 'exact', head: true }).eq('suivi', id),
      supabase.from('abonnes').select('id', { count: 'exact', head: true }).eq('suiveur', id),
      supabase.from('besoins').select('id', { count: 'exact', head: true }).eq('auteur', id),
    ]);
    setStats({ abonnes: ab || 0, abonnements: abm || 0, annonces: an || 0 });

    const { data: av } = await supabase.from('avis').select('*').eq('cible', id)
      .order('created_at', { ascending: false });
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

  return (
    <main className="sec"><div className="wrap" style={{ maxWidth: 720 }}>
      <div className="card">
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div className="membre-av">
            <Avatar url={p.avatar_url} nom={p.nom} size={84} />
            {p.derniere_activite && (Date.now() - new Date(p.derniere_activite).getTime()) / 1000 < 300 && (
              <span className="pastille-on" style={{ width: 18, height: 18 }} />
            )}
          </div>
          <div style={{ flex: 1, minWidth: 180 }}>
            <div className="post-n">
              <h1 style={{ margin: 0, fontSize: '1.5rem' }}>{p.nom || 'Utilisateur'}</h1>
              {p.verifie && <BadgeVerifie size="sm" />}
            </div>
            <p className="muted sm" style={{ margin: '4px 0' }}>
              {TYPE_LABEL[p.type] || p.type}{p.ville ? ` · ${p.ville}` : ''}{moy ? ` · ★ ${moy} (${avis.length})` : ''}
            </p>
            <Presence date={p.derniere_activite} />
          </div>
        </div>

        <div className="stats-profil">
          <div><div className="stat-n">{stats.abonnes}</div><div className="stat-l">Abonnés</div></div>
          <div><div className="stat-n">{stats.abonnements}</div><div className="stat-l">Abonnements</div></div>
          <div><div className="stat-n">{stats.annonces}</div><div className="stat-l">Annonces</div></div>
        </div>

        {p.bio && <p style={{ marginTop: 14 }}>{p.bio}</p>}
        {interets.length > 0 && (
          <p className="muted sm" style={{ marginTop: 8 }}>Centres d’intérêt : {interets.join(', ')}</p>
        )}

        <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
          <BoutonReseau cibleId={id} me={me} />
          {me && me !== id && <a className="btn btn-ghost" href={`/messages?to=${id}`}>Envoyer un message</a>}
          {me === id && <Link className="btn btn-ghost" href="/profil/modifier">Modifier mon profil</Link>}
        </div>
      </div>

      <div style={{ marginTop: 26 }}>
        <p className="eyebrow">Avis</p>
        <h2>Ce qu’on pense de {p.nom || 'ce profil'}</h2>

        {me && me !== id && (
          <form className="card" onSubmit={submitAvis} style={{ marginBottom: 16 }}>
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
        )) : <p className="muted">Pas encore d’avis.</p>}
      </div>
    </div></main>
  );
}
