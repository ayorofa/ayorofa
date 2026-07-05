'use client';
import { useState, useEffect } from 'react';
import { SPONSORS } from '@/data/sponsors';
export default function SponsorBanner({ slot = 'home' }) {
  const items = SPONSORS.filter((s) => !s.slot || s.slot === slot);
  const [i, setI] = useState(0);
  useEffect(() => {
    if (items.length < 2) return;
    const t = setInterval(() => setI((v) => (v + 1) % items.length), 8000);
    return () => clearInterval(t);
  }, [items.length]);
  if (!items.length) return null;
  const ad = items[i];
  return (
    <a className="sponsor" href={ad.url} target="_blank" rel="noopener sponsored">
      <span className="sponsor-tag">SPONSORISÉ</span>
      <span className="sponsor-fallback">{ad.alt}</span>
    </a>
  );
}
