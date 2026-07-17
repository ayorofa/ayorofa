'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HeroRecherche() {
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
