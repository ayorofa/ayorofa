'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { metierBySlug } from '@/data/metiers';
import { BTYPE, ilya } from '@/lib/meta';
import Avatar from '@/components/Avatar';
import BadgeVerifie from '@/components/BadgeVerifie';
import Signaler from '@/components/Signaler';
import MediaView from '@/components/MediaView';
import TexteRiche from '@/components/TexteRiche';
import { uploadPieceJointe } from '@/lib/media';
import BadgesPro from '@/components/BadgesPro';
import EmojiPicker from '@/components/EmojiPicker';

const ghost = { background: 'transparent', border: '1px solid var(--line)', color: 'var(--text)' };

export default function BesoinCard({ b, me }) {
  const t = BTYPE[b.type] || { label: b.type, color: '#666' };
  const m = metierBySlug(b.metier);
  const [post, setPost] = useState(b);
  const [supprime, setSupprime] = useState(false);
  const [auteur, setAuteur] = useState({ nom: 'Utilisateur', avatar_url: null, verifie: false, badges: [] });
  const [rx, setRx] = useState({ total: 0, mine: null, top: [] });
  const [pickPost, setPickPost] = useState(false);
  const [showC, setShowC] = useState(false);
  const [comments, setComments] = useState([]);
  const [crx, setCrx] = useState({});
  const [pickCmt, setPickCmt] = useState(null);
  const [ctext, setCtext] = useState('');
  const [repondreA, setRepondreA] = useState(null);
  const [rtext, setRtext] = useState('');
  const [menu, setMenu] = useState(false);
  const [edition, setEdition] = useState(false);
  const [eTitre, setETitre] = useState(b.titre || '');
  const [eDesc, setEDesc] = useState(b.description || '');
  const [busy, setBusy] = useState(false);
  const [postulerOuvert, setPostulerOuvert] = useState(false);
  const [candMsg, setCandMsg] = useState('');
  const [candCV, setCandCV] = useState(null);
  const [candEtat, setCandEtat] = useState('');
  const [editCid, setEditCid] = useState(null);
  const [editCtxt, setEditCtxt] = useState('');

  const loadReactions = async () => {
    const { data } = await supabase.from('reactions').select('emoji,auteur').eq('besoin', b.id);
    const rows = data || [];
    const counts = {};
    rows.forEach((r) => { const e = r.emoji || '👍'; counts[e] = (counts[e] || 0) + 1; });
    const mine = me ? (rows.find((r) => r.auteur === me) || null) : null;
    setRx({
      total: rows.length,
      mine: mine ? (mine.emoji || '👍') : null,
      top: Object.keys(counts).sort((a, c) => counts[c] - counts[a]).slice(0, 3),
    });
  };

  useEffect(() => {
    if (!supabase) return;
    (async () => {
      await loadReactions();
      const { data: pa } = await supabase.from('profiles').select('nom,avatar_url,verifie,badges').eq('id', b.auteur).maybeSingle();
      if (pa) setAuteur({ nom: pa.nom || 'Utilisateur', avatar_url: pa.avatar_url, verifie: !!pa.verifie, badges: pa.badges || [] });
    })();
  }, [b.id, me]);

  const reagirPost = async (emoji) => {
    setPickPost(false);
    if (!me) { window.location.href = '/inscription'; return; }
    if (rx.mine === emoji) {
      await supabase.from('reactions').delete().eq('besoin', b.id).eq('auteur', me);
    } else {
      await supabase.from('reactions').upsert(
        { besoin: b.id, auteur: me, emoji }, { onConflict: 'besoin,auteur' });
    }
    await loadReactions();
  };

  const loadComments = async () => {
    const { data } = await supabase.from('commentaires').select('*').eq('besoin', b.id).order('created_at', { ascending: true });
    const rows = data || [];
    const ids = [...new Set(rows.map((c) => c.auteur))];
    let nm = {};
    if (ids.length) {
      const { data: ps } = await supabase.from('profiles').select('id,nom,avatar_url').in('id', ids);
      (ps || []).forEach((p) => { nm[p.id] = { nom: p.nom || 'Utilisateur', avatar_url: p.avatar_url }; });
    }
    setComments(rows.map((c) => ({ ...c, ...(nm[c.auteur] || { nom: 'Utilisateur', avatar_url: null }) })));
    const cids = rows.map((c) => c.id);
    if (cids.length) {
      const { data: cr } = await supabase.from('reactions_commentaires')
        .select('commentaire,emoji,auteur').in('commentaire', cids);
      const map = {};
      (cr || []).forEach((r) => {
        const k = r.commentaire;
        if (!map[k]) map[k] = { total: 0, mine: null, counts: {} };
        map[k].total++;
        map[k].counts[r.emoji] = (map[k].counts[r.emoji] || 0) + 1;
        if (me && r.auteur === me) map[k].mine = r.emoji;
      });
      Object.values(map).forEach((v) => {
        v.top = Object.keys(v.counts).sort((a, c) => v.counts[c] - v.counts[a]).slice(0, 3);
      });
      setCrx(map);
    } else setCrx({});
  };
  const openC = async () => { const n = !showC; setShowC(n); if (n) await loadComments(); };

  const reagirCommentaire = async (c, emoji) => {
    setPickCmt(null);
    if (!me) { window.location.href = '/inscription'; return; }
    const mien = crx[c.id] && crx[c.id].mine;
    if (mien === emoji) {
      await supabase.from('reactions_commentaires').delete().eq('commentaire', c.id).eq('auteur', me);
    } else {
      await supabase.from('reactions_commentaires').upsert(
        { commentaire: c.id, auteur: me, emoji }, { onConflict: 'commentaire,auteur' });
    }
    await loadComments();
  };

  const addComment = async (e) => {
    e.preventDefault();
    if (!ctext.trim()) return;
    if (!me) { window.location.href = '/inscription'; return; }
    const { error: eCom } = await supabase.from('commentaires').insert({ besoin: b.id, auteur: me, texte: ctext.trim() });
    if (eCom) { alert('Votre commentaire n’a pas pu être envoyé. Réessayez.'); return; }
    setCtext(''); await loadComments();
  };

  const addReponse = async (e, parentId) => {
    e.preventDefault();
    if (!rtext.trim()) return;
    if (!me) { window.location.href = '/inscription'; return; }
    const { error: eCom } = await supabase.from('commentaires').insert({ besoin: b.id, auteur: me, texte: rtext.trim(), parent: parentId });
    if (eCom) { alert('Votre réponse n’a pas pu être envoyée. Réessayez.'); return; }
    setRtext(''); setRepondreA(null);
    await loadComments();
  };

  const sauverCommentaire = async (c) => {
    if (!editCtxt.trim()) return;
    await supabase.from('commentaires')
      .update({ texte: editCtxt.trim(), modifie_le: new Date().toISOString() }).eq('id', c.id);
    setEditCid(null); setEditCtxt('');
    await loadComments();
  };
  const supprimerCommentaire = async (c) => {
    if (!window.confirm('Supprimer ce commentaire ?')) return;
    await supabase.from('commentaires').delete().eq('id', c.id);
    await loadComments();
  };

  const sauverPost = async (e) => {
    e.preventDefault();
    const estPost = b.type === 'post';
    if (!estPost && !eTitre.trim()) return;
    if (estPost && !eDesc.trim()) return;
    setBusy(true);
    const maj = estPost
      ? { titre: eDesc.trim().slice(0, 90), description: eDesc.trim(), modifie_le: new Date().toISOString() }
      : { titre: eTitre.trim(), description: eDesc.trim() || null, modifie_le: new Date().toISOString() };
    const { error } = await supabase.from('besoins').update(maj).eq('id', b.id);
    setBusy(false);
    if (!error) { setPost({ ...post, ...maj }); setEdition(false); }
  };
  const supprimerPost = async () => {
    if (!window.confirm('Supprimer définitivement cette annonce ?')) return;
    setBusy(true);
    const { error } = await supabase.from('besoins').delete().eq('id', b.id);
    setBusy(false);
    if (!error) setSupprime(true);
  };

  const envoyerCandidature = async (e) => {
    e.preventDefault();
    if (!candMsg.trim()) return;
    setBusy(true); setCandEtat('');
    let cv = null, cv_nom = null;
    if (candCV) {
      try { const up = await uploadPieceJointe(supabase, candCV, me); cv = up.url; cv_nom = up.nom || candCV.name; }
      catch (err) { setBusy(false); setCandEtat('✗ ' + err.message); return; }
    }
    const { error } = await supabase.from('candidatures')
      .insert({ offre: b.id, candidat: me, message: candMsg.trim(), cv, cv_nom });
    setBusy(false);
    if (error) {
      setCandEtat(error.message.includes('duplicate') ? '✗ Vous avez déjà postulé à cette offre.' : '✗ ' + error.message);
      return;
    }
    setCandEtat('✓ Candidature envoyée ! Le recruteur a été notifié.');
    setCandMsg(''); setCandCV(null);
    setTimeout(() => setPostulerOuvert(false), 1800);
  };

  const interesse = async () => {
    if (!me) { window.location.href = '/inscription'; return; }
    await supabase.from('notifications').insert({ destinataire: b.auteur, besoin: b.id });
    alert('Votre intérêt a été envoyé ✓');
  };
  const contactHref = b.contact
    ? 'https://wa.me/' + String(b.contact).replace(/\D/g, '')
    : '/messages?to=' + b.auteur;

  if (supprime) return null;

  const racines = comments.filter((c) => !c.parent);
  const reponsesDe = (id) => comments.filter((c) => c.parent === id);

  const renderCommentaire = (c, estReponse = false) => {
    const r = crx[c.id];
    return (
      <div key={c.id} className={'cmt' + (estReponse ? ' cmt-rep' : '')}>
        <Avatar url={c.avatar_url} nom={c.nom} size={estReponse ? 26 : 32} href={`/profil/${c.auteur}`} />
        <div className="cmt-b">
          <Link href={`/profil/${c.auteur}`}><strong>{c.nom}</strong></Link>{' '}
          <span className="muted sm">{ilya(c.created_at)}{c.modifie_le ? ' · modifié' : ''}</span>
          {editCid === c.id ? (
            <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
              <input value={editCtxt} onChange={(e) => setEditCtxt(e.target.value)}
                style={{ flex: 1, padding: 9, border: '1px solid var(--line)', borderRadius: 9, fontSize: 16 }} />
              <button className="btn btn-sm" type="button" onClick={() => sauverCommentaire(c)}>OK</button>
              <button className="btn btn-sm" type="button" style={ghost} onClick={() => setEditCid(null)}>✕</button>
            </div>
          ) : (
            <div>{c.texte}</div>
          )}

          {r && r.total > 0 && (
            <span className="rx-chip">{r.top.join('')} {r.total}</span>
          )}

          <div className="cmt-actions">
            <span style={{ position: 'relative' }}>
              <button type="button" onClick={() => setPickCmt(pickCmt === c.id ? null : c.id)}>
                {r && r.mine ? r.mine + ' Réagi' : 'Réagir'}
              </button>
              {pickCmt === c.id && <EmojiPicker actif={r && r.mine} onPick={(e) => reagirCommentaire(c, e)} />}
            </span>
            {!estReponse && (
              <>
                <span>·</span>
                <button type="button" onClick={() => { setRepondreA(repondreA === c.id ? null : c.id); setRtext(''); }}>Répondre</button>
              </>
            )}
            {me === c.auteur && editCid !== c.id && (
              <>
                <span>·</span>
                <button type="button" onClick={() => { setEditCid(c.id); setEditCtxt(c.texte); }}>Modifier</button>
                <span>·</span>
                <button type="button" className="danger" onClick={() => supprimerCommentaire(c)}>Supprimer</button>
              </>
            )}
          </div>

          {repondreA === c.id && (
            <form onSubmit={(e) => addReponse(e, c.id)} style={{ display: 'flex', gap: 6, marginTop: 8 }}>
              <input value={rtext} onChange={(e) => setRtext(e.target.value)} autoFocus
                placeholder={`Répondre à ${c.nom}…`}
                style={{ flex: 1, padding: 9, border: '1px solid var(--line)', borderRadius: 9, fontSize: 16 }} />
              <button className="btn btn-sm" type="submit">↩</button>
            </form>
          )}

          {reponsesDe(c.id).map((rep) => renderCommentaire(rep, true))}
        </div>
      </div>
    );
  };

  return (
    <div className="card">
      <div className="post-head">
        <Avatar url={auteur.avatar_url} nom={auteur.nom} size={44} href={b.contact ? undefined : `/profil/${b.auteur}`} />
        <div style={{ minWidth: 0, flex: 1 }}>
          <div className="post-n">
            {b.contact ? <strong>{auteur.nom}</strong> : <Link href={`/profil/${b.auteur}`}><strong>{auteur.nom}</strong></Link>}
            {auteur.verifie && <BadgeVerifie size="sm" />}
            <BadgesPro badges={auteur.badges} mini />
          </div>
          <p className="muted sm" style={{ margin: 0 }}>
            {m ? m.name : b.metier}{b.ville ? ` · ${b.ville}` : ''} · {ilya(b.created_at)}
            {post.modifie_le && <em> · modifié</em>}
          </p>
        </div>
        {b.boost_jusqua && new Date(b.boost_jusqua) > new Date() && (
          <span className="badge boost">⭐ Sponsorisé</span>
        )}
        <span className="badge" style={{ color: t.color, background: t.color + '1a' }}>{t.label}</span>
        {me === b.auteur && (
          <span className="menu-wrap">
            <button className="menu-btn" aria-label="Options de l’annonce" onClick={() => setMenu(!menu)}>⋯</button>
            {menu && (
              <span className="menu-pop" onClick={() => setMenu(false)}>
                <button type="button" onClick={() => { setEdition(true); setETitre(post.titre || ''); setEDesc(post.description || ''); }}>✏️ Modifier</button>
                <button type="button" onClick={async () => {
                  const ref = 'BOOST-' + String(b.id).slice(0, 6).toUpperCase();
                  if (!window.confirm('Booster cette annonce en tête du fil pendant 7 jours pour 1 000 F ?')) return;
                  const { error } = await supabase.from('demandes_boost').insert({ besoin: b.id, membre: me });
                  if (error) { alert(error.message.includes('duplicate') ? 'Une demande de boost est déjà en cours pour cette annonce.' : error.message); return; }
                  alert('Demande enregistrée ✓\n\nPour activer le boost :\n1. Envoyez 1 000 F par Mobile Money au 07 49 07 40 82\n2. Motif : ' + ref + '\n\nVotre annonce passera en tête dès validation (quelques heures max).');
                }}>🚀 Booster 7 jours — 1 000 F</button>
                <button type="button" className="danger" onClick={supprimerPost} disabled={busy}>🗑 Supprimer</button>
              </span>
            )}
          </span>
        )}
      </div>

      {edition ? (
        <form onSubmit={sauverPost} style={{ marginTop: 10, display: 'grid', gap: 8 }}>
          {b.type !== 'post' && (
            <input value={eTitre} onChange={(e) => setETitre(e.target.value)} required
              style={{ width: '100%', padding: 11, border: '1px solid var(--line)', borderRadius: 10, fontSize: 16, fontWeight: 700 }} />
          )}
          <textarea value={eDesc} onChange={(e) => setEDesc(e.target.value)} rows={3}
            style={{ width: '100%', padding: 11, border: '1px solid var(--line)', borderRadius: 10, fontFamily: 'inherit', fontSize: 16 }} />
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-sm" type="submit" disabled={busy}>{busy ? '…' : 'Enregistrer'}</button>
            <button className="btn btn-sm" type="button" style={ghost} onClick={() => setEdition(false)}>Annuler</button>
          </div>
        </form>
      ) : (
        <>
          {b.type !== 'post' && <h3 style={{ margin: '10px 0 4px' }}>{post.titre}</h3>}
          {b.source && <p className="muted sm" style={{ marginTop: 2 }}>Repéré par Ayôrôfa · {b.source}</p>}
          {b.type === 'post'
            ? <p className="post-texte"><TexteRiche texte={post.description || post.titre} /></p>
            : (post.description && <p style={{ marginTop: 6 }}><TexteRiche texte={post.description} /></p>)}
          <MediaView url={b.media} type={b.media_type} />
          {b.lien && <p style={{ marginTop: 6 }}><a href={b.lien} target="_blank" rel="noopener">Voir l’annonce d’origine ↗</a></p>}
        </>
      )}

      {rx.total > 0 && (
        <p className="rx-resume">{rx.top.join('')} {rx.total} réaction{rx.total > 1 ? 's' : ''}</p>
      )}

      <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ position: 'relative' }}>
          <button className="btn btn-sm" style={rx.mine ? {} : ghost} onClick={() => setPickPost(!pickPost)}>
            {rx.mine ? `${rx.mine} Réagi` : '👍 Réagir'}
          </button>
          {pickPost && <EmojiPicker actif={rx.mine} onPick={reagirPost} />}
        </span>
        <button className="btn btn-sm" style={ghost} onClick={openC}>💬 Commenter</button>
        <button className="btn btn-sm" style={ghost} type="button" onClick={async () => {
          const url = `${window.location.origin}/annonce/${b.id}`;
          if (navigator.share) { try { await navigator.share({ title: post.titre, url }); } catch (e) {} }
          else { try { await navigator.clipboard.writeText(url); alert('Lien copié ✓'); } catch (e) {} }
        }}>↗ Partager</button>
        {me && b.auteur !== me && b.type === 'offre_emploi' && (
          <button className="btn btn-sm" onClick={() => { setPostulerOuvert(!postulerOuvert); setCandEtat(''); }}>📩 Postuler</button>
        )}
        {me && b.auteur !== me && b.type !== 'offre_emploi' && <button className="btn btn-sm" onClick={interesse}>Ça m’intéresse</button>}
        {me && b.auteur !== me && <a className="btn btn-sm" style={ghost} href={contactHref} target={b.contact ? '_blank' : undefined} rel="noopener">Contacter</a>}
        {!me && <Link href="/inscription" className="btn btn-sm">Répondre — créer un compte</Link>}
        {me && b.auteur !== me && (
          <span style={{ marginLeft: 'auto' }}>
            <Signaler type="besoin" cibleId={b.id} auteurCible={b.auteur} me={me} />
          </span>
        )}
      </div>

      {postulerOuvert && me && b.auteur !== me && (
        <form onSubmit={envoyerCandidature} className="cand-form">
          <strong style={{ fontSize: '.92rem' }}>Ma candidature</strong>
          <textarea value={candMsg} onChange={(e) => setCandMsg(e.target.value)} rows={3} required
            placeholder="Présentez-vous en quelques lignes : expérience, disponibilité, motivation…"
            style={{ width: '100%', marginTop: 8, padding: 11, border: '1px solid var(--line)', borderRadius: 10, fontFamily: 'inherit', fontSize: 16 }} />
          <div style={{ display: 'flex', gap: 8, marginTop: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <label className="btn btn-sm" style={{ background: 'transparent', border: '1px solid var(--line)', color: 'var(--text)', cursor: 'pointer' }}>
              {candCV ? '📄 ' + candCV.name.slice(0, 22) : '📄 Joindre mon CV (PDF/Word)'}
              <input type="file" accept=".pdf,.doc,.docx" style={{ display: 'none' }}
                onChange={(e) => { const f = e.target.files && e.target.files[0]; if (f) setCandCV(f); e.target.value = ''; }} />
            </label>
            {candCV && <button type="button" className="btn btn-sm" style={{ background: 'transparent', border: '1px solid var(--line)', color: '#b3261e' }} onClick={() => setCandCV(null)}>✕</button>}
            <button className="btn btn-sm" type="submit" disabled={busy} style={{ marginLeft: 'auto' }}>{busy ? '…' : 'Envoyer'}</button>
          </div>
          {candEtat && <p style={{ margin: '8px 0 0', fontSize: '.88rem', fontWeight: 600, color: candEtat.startsWith('✓') ? '#1A6B50' : '#b3261e' }}>{candEtat}</p>}
        </form>
      )}

      {showC && (
        <div style={{ marginTop: 14, borderTop: '1px solid var(--line)', paddingTop: 12 }}>
          {racines.map((c) => renderCommentaire(c))}
          {me ? (
            <form onSubmit={addComment} style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              <input value={ctext} onChange={(e) => setCtext(e.target.value)} placeholder="Écrire un commentaire…"
                style={{ flex: 1, padding: 11, border: '1px solid var(--line)', borderRadius: 10, fontFamily: 'inherit', fontSize: 16 }} />
              <button className="btn btn-sm" type="submit">Envoyer</button>
            </form>
          ) : (
            <p className="muted sm" style={{ marginTop: 10 }}>
              <Link href="/inscription"><strong>Créez un compte gratuit</strong></Link> pour commenter.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
