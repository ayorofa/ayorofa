'use client';
import { Suspense, useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { ilya } from '@/lib/meta';
import { uploadPieceJointe } from '@/lib/media';
import MediaView from '@/components/MediaView';
import EmojiPicker from '@/components/EmojiPicker';
import Avatar from '@/components/Avatar';

function MessagesInner() {
  const router = useRouter();
  const sp = useSearchParams();
  useEffect(() => {
    if (sp.get('sujet') === 'devis') {
      setText('Bonjour 👋 Je souhaite un devis pour : ');
    }
  }, [sp]);
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
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'messages', filter: `expediteur=eq.${user.id}` },
          (payload) => setThread((t) => t.map((m) => (m.id === payload.new.id ? payload.new : m))))
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

  // « en train d'écrire… »
  useEffect(() => {
    if (!supabase || !me || !active) return;
    const nomCanal = 'tape-' + [me, active].sort().join('-');
    const ch = supabase.channel(nomCanal)
      .on('broadcast', { event: 'tape' }, ({ payload }) => {
        if (payload.qui !== me) {
          setTape(true);
          clearTimeout(tapeTimer.current);
          tapeTimer.current = setTimeout(() => setTape(false), 2500);
        }
      })
      .subscribe();
    tapeCanal.current = ch;
    setTape(false);
    return () => { supabase.removeChannel(ch); tapeCanal.current = null; };
  }, [active, me]);

  const signalerTape = () => {
    const t = Date.now();
    if (t - dernierTape.current < 1200 || !tapeCanal.current) return;
    dernierTape.current = t;
    tapeCanal.current.send({ type: 'broadcast', event: 'tape', payload: { qui: me } });
  };

  // ── message vocal 🎙 ──
  const demarrerEnreg = async () => {
    try {
      const flux = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(flux);
      chunksRef.current = [];
      rec.ondataavailable = (e) => { if (e.data.size) chunksRef.current.push(e.data); };
      rec.start();
      recRef.current = { rec, flux };
      setEnreg(true); setTEnreg(0);
      chronoRef.current = setInterval(() => setTEnreg((x) => x + 1), 1000);
    } catch (e) {
      setErrMedia('Micro non autorisé — vérifiez les permissions du navigateur.');
    }
  };
  const finirEnreg = (garder) => {
    const r = recRef.current;
    if (!r) return;
    clearInterval(chronoRef.current);
    r.rec.onstop = () => {
      r.flux.getTracks().forEach((tr) => tr.stop());
      if (garder && chunksRef.current.length) {
        const blob = new Blob(chunksRef.current, { type: r.rec.mimeType || 'audio/webm' });
        setFichier(new File([blob], `vocal-${Date.now()}.webm`, { type: blob.type }));
      }
      setEnreg(false); setTEnreg(0); recRef.current = null;
    };
    r.rec.stop();
  };

  const [fichier, setFichier] = useState(null);
  const [envoi, setEnvoi] = useState(false);
  const [errMedia, setErrMedia] = useState('');
  const [tape, setTape] = useState(false);
  const tapeTimer = useRef(null);
  const tapeCanal = useRef(null);
  const dernierTape = useRef(0);
  const [enreg, setEnreg] = useState(false);
  const [tEnreg, setTEnreg] = useState(0);
  const recRef = useRef(null);
  const chunksRef = useRef([]);
  const chronoRef = useRef(null);
  const [filtre, setFiltre] = useState('');
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
    let media = null, media_type = null, media_nom = null;
    if (fichier) {
      try {
        const up = await uploadPieceJointe(supabase, fichier, me);
        media = up.url; media_type = up.type; media_nom = up.nom || null;
      } catch (err) {
        setEnvoi(false); setErrMedia(err.message); return;
      }
    }
    setText(''); setFichier(null);
    const { data } = await supabase.from('messages')
      .insert({ expediteur: me, destinataire: active, contenu: contenu || null, media, media_type, media_nom })
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
          <div className="conv-filtre">
            <input value={filtre} onChange={(e) => setFiltre(e.target.value)}
              placeholder="🔎 Rechercher une conversation…" aria-label="Rechercher une conversation" />
          </div>
          {convs.length ? convs.filter((c) => {
            if (!filtre.trim()) return true;
            const n = filtre.toLowerCase();
            return (nomDe(c.id) || '').toLowerCase().includes(n) ||
                   (c.last && c.last.contenu ? c.last.contenu.toLowerCase().includes(n) : false);
          }).map((c) => (
            <button key={c.other} className={'conv' + (active === c.other ? ' on' : '')} onClick={() => setActive(c.other)}>
              <Avatar url={photoDe(c.other)} nom={nomDe(c.other)} size={42} />
              <span className="conv-t">
                <span className="conv-n">{nomDe(c.other)}</span>
                <span className="conv-l">{c.last.media ? (
                  c.last.media_type === 'video' ? '🎥 Vidéo' :
                  c.last.media_type === 'audio' ? '🎙 Message vocal' :
                  c.last.media_type === 'document' ? '📄 Document' : '📷 Photo'
                ) : c.last.contenu}</span>
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
                <span>
                  {nomDe(active)}
                  {tape && <em className="tape">en train d’écrire…</em>}
                </span>
              </div>
              <div className="chat-msgs">
                {activeMsgs.map((m) => {
                  const r = msgRx[m.id];
                  return (
                    <div key={m.id} className={'bubble-wrap' + (m.expediteur === me ? ' me' : '')}>
                      <div className={'bubble' + (m.expediteur === me ? ' me' : '')}>
                        {m.media && (m.media_type === 'image' || m.media_type === 'video') &&
                          <MediaView url={m.media} type={m.media_type} petit />}
                        {m.media && m.media_type === 'audio' &&
                          <audio className="msg-audio" src={m.media} controls preload="metadata" />}
                        {m.media && m.media_type === 'document' && (
                          <a className="msg-doc" href={m.media} target="_blank" rel="noopener">
                            📄 {m.media_nom || 'Document'}
                          </a>
                        )}
                        {m.contenu}
                        <span className="bt">
                          {ilya(m.created_at)}
                          {m.expediteur === me && (
                            <span className={'ticks' + (m.lu ? ' lu' : '')}>{m.lu ? ' ✓✓' : ' ✓'}</span>
                          )}
                        </span>
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
                  {fichier.type.startsWith('video/') ? '🎥' : fichier.type.startsWith('audio/') ? '🎙' :
                   /pdf|word|excel|sheet|msword/.test(fichier.type) || /\.(pdf|docx?|xlsx?)$/i.test(fichier.name) ? '📄' : '📷'} {fichier.name}
                  <button type="button" onClick={() => setFichier(null)} aria-label="Retirer">✕</button>
                </div>
              )}
              {errMedia && <p className="muted sm" style={{ color: '#b3261e', margin: '4px 12px' }}>{errMedia}</p>}
              {!enreg && !text && !fichier && (
                <div className="rep-rapides">
                  {['Bonjour 👋', 'C’est disponible ?', 'Quel est votre prix ?', 'Merci 🙏'].map((r) => (
                    <button key={r} type="button" onClick={() => setText(r)}>{r}</button>
                  ))}
                </div>
              )}
              {enreg ? (
                <div className="chat-form enreg">
                  <span className="enreg-pt" aria-hidden="true" />
                  <span className="enreg-t">🎙 {Math.floor(tEnreg / 60)}:{String(tEnreg % 60).padStart(2, '0')}</span>
                  <button className="btn btn-sm btn-ghost" type="button" onClick={() => finirEnreg(false)}>✕ Annuler</button>
                  <button className="btn btn-sm" type="button" onClick={() => finirEnreg(true)}>✓ Garder</button>
                </div>
              ) : (
                <form className="chat-form" onSubmit={send}>
                  <label className="chat-attach" aria-label="Joindre un fichier (photo, vidéo, document)">
                    📎
                    <input type="file" accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx" style={{ display: 'none' }}
                      onChange={(e) => { const f = e.target.files && e.target.files[0]; if (f) setFichier(f); e.target.value = ''; }} />
                  </label>
                  <button className="chat-attach" type="button" aria-label="Enregistrer un message vocal"
                    onClick={demarrerEnreg}>🎙</button>
                  <input value={text} onChange={(e) => { setText(e.target.value); signalerTape(); }} placeholder="Écrire un message…" />
                  <button className="btn" type="submit" disabled={envoi}>{envoi ? '…' : 'Envoyer'}</button>
                </form>
              )}
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
