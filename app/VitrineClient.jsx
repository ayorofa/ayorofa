'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabaseClient';

export function RedirectSiConnecte() {
  const router = useRouter();
  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) router.replace('/fil');
    });
  }, [router]);
  return null;
}

export function HeroRecherche() {
  const [q, setQ] = useState('');
  const router = useRouter();
  const go = (e) => {
    e.preventDefault();
    router.push(q.trim() ? `/recherche?q=${encodeURIComponent(q.trim())}` : '/membres');
  };
  return (
    <form className="v-search" onSubmit={go} role="search">
      <input value={q} onChange={(e) => setQ(e.target.value)}
        placeholder="Que cherchez-vous ? maçon, couturière, électricien…"
        aria-label="Rechercher un professionnel ou un service" />
      <button className="btn" type="submit">Rechercher</button>
    </form>
  );
}

export function StatsDirect() {
  const [n, setN] = useState({ membres: null, annonces: null });
  useEffect(() => {
    if (!supabase) return;
    (async () => {
      try {
        const [{ count: m }, { count: a }] = await Promise.all([
          supabase.from('profiles').select('id', { count: 'exact', head: true }),
          supabase.from('besoins').select('id', { count: 'exact', head: true }),
        ]);
        setN({ membres: m, annonces: a });
      } catch (e) {}
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
