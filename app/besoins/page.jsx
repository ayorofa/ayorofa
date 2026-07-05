'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import BesoinCard from '@/components/BesoinCard';

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
  if (!supabase) return <main className="sec"><div className="wrap"><div className="card">Configuration Supabase manquante.</div></div></main>;
  return (
    <main className="sec"><div className="wrap" style={{ maxWidth: 760 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div><p className="eyebrow">En direct 🔴</p><h1>Besoins & opportunités</h1></div>
        <Link href="/publier" className="btn">Publier</Link>
      </div>
      {loading ? <p className="muted" style={{ marginTop: 18 }}>Chargement…</p> :
        items.length ? <div style={{ display: 'grid', gap: 14, marginTop: 18 }}>{items.map((b) => <BesoinCard key={b.id} b={b} me={uid} />)}</div>
          : <div className="card" style={{ marginTop: 18 }}>Aucun besoin publié. <Link href="/publier">Publie le premier</Link> !</div>}
    </div></main>
  );
}
