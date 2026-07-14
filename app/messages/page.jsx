'use client';
import { Suspense, useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { ilya } from '@/lib/meta';
import { uploadMedia } from '@/lib/media';
import MediaView from '@/components/MediaView';
import EmojiPicker from '@/components/EmojiPicker';
import Avatar from '@/components/Avatar';

function MessagesInner() {
  const router = useRouter();
  const sp = useSearchParams();
  const [me, setMe] = useState(null);
  const [convs, setConvs] = useState([]);
  const [active, setActive] = useState(null);
  const [profils, setProfils] = useState({});
  const [thread, setThread] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const endRef = useRef(null);

  async function loadAll(uid) {
    const { data } = await supabase.from('messages').select('*')
      .or(`expediteur.eq.${uid},destinataire.eq.${uid}`).order('created_at', { ascending: true });
    const msgs = data || [];
    const map = {};
    for (const m of msgs) {
      const other = m.expediteur === uid ? m.destinataire : m.expediteur;
      if (!map[other]) map[other] = { other, last: m, unread: 0 };
      map[other].last = m;
      if (m.destinataire === uid && !m.lu) map[other].unread++;
    }
    setConvs(Object.values(map).sort((a, b) => new Date(b.last.created_at) - new Date(a.last.created_at)));
    const ids = [...new Set(msgs.flatMap((m) => [m.expediteur, m.destinataire]).filter((x) => x !== uid))];
    const to = sp.get('to');
    if (to && !ids.includes(to)) ids.push(to);
    if (ids.length) {
      const { data: ps } = await supabase.from('profiles').select('id,nom,avatar_url').in('id', ids);
      const nm = {};
      (ps || []).forEach((p) => { nm[p.id] = { nom: p.nom || 'Utilisateur', avatar_url: p.avatar_url }; });
      setProfils(nm);
    }
    setThread(msgs);
  }

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    let ch;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/connexion'); return; }
      setMe(user.id);
      await loadAll(user.id);
      const to = sp.get('to');
      if (to) setActive(to);
      setLoading(false);
      ch = supabase.channel('msgs')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `destinataire=eq.${user.id}` },
          () => loadAll(user.id))
        .subscribe();
    })();
    return () => { if (ch) supabase.removeChannel(ch); };
  }, []);

  const activeMsgs = thread.filter((m) => me && active &&
    ((m.expediteur === me && m.destinataire === active) || (m.expediteur === active && m.destinataire === me)));

  useEffect(() => {
    if (!supabase || !me || !active) return;
    supabase.from('messages').update({ lu: true })
      .eq('destinataire', me).eq('expediteur', active).eq('lu', false).then(() => {});
  }, [active, me, thread.length]);

  useEffect(() => { if (endRef.current) endRef.current.scrollIntoView({ behavior: 'smooth' }); }, [activeMsgs.length]);

  useEffect(() => {
    if (!supabase || !me || !active) return;
    chargerReactionsMsgs(activeMsgs.map((x) => x.id));
  }, [active, me, thread.length]);

  const [fichier, setFichier] = useState(null);
  const [envoi, setEnvoi] = useState(false);
  const [errMedia, setErrMedia] = useState('');
  const [msgRx, setMsgRx] = useState({});     // réactions par message
  const [pickMsg, setPickMsg] = useState(null);

  const chargerReactionsMsgs = async (ids) => {
    if (!ids.length) { setMsgRx({}); return; }
    const { data } = await supabase.from('reactions_messages')
      .select('message,emoji,auteur').in('message', ids);
    const map = {};
    (data || []).forEach((r) => {
      if (!map[r.message]) map[r.message] = { emojis: [], mine: null };
      map[r.message].emojis.push(r.emoji);
      if (r.auteur === me) map[r.message].mine = r.emoji;
    });
    setMsgRx(map);
  };

  const reagirMsg = async (mId, emoji) => {
    setPickMsg(null);
    const mien = msgRx[mId] && msgRx[mId].mine;
    if (mien === emoji) {
      await supabase.from('reactions_messages').delete().eq('message', mId).eq('auteur', me);
    } else {
      await supabase.from('reactions_messages').upsert(
        { message: mId, auteur: me, emoji }, { onConflict: 'message,auteur' });
    }
    await chargerReactionsMsgs(activeMsgs.map((x) => x.id));
  };

  const send = async (e) => {
    e.preventDefault();
    if ((!text.trim() && !fichier) || !active) return;
    const contenu = text.trim();
    setEnvoi(true); setErrMedia('');
    let media = null, media_type = null;
    if (fichier) {
      try {
        const up = await uploadMedia(supabase, fichier, me);
        media = up.url; media_type = up.type;
      } catch (err) {
        setEnvoi(false); setErrMedia(err.message); return;
      }
    }
    setText(''); setFichier(null);
    const { data } = await supabase.from('messages')
      .insert({ expediteur: me, destinataire: active, contenu: contenu || null, media, media_type })
      .select().single();
    if (data) setThread((t) => [...t, data]);
    setEnvoi(false);
  };

  const nomDe = (id) => (profils[id] && profils[id].nom) || 'Utilisateur';
  const photoDe = (id) => profils[id] && profils[id].avatar_url;

  if (!supabase) return <main className="sec"><div className="wrap"><div className="card">Configuration Supabase manquante.</div></div></main>;
  if (loading) return <main className="sec"><div className="wrap"><p className="muted">Chargement…</p></div></main>;

  return (
    <main className="sec"><div className="wrap">
      <p className="eyebrow">Messagerie</p><h1>Messages</h1>
      <div className="chat">
        <aside className="chat-list">
          {convs.length ? convs.map((c) => (
            <button key={c.other} className={'conv' + (active === c.other ? ' on' : '')} onClick={() => setActive(c.other)}>
              <Avatar url={photoDe(c.other)} nom={nomDe(c.other)} size={42} />
              <span className="conv-t">
                <span className="conv-n">{nomDe(c.other)}</span>
                <span className="conv-l">{c.last.media ? (c.last.media_type === 'video' ? '🎥 Vidéo' : '📷 Photo') : c.last.contenu}</span>
              </span>
              {c.unread > 0 && <span className="dot">{c.unread}</span>}
            </button>
          )) : <p className="muted sm" style={{ padding: 14 }}>Aucune conversation. Contactez quelqu’un depuis le fil.</p>}
        </aside>

        <section className="chat-thread">
          {active ? (
            <>
              <div className="chat-head">
                <Avatar url={photoDe(active)} nom={nomDe(active)} size={36} href={`/profil/${active}`} />
                <span>{nomDe(active)}</span>
              </div>
              <div className="chat-msgs">
                {activeMsgs.map((m) => {
                  const r = msgRx[m.id];
                  return (
                    <div key={m.id} className={'bubble-wrap' + (m.expediteur === me ? ' me' : '')}>
                      <div className={'bubble' + (m.expediteur === me ? ' me' : '')}>
                        {m.media && <MediaView url={m.media} type={m.media_type} petit />}
                        {m.contenu}
                        <span className="bt">{ilya(m.created_at)}</span>
                        <button type="button" className="bubble-react" aria-label="Réagir à ce message"
                          onClick={() => setPickMsg(pickMsg === m.id ? null : m.id)}>☺</button>
                      </div>
                      {pickMsg === m.id && (
                        <span style={{ position: 'relative', alignSelf: m.expediteur === me ? 'flex-end' : 'flex-start' }}>
                          <EmojiPicker actif={r && r.mine} onPick={(e) => reagirMsg(m.id, e)} />
                        </span>
                      )}
                      {r && r.emojis.length > 0 && (
                        <span className="rx-chip bulle">{[...new Set(r.emojis)].join('')}{r.emojis.length > 1 ? ' ' + r.emojis.length : ''}</span>
                      )}
                    </div>
                  );
                })}
                <div ref={endRef} />
              </div>
              {fichier && (
                <div className="media-chip">
                  {fichier.type.startsWith('video/') ? '🎥' : '📷'} {fichier.name}
                  <button type="button" onClick={() => setFichier(null)} aria-label="Retirer">✕</button>
                </div>
              )}
              {errMedia && <p className="muted sm" style={{ color: '#b3261e', margin: '4px 12px' }}>{errMedia}</p>}
              <form className="chat-form" onSubmit={send}>
                <label className="chat-attach" aria-label="Joindre une photo ou une vidéo">
                  📎
                  <input type="file" accept="image/*,video/*" style={{ display: 'none' }}
                    onChange={(e) => { const f = e.target.files && e.target.files[0]; if (f) setFichier(f); e.target.value = ''; }} />
                </label>
                <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Écrire un message…" />
                <button className="btn" type="submit" disabled={envoi}>{envoi ? '…' : 'Envoyer'}</button>
              </form>
            </>
          ) : <p className="muted" style={{ padding: 20 }}>Sélectionnez une conversation.</p>}
        </section>
      </div>
    </div></main>
  );
}

export default function Messages() {
  return (
    <Suspense fallback={<main className="sec"><div className="wrap"><p className="muted">Chargement…</p></div></main>}>
      <MessagesInner />
    </Suspense>
  );
}
