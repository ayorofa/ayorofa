'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { metierBySlug } from '@/data/metiers';
import { BTYPE, ilya } from '@/lib/meta';

export default function Besoins() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uid, setUid] = useState(null);

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    let channel;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUid(user?.id || null);
      const { data } = await supabase.from('besoins').select('*').order('created_at', { ascending: false }).limit(50);
      setItems(data || []); setLoading(false);
      channel = supabase.channel('besoins-feed')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'besoins' },
          (payload) => setItems((cur) => [payload.new, ...cur]))
        .subscribe();
    })();
    return () => { if (channel) supabase.removeChannel(channel); };
  }, []);

  const interesse = async (b) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { window.location.href = '/connexion'; return; }
    await supabase.from('notifications').insert({ destinataire: b.auteur, besoin: b.id });
    alert('Votre intérêt a été envoyé ✓');
  };

  if (!supabase) return <main className="sec"><div className="wrap"><div className="card">Configuration Supabase manquante.</div></div></main>;
  return (
    <main className="sec"><div className="wrap" style={{ maxWidth: 760 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div><p className="eyebrow">En direct 🔴</p><h1>Besoins & opportunités</h1></div>
        <Link href="/publier" className="btn">Publier</Link>
      </div>
      {loading ? <p className="muted" style={{ marginTop: 18 }}>Chargement…</p> :
        items.length ? (
          <div style={{ display: 'grid', gap: 14, marginTop: 18 }}>
            {items.map((b) => {
              const t = BTYPE[b.type] || { label: b.type, color: '#666' };
              const m = metierBySlug(b.metier);
              return (
                <div key={b.id} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
                    <span className="badge" style={{ color: t.color, background: t.color + '1a' }}>{t.label}</span>
                    <span className="muted sm">{ilya(b.created_at)}</span>
                  </div>
                  <h3 style={{ margin: '8px 0 4px' }}>{b.titre}</h3>
                  <p className="muted sm">{m ? m.name : b.metier}{b.ville ? ` · ${b.ville}` : ''}</p>
                  {b.description && <p style={{ marginTop: 8 }}>{b.description}</p>}
                  {b.auteur !== uid && (
                    <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                      <button className="btn btn-sm" onClick={() => interesse(b)}>Ça m’intéresse</button>
                      <a className="btn btn-sm" style={{ background: 'transparent', border: '1px solid var(--line)', color: 'var(--text)' }} href={`/messages?to=${b.auteur}`}>Contacter</a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : <div className="card" style={{ marginTop: 18 }}>Aucun besoin publié pour l’instant. <Link href="/publier">Publie le premier</Link> !</div>
      }
    </div></main>
  );
}
