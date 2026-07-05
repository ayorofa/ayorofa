'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { metierBySlug } from '@/data/metiers';
import { BTYPE, ilya } from '@/lib/meta';

const TYPE_LABEL = { entreprise: 'Entreprise', particulier: 'Particulier', chercheur: "Chercheur d'emploi" };
const ghost = { background: 'transparent', border: '1px solid var(--line)', color: 'var(--text)' };

export default function Espace() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [sugg, setSugg] = useState([]);
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    let chB, chN;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/connexion'); return; }
      const me = user.id;
      const { data: p } = await supabase.from('profiles').select('*').eq('id', me).single();
      setProfile(p || { type: 'particulier', interets: [] });
      const interets = p?.interets || [];

      let q = supabase.from('besoins').select('*').neq('auteur', me).order('created_at', { ascending: false }).limit(20);
      if (interets.length) q = q.in('metier', interets);
      const { data: bs } = await q; setSugg(bs || []);

      const { data: ns } = await supabase.from('notifications')
        .select('id,lu,created_at,besoins(titre,metier,ville)')
        .eq('destinataire', me).order('created_at', { ascending: false }).limit(20);
      setNotifs(ns || []);
      setLoading(false);

      chB = supabase.channel('espace-besoins')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'besoins' }, (payload) => {
          const b = payload.new;
          if (b.auteur !== me && (interets.length === 0 || interets.includes(b.metier))) setSugg((c) => [b, ...c]);
        }).subscribe();

      chN = supabase.channel('espace-notifs')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `destinataire=eq.${me}` }, async (payload) => {
          const { data } = await supabase.from('notifications').select('id,lu,created_at,besoins(titre,metier,ville)').eq('id', payload.new.id).single();
          if (data) setNotifs((c) => [data, ...c]);
        }).subscribe();
    })();
    return () => { if (chB) supabase.removeChannel(chB); if (chN) supabase.removeChannel(chN); };
  }, [router]);

  const logout = async () => { await supabase.auth.signOut(); router.push('/'); };
  if (!supabase) return <main className="sec"><div className="wrap"><div className="card">Configuration Supabase manquante.</div></div></main>;
  if (loading) return <main className="sec"><div className="wrap"><p className="muted">Chargement…</p></div></main>;
  const interets = (profile?.interets || []).map((s) => metierBySlug(s)?.name || s);

  const BesoinCard = ({ b }) => {
    const t = BTYPE[b.type] || { label: b.type, color: '#666' };
    const m = metierBySlug(b.metier);
    return (
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
          <span className="badge" style={{ color: t.color, background: t.color + '1a' }}>{t.label}</span>
          <span className="muted sm">{ilya(b.created_at)}</span>
        </div>
        <h3 style={{ margin: '8px 0 4px' }}>{b.titre}</h3>
        <p className="muted sm">{m ? m.name : b.metier}{b.ville ? ` · ${b.ville}` : ''}</p>
      </div>
    );
  };

  return (
    <main className="sec"><div className="wrap" style={{ maxWidth: 820 }}>
      <p className="eyebrow">Mon espace</p>
      <h1>Bonjour {profile?.nom || ''} 👋</h1>
      <div className="card">
        <p><strong>Profil :</strong> {TYPE_LABEL[profile?.type] || profile?.type} · <strong>Ville :</strong> {profile?.ville || '—'}</p>
        <p><strong>Centres d’intérêt :</strong> {interets.join(', ') || '—'}</p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 8 }}>
          <Link className="btn btn-sm" href="/publier">Publier un besoin</Link>
          <Link className="btn btn-sm" href="/besoins" style={ghost}>Voir le fil</Link>
          <button className="btn btn-sm" onClick={logout} style={ghost}>Se déconnecter</button>
        </div>
      </div>

      <div style={{ marginTop: 28 }}>
        <p className="eyebrow">Notifications {notifs.length ? `(${notifs.length})` : ''}</p>
        <h2>Qui s’intéresse à vous</h2>
        {notifs.length ? (
          <div style={{ display: 'grid', gap: 10, marginTop: 10 }}>
            {notifs.map((n) => (
              <div key={n.id} className="card">
                <p style={{ margin: 0 }}>Quelqu’un est intéressé par : <strong>{n.besoins?.titre || 'votre annonce'}</strong></p>
                <p className="muted sm" style={{ margin: '4px 0 0' }}>{ilya(n.created_at)}</p>
              </div>
            ))}
          </div>
        ) : <p className="muted">Pas encore de notification. Publiez un besoin pour être contacté.</p>}
      </div>

      <div style={{ marginTop: 28 }}>
        <p className="eyebrow">Suggestions en temps réel 🔴</p>
        <h2>Selon vos centres d’intérêt</h2>
        {sugg.length ? (
          <div style={{ display: 'grid', gap: 12, marginTop: 10 }}>
            {sugg.map((b) => <BesoinCard key={b.id} b={b} />)}
          </div>
        ) : <p className="muted">Aucune suggestion pour l’instant. Elles apparaîtront ici, en direct, dès qu’un besoin correspond à vos intérêts.</p>}
      </div>
    </div></main>
  );
}
