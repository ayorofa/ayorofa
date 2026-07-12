'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { metierBySlug } from '@/data/metiers';
import { BTYPE, ilya } from '@/lib/meta';
import Avatar from '@/components/Avatar';
import BadgeVerifie from '@/components/BadgeVerifie';

const ghost = { background: 'transparent', border: '1px solid var(--line)', color: 'var(--text)' };

export default function BesoinCard({ b, me }) {
  const t = BTYPE[b.type] || { label: b.type, color: '#666' };
  const m = metierBySlug(b.metier);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [auteur, setAuteur] = useState({ nom: 'Utilisateur', avatar_url: null, verifie: false });
  const [showC, setShowC] = useState(false);
  const [comments, setComments] = useState([]);
  const [ctext, setCtext] = useState('');

  useEffect(() => {
    if (!supabase) return;
    (async () => {
      const { count } = await supabase.from('reactions').select('id', { count: 'exact', head: true }).eq('besoin', b.id);
      setLikes(count || 0);
      if (me) {
        const { data } = await supabase.from('reactions').select('id').eq('besoin', b.id).eq('auteur', me).maybeSingle();
        setLiked(!!data);
      }
      const { data: pa } = await supabase.from('profiles').select('nom,avatar_url,verifie').eq('id', b.auteur).maybeSingle();
      if (pa) setAuteur({ nom: pa.nom || 'Utilisateur', avatar_url: pa.avatar_url, verifie: !!pa.verifie });
    })();
  }, [b.id, me]);

  const toggleLike = async () => {
    if (!me) { window.location.href = '/connexion'; return; }
    if (liked) { await supabase.from('reactions').delete().eq('besoin', b.id).eq('auteur', me); setLiked(false); setLikes((x) => x - 1); }
    else { await supabase.from('reactions').insert({ besoin: b.id, auteur: me }); setLiked(true); setLikes((x) => x + 1); }
  };
  const loadComments = async () => {
    const { data } = await supabase.from('commentaires').select('*').eq('besoin', b.id).order('created_at', { ascending: true });
    const ids = [...new Set((data || []).map((c) => c.auteur))];
    let nm = {};
    if (ids.length) {
      const { data: ps } = await supabase.from('profiles').select('id,nom,avatar_url').in('id', ids);
      (ps || []).forEach((p) => { nm[p.id] = { nom: p.nom || 'Utilisateur', avatar_url: p.avatar_url }; });
    }
    setComments((data || []).map((c) => ({ ...c, ...(nm[c.auteur] || { nom: 'Utilisateur', avatar_url: null }) })));
  };
  const openC = async () => { const n = !showC; setShowC(n); if (n) await loadComments(); };
  const addComment = async (e) => {
    e.preventDefault();
    if (!ctext.trim()) return;
    if (!me) { window.location.href = '/connexion'; return; }
    await supabase.from('commentaires').insert({ besoin: b.id, auteur: me, texte: ctext.trim() });
    setCtext(''); await loadComments();
  };
  const interesse = async () => {
    if (!me) { window.location.href = '/connexion'; return; }
    await supabase.from('notifications').insert({ destinataire: b.auteur, besoin: b.id });
    alert('Votre intérêt a été envoyé ✓');
  };
  const contactHref = b.contact
    ? 'https://wa.me/' + String(b.contact).replace(/\D/g, '')
    : '/messages?to=' + b.auteur;

  return (
    <div className="card">
      <div className="post-head">
        <Avatar url={auteur.avatar_url} nom={auteur.nom} size={44} href={b.contact ? undefined : `/profil/${b.auteur}`} />
        <div style={{ minWidth: 0, flex: 1 }}>
          <div className="post-n">
            {b.contact ? <strong>{auteur.nom}</strong> : <Link href={`/profil/${b.auteur}`}><strong>{auteur.nom}</strong></Link>}
            {auteur.verifie && <BadgeVerifie size="sm" />}
          </div>
          <p className="muted sm" style={{ margin: 0 }}>
            {m ? m.name : b.metier}{b.ville ? ` · ${b.ville}` : ''} · {ilya(b.created_at)}
          </p>
        </div>
        <span className="badge" style={{ color: t.color, background: t.color + '1a' }}>{t.label}</span>
      </div>

      <h3 style={{ margin: '10px 0 4px' }}>{b.titre}</h3>
      {b.source && <p className="muted sm" style={{ marginTop: 2 }}>Repéré par Ayôrôfa · {b.source}</p>}
      {b.description && <p style={{ marginTop: 6 }}>{b.description}</p>}
      {b.lien && <p style={{ marginTop: 6 }}><a href={b.lien} target="_blank" rel="noopener">Voir l’annonce d’origine ↗</a></p>}

      <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
        <button className="btn btn-sm" style={liked ? {} : ghost} onClick={toggleLike}>👍 {likes}</button>
        <button className="btn btn-sm" style={ghost} onClick={openC}>💬 Commentaires</button>
        {b.auteur !== me && <button className="btn btn-sm" onClick={interesse}>Ça m’intéresse</button>}
        {b.auteur !== me && <a className="btn btn-sm" style={ghost} href={contactHref} target={b.contact ? '_blank' : undefined} rel="noopener">Contacter</a>}
      </div>

      {showC && (
        <div style={{ marginTop: 14, borderTop: '1px solid var(--line)', paddingTop: 12 }}>
          {comments.map((c) => (
            <div key={c.id} className="cmt">
              <Avatar url={c.avatar_url} nom={c.nom} size={32} href={`/profil/${c.auteur}`} />
              <div className="cmt-b">
                <Link href={`/profil/${c.auteur}`}><strong>{c.nom}</strong></Link>{' '}
                <span className="muted sm">{ilya(c.created_at)}</span>
                <div>{c.texte}</div>
              </div>
            </div>
          ))}
          <form onSubmit={addComment} style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            <input value={ctext} onChange={(e) => setCtext(e.target.value)} placeholder="Écrire un commentaire…"
              style={{ flex: 1, padding: 11, border: '1px solid var(--line)', borderRadius: 10, fontFamily: 'inherit', fontSize: 16 }} />
            <button className="btn btn-sm" type="submit">Envoyer</button>
          </form>
        </div>
      )}
    </div>
  );
}
