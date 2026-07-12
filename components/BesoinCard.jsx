'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { metierBySlug } from '@/data/metiers';
import { BTYPE, ilya } from '@/lib/meta';

const ghost = { background: 'transparent', border: '1px solid var(--line)', color: 'var(--text)' };

export default function BesoinCard({ b, me }) {
  const t = BTYPE[b.type] || { label: b.type, color: '#666' };
  const m = metierBySlug(b.metier);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [author, setAuthor] = useState('Utilisateur');
  const [showC, setShowC] = useState(false);
  const [comments, setComments] = useState([]);
  const [ctext, setCtext] = useState('');

  useEffect(() => {
    if (!supabase) return;
    (async () => {
      const { count } = await supabase.from('reactions').select('id', { count: 'exact', head: true }).eq('besoin', b.id);
      setLikes(count || 0);
      if (me) { const { data } = await supabase.from('reactions').select('id').eq('besoin', b.id).eq('auteur', me).maybeSingle(); setLiked(!!data); }
      const { data: pa } = await supabase.from('profiles').select('nom').eq('id', b.auteur).maybeSingle();
      setAuthor((pa && pa.nom) || 'Utilisateur');
    })();
  }, [b.id, me]);

  const toggleLike = async () => {
    if (!me) { window.location.href = '/connexion'; return; }
    if (liked) { await supabase.from('reactions').delete().eq('besoin', b.id).eq('auteur', me); setLiked(false); setLikes((x) => x - 1); }
    else { await supabase.from('reactions').insert({ besoin: b.id, auteur: me }); setLiked(true); setLikes((x) => x + 1); }
  };
  const loadComments = async () => {
    const { data } = await supabase.from('commentaires').select('*').eq('besoin', b.id).order('created_at', { ascending: true });
    const ids = [...new Set((data || []).map((c) => c.auteur))]; let nm = {};
    if (ids.length) { const { data: ps } = await supabase.from('profiles').select('id,nom').in('id', ids); (ps || []).forEach((p) => { nm[p.id] = p.nom || 'Utilisateur'; }); }
    setComments((data || []).map((c) => ({ ...c, nom: nm[c.auteur] || 'Utilisateur' })));
  };
  const openC = async () => { const n = !showC; setShowC(n); if (n) await loadComments(); };
  const addComment = async (e) => {
    e.preventDefault(); if (!ctext.trim()) return;
    if (!me) { window.location.href = '/connexion'; return; }
    await supabase.from('commentaires').insert({ besoin: b.id, auteur: me, texte: ctext.trim() }); setCtext(''); await loadComments();
  };
  const interesse = async () => {
    if (!me) { window.location.href = '/connexion'; return; }
    await supabase.from('notifications').insert({ destinataire: b.auteur, besoin: b.id }); alert('Votre intérêt a été envoyé ✓');
  };
  const contactHref = b.contact
    ? 'https://wa.me/' + String(b.contact).replace(/\D/g, '')
    : '/messages?to=' + b.auteur;

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
        <span className="badge" style={{ color: t.color, background: t.color + '1a' }}>{t.label}</span>
        <span className="muted sm">{ilya(b.created_at)}</span>
      </div>
      <h3 style={{ margin: '8px 0 4px' }}>{b.titre}</h3>
      <p className="muted sm">
        {b.contact ? author : <Link href={`/profil/${b.auteur}`}>{author}</Link>}
        {' · '}{m ? m.name : b.metier}{b.ville ? ` · ${b.ville}` : ''}
      </p>
      {b.source && <p className="muted sm" style={{ marginTop: 2 }}>Repéré par Ayôrôfa · {b.source}</p>}
      {b.description && <p style={{ marginTop: 8 }}>{b.description}</p>}
      {b.lien && <p style={{ marginTop: 6 }}><a href={b.lien} target="_blank" rel="noopener">Voir l’annonce d’origine ↗</a></p>}
      <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
        <button className="btn btn-sm" style={liked ? {} : ghost} onClick={toggleLike}>👍 {likes}</button>
        <button className="btn btn-sm" style={ghost} onClick={openC}>💬 Commentaires</button>
        {b.auteur !== me && <button className="btn btn-sm" onClick={interesse}>Ça m’intéresse</button>}
        {b.auteur !== me && <a className="btn btn-sm" style={ghost} href={contactHref} target={b.contact ? '_blank' : undefined} rel="noopener">Contacter</a>}
      </div>
      {showC && (
        <div style={{ marginTop: 12, borderTop: '1px solid var(--line)', paddingTop: 12 }}>
          {comments.map((c) => (
            <div key={c.id} style={{ marginBottom: 8 }}>
              <Link href={`/profil/${c.auteur}`}><strong>{c.nom}</strong></Link> <span className="muted sm">{ilya(c.created_at)}</span>
              <div>{c.texte}</div>
            </div>
          ))}
          <form onSubmit={addComment} style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <input value={ctext} onChange={(e) => setCtext(e.target.value)} placeholder="Écrire un commentaire…" style={{ flex: 1, padding: 9, border: '1px solid var(--line)', borderRadius: 8, fontFamily: 'inherit' }} />
            <button className="btn btn-sm" type="submit">Envoyer</button>
          </form>
        </div>
      )}
    </div>
  );
}
