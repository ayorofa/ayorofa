'use client';
import { Suspense, useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { ilya } from '@/lib/meta';

function MessagesInner() {
  const router = useRouter();
  const sp = useSearchParams();
  const [me, setMe] = useState(null);
  const [convs, setConvs] = useState([]);
  const [active, setActive] = useState(null);
  const [names, setNames] = useState({});
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
    const to = sp.get('to'); if (to && !ids.includes(to)) ids.push(to);
    if (ids.length) {
      const { data: profs } = await supabase.from('profiles').select('id,nom').in('id', ids);
      const nm = {}; (profs || []).forEach((p) => { nm[p.id] = p.nom || 'Utilisateur'; }); setNames(nm);
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
      const to = sp.get('to'); if (to) setActive(to);
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
    supabase.from('messages').update({ lu: true }).eq('destinataire', me).eq('expediteur', active).eq('lu', false).then(() => {});
  }, [active, me, thread.length]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [activeMsgs.length]);

  const send = async (e) => {
    e.preventDefault();
    if (!text.trim() || !active) return;
    const contenu = text.trim(); setText('');
    const { data } = await supabase.from('messages').insert({ expediteur: me, destinataire: active, contenu }).select().single();
    if (data) setThread((t) => [...t, data]);
  };

  if (!supabase) return <main className="sec"><div className="wrap"><div className="card">Configuration Supabase manquante.</div></div></main>;
  if (loading) return <main className="sec"><div className="wrap"><p className="muted">Chargement…</p></div></main>;

  return (
    <main className="sec"><div className="wrap">
      <p className="eyebrow">Messagerie 🔴</p><h1>Messages</h1>
      <div className="chat">
        <aside className="chat-list">
          {convs.length ? convs.map((c) => (
            <button key={c.other} className={'conv' + (active === c.other ? ' on' : '')} onClick={() => setActive(c.other)}>
              <span className="conv-n">{names[c.other] || 'Utilisateur'}</span>
              <span className="conv-l">{c.last.contenu}</span>
              {c.unread > 0 && <span className="dot">{c.unread}</span>}
            </button>
          )) : <p className="muted sm" style={{ padding: 12 }}>Aucune conversation. Contacte quelqu’un depuis le fil des besoins.</p>}
        </aside>
        <section className="chat-thread">
          {active ? (
            <>
              <div className="chat-head">{names[active] || 'Utilisateur'}</div>
              <div className="chat-msgs">
                {activeMsgs.map((m) => (
                  <div key={m.id} className={'bubble' + (m.expediteur === me ? ' me' : '')}>{m.contenu}<span className="bt">{ilya(m.created_at)}</span></div>
                ))}
                <div ref={endRef} />
              </div>
              <form className="chat-form" onSubmit={send}>
                <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Écrire un message…" />
                <button className="btn" type="submit">Envoyer</button>
              </form>
            </>
          ) : <p className="muted" style={{ padding: 20 }}>Sélectionne une conversation à gauche.</p>}
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
