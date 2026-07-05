'use client';
import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { metierBySlug } from '@/data/metiers';
import { BTYPE, ilya } from '@/lib/meta';

const TYPE_LABEL = { entreprise: 'Entreprise', particulier: 'Particulier', chercheur: "Chercheur d'emploi" };

export default function Recherche() {
  const [q, setQ] = useState('');
  const [besoins, setBesoins] = useState([]);
  const [profs, setProfs] = useState([]);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const go = async (e) => {
    e.preventDefault();
    if (!supabase || !q.trim()) return;
    setLoading(true);
    const term = q.trim();
    const { data: b } = await supabase.from('besoins').select('*').or(`titre.ilike.%${term}%,description.ilike.%${term}%`).order('created_at', { ascending: false }).limit(20);
    const { data: p } = await supabase.from('profiles').select('id,nom,type,ville,avatar_url').ilike('nom', `%${term}%`).limit(20);
    setBesoins(b || []); setProfs(p || []); setDone(true); setLoading(false);
  };

  return (
    <main className="sec"><div className="wrap" style={{ maxWidth: 760 }}>
      <p className="eyebrow">Recherche</p><h1>Trouver un pro, un besoin</h1>
      <form onSubmit={go} style={{ display: 'flex', gap: 8, margin: '16px 0 24px' }}>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ex. maçon, échafaudage, dalle…" style={{ flex: 1, padding: 12, border: '1px solid var(--line)', borderRadius: 9, fontFamily: 'inherit' }} />
        <button className="btn" type="submit">Rechercher</button>
      </form>
      {loading && <p className="muted">Recherche…</p>}
      {done && !loading && (
        <>
          <h2>Profils ({profs.length})</h2>
          {profs.length ? profs.map((p) => (
            <Link key={p.id} href={`/profil/${p.id}`} className="card" style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 10 }}>
              {p.avatar_url ? <img src={p.avatar_url} alt="" style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }} /> : <div className="pro-avatar">{(p.nom || 'U').charAt(0)}</div>}
              <div><strong>{p.nom}</strong><br /><span className="muted sm">{TYPE_LABEL[p.type] || p.type}{p.ville ? ` · ${p.ville}` : ''}</span></div>
            </Link>
          )) : <p className="muted">Aucun profil.</p>}
          <h2 style={{ marginTop: 24 }}>Besoins ({besoins.length})</h2>
          {besoins.length ? besoins.map((b) => {
            const t = BTYPE[b.type] || { label: b.type, color: '#666' }; const m = metierBySlug(b.metier);
            return (
              <div key={b.id} className="card" style={{ marginBottom: 10 }}>
                <span className="badge" style={{ color: t.color, background: t.color + '1a' }}>{t.label}</span>
                <h3 style={{ margin: '8px 0 4px' }}>{b.titre}</h3>
                <p className="muted sm">{m ? m.name : b.metier}{b.ville ? ` · ${b.ville}` : ''} · {ilya(b.created_at)}</p>
              </div>
            );
          }) : <p className="muted">Aucun besoin.</p>}
        </>
      )}
    </div></main>
  );
}
