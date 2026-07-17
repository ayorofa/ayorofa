'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function StatsDirect() {
  const [n, setN] = useState({ membres: null, annonces: null });
  useEffect(() => {
    if (!supabase) return;
    (async () => {
      const [{ count: m }, { count: a }] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('besoins').select('id', { count: 'exact', head: true }),
      ]);
      setN({ membres: m, annonces: a });
    })();
  }, []);
  const F = (x) => (x === null ? '—' : x.toLocaleString('fr-FR'));
  const stats = [
    [F(n.membres), 'membres'],
    [F(n.annonces), 'annonces publiées'],
    ['52', 'corps de métiers'],
    ['82', 'localités couvertes'],
  ];
  return (
    <div className="v-stats">
      {stats.map(([v, l]) => (
        <div key={l} className="v-stat">
          <span className="v-stat-n">{v}</span>
          <span className="v-stat-l">{l}</span>
        </div>
      ))}
    </div>
  );
}
