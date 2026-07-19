'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { ilya } from '@/lib/meta';

export default function AdminErreurs() {
  const [admin, setAdmin] = useState(null);
  const [groupes, setGroupes] = useState([]);
  const [ouvert, setOuvert] = useState(null);
  const [busy, setBusy] = useState(false);

  const charger = async () => {
    const { data } = await supabase.from('erreurs').select('*')
      .order('created_at', { ascending: false }).limit(300);
    const rows = data || [];
    const map = new Map();
    rows.forEach((e) => {
      const cle = (e.message || '').slice(0, 120) + '|' + (e.page || '');
      if (!map.has(cle)) map.set(cle, { ...e, n: 1, membres: new Set([e.membre]) });
      else {
        const g = map.get(cle);
        g.n++;
        g.membres.add(e.membre);
      }
    });
    setGroupes([...map.values()].sort((a, b) => b.n - a.n));
  };

  useEffect(() => {
    if (!supabase) return;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = '/connexion'; return; }
      const { data: p } = await supabase.from('profiles').select('is_admin').eq('id', user.id).maybeSingle();
      if (!p?.is_admin) { setAdmin(false); return; }
      setAdmin(true);
      await charger();
    })();
  }, []);

  const vider = async () => {
    if (!window.confirm('Effacer tout le journal des erreurs ?')) return;
    setBusy(true);
    await supabase.from('erreurs').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    setBusy(false);
    await charger();
  };

  if (!supabase) return <main className="sec"><div className="wrap"><div className="card">Configuration manquante.</div></div></main>;
  if (admin === null) return <main className="sec"><div className="wrap"><p className="muted">Chargement…</p></div></main>;
  if (admin === false) return (
    <main className="sec"><div className="wrap"><div className="card">
      <p style={{ margin: 0 }}>Cette page est réservée à l’équipe Ayôrôfa.</p>
      <Link className="btn btn-sm" href="/fil" style={{ marginTop: 10 }}>Retour au fil</Link>
    </div></div></main>
  );

  return (
    <main className="sec"><div className="wrap" style={{ maxWidth: 780 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <div style={{ marginRight: 'auto' }}>
          <p className="eyebrow">Administration</p>
          <h1 style={{ margin: 0 }}>Journal des erreurs</h1>
        </div>
        {groupes.length > 0 && (
          <button className="btn btn-sm btn-ghost" onClick={vider} disabled={busy}>🗑 Vider</button>
        )}
      </div>

      <div className={'centre-etat' + (groupes.length === 0 ? ' ok' : '')}>
        {groupes.length === 0
          ? <><strong>✓ Aucune erreur enregistrée.</strong> Vos membres ne rencontrent aucun plantage.</>
          : <><strong>{groupes.length} type{groupes.length > 1 ? 's' : ''} d’erreur.</strong> Les plus fréquentes d’abord — ce sont celles qui gênent le plus de monde.</>}
      </div>

      <div style={{ display: 'grid', gap: 10, marginTop: 18 }}>
        {groupes.map((g, i) => (
          <div key={i} className="card">
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <strong style={{ fontSize: '.95rem' }}>{g.message}</strong>
                <p className="muted sm" style={{ margin: '4px 0 0' }}>
                  Page <code>{g.page || '?'}</code> · {g.n} fois · {g.membres.size} membre{g.membres.size > 1 ? 's' : ''} ·
                  dernière {ilya(g.created_at)}
                </p>
              </div>
              <span className="badge" style={{
                color: g.n >= 5 ? '#b3261e' : '#a9863a',
                background: (g.n >= 5 ? '#b3261e' : '#a9863a') + '1a',
              }}>{g.n}×</span>
            </div>
            {(g.pile || g.agent) && (
              <>
                <button className="btn btn-sm btn-ghost" style={{ marginTop: 10 }}
                  onClick={() => setOuvert(ouvert === i ? null : i)}>
                  {ouvert === i ? 'Masquer le détail' : 'Voir le détail technique'}
                </button>
                {ouvert === i && (
                  <div style={{ marginTop: 10 }}>
                    {g.agent && <p className="muted sm" style={{ margin: '0 0 6px' }}>Navigateur : {g.agent}</p>}
                    {g.pile && (
                      <pre style={{
                        background: '#F5F1E6', border: '1px solid var(--line)', borderRadius: 10,
                        padding: 12, fontSize: '.75rem', overflowX: 'auto', whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word', margin: 0,
                      }}>{g.pile}</pre>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      <p className="mention-legale">
        Les erreurs sont enregistrées automatiquement quand une page plante chez un membre.
        Consultez ce journal une fois par semaine : une erreur qui revient souvent est un membre
        qui abandonne. Videz-le après correction pour repartir sur une base propre.
      </p>

      <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
        <Link className="btn btn-sm btn-ghost" href="/admin-centre">📮 Centre de contrôle</Link>
        <Link className="btn btn-sm btn-ghost" href="/tableau-de-bord">📊 Tableau de bord</Link>
      </div>
    </div></main>
  );
}
