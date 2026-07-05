'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { metierBySlug } from '@/data/metiers';
import { ilya } from '@/lib/meta';

const TYPE_LABEL = { entreprise: 'Entreprise', particulier: 'Particulier', chercheur: "Chercheur d'emploi" };
const ghost = { background: 'transparent', border: '1px solid var(--line)', color: 'var(--text)' };

export default function Profil({ params }) {
  const id = params.id;
  const [p, setP] = useState(null);
  const [me, setMe] = useState(null);
  const [avis, setAvis] = useState([]);
  const [note, setNote] = useState(5);
  const [texte, setTexte] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await supabase.from('profiles').select('*').eq('id', id).maybeSingle();
    setP(data);
    const { data: av } = await supabase.from('avis').select('*').eq('cible', id).order('created_at', { ascending: false });
    const ids = [...new Set((av || []).map((a) => a.auteur))]; let nm = {};
    if (ids.length) { const { data: ps } = await supabase.from('profiles').select('id,nom').in('id', ids); (ps || []).forEach((x) => { nm[x.id] = x.nom || 'Utilisateur'; }); }
    setAvis((av || []).map((a) => ({ ...a, nom: nm[a.auteur] || 'Utilisateur' })));
  };
  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    (async () => { const { data: { user } } = await supabase.auth.getUser(); setMe(user?.id || null); await load(); setLoading(false); })();
  }, [id]);

  const submitAvis = async (e) => {
    e.preventDefault(); setMsg('');
    if (!me) { window.location.href = '/connexion'; return; }
    const { error } = await supabase.from('avis').upsert({ cible: id, auteur: me, note, texte }, { onConflict: 'cible,auteur' });
    if (error) { setMsg(error.message); return; }
    setTexte(''); await load();
  };

  if (!supabase) return <main className="sec"><div className="wrap"><div className="card">Configuration Supabase manquante.</div></div></main>;
  if (loading) return <main className="sec"><div className="wrap"><p className="muted">Chargement…</p></div></main>;
  if (!p) return <main className="sec"><div className="wrap"><div className="card">Profil introuvable.</div></div></main>;

  const interets = (p.interets || []).map((s) => metierBySlug(s)?.name || s);
  const moy = avis.length ? (avis.reduce((s, a) => s + a.note, 0) / avis.length).toFixed(1) : null;

  return (
    <main className="sec"><div className="wrap" style={{ maxWidth: 760 }}>
      <div className="card">
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          {p.avatar_url
            ? <img src={p.avatar_url} alt={p.nom} style={{ width: 74, height: 74, borderRadius: '50%', objectFit: 'cover' }} />
            : <div className="pro-avatar" style={{ width: 74, height: 74, fontSize: '1.8rem' }}>{(p.nom || 'U').charAt(0)}</div>}
          <div>
            <h1 style={{ margin: 0 }}>{p.nom || 'Utilisateur'}</h1>
            <p className="muted">{TYPE_LABEL[p.type] || p.type}{p.ville ? ` · ${p.ville}` : ''}{moy ? ` · ★ ${moy} (${avis.length})` : ''}</p>
          </div>
          {me && me !== id && <a className="btn btn-sm" href={`/messages?to=${id}`} style={{ marginLeft: 'auto' }}>Contacter</a>}
          {me === id && <Link className="btn btn-sm" href="/profil/modifier" style={{ ...ghost, marginLeft: 'auto' }}>Modifier</Link>}
        </div>
        {p.bio && <p style={{ marginTop: 14 }}>{p.bio}</p>}
        {interets.length > 0 && <p className="muted sm" style={{ marginTop: 8 }}>Centres d’intérêt : {interets.join(', ')}</p>}
      </div>

      <div style={{ marginTop: 26 }}>
        <p className="eyebrow">Avis</p>
        <h2>Ce qu’on pense de {p.nom || 'ce profil'}</h2>
        {me && me !== id && (
          <form className="card" onSubmit={submitAvis} style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: 600, fontSize: '.9rem' }}>Votre note
              <select value={note} onChange={(e) => setNote(Number(e.target.value))} style={{ marginLeft: 10, padding: 6, borderRadius: 8, border: '1px solid var(--line)' }}>
                {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{'★'.repeat(n)}</option>)}
              </select>
            </label>
            <textarea value={texte} onChange={(e) => setTexte(e.target.value)} rows={3} placeholder="Votre avis…" style={{ width: '100%', marginTop: 10, padding: 10, border: '1px solid var(--line)', borderRadius: 9, fontFamily: 'inherit' }} />
            {msg && <div style={{ color: '#b3261e', marginTop: 6 }}>{msg}</div>}
            <button className="btn btn-sm" type="submit" style={{ marginTop: 10 }}>Publier mon avis</button>
          </form>
        )}
        {avis.length ? avis.map((a) => (
          <div key={a.id} className="card" style={{ marginBottom: 10 }}>
            <p style={{ margin: 0 }}><strong>{a.nom}</strong> · <span className="stars">{'★'.repeat(a.note)}</span> <span className="muted sm">{ilya(a.created_at)}</span></p>
            {a.texte && <p style={{ margin: '6px 0 0' }}>{a.texte}</p>}
          </div>
        )) : <p className="muted">Pas encore d’avis.</p>}
      </div>
    </div></main>
  );
}
