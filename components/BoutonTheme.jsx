'use client';
import { useState, useEffect } from 'react';

// Bascule clair / sombre — mémorisée sur l'appareil.
export default function BoutonTheme() {
  const [sombre, setSombre] = useState(false);
  useEffect(() => {
    let pref = null;
    try { pref = localStorage.getItem('ayo-theme'); } catch (e) {}
    const s = pref === 'sombre';
    setSombre(s);
    document.documentElement.dataset.theme = s ? 'sombre' : 'clair';
  }, []);
  const basculer = () => {
    const s = !sombre;
    setSombre(s);
    document.documentElement.dataset.theme = s ? 'sombre' : 'clair';
    try { localStorage.setItem('ayo-theme', s ? 'sombre' : 'clair'); } catch (e) {}
  };
  return (
    <button className="btn-theme" onClick={basculer} aria-label={sombre ? 'Passer en mode clair' : 'Passer en mode sombre'}>
      {sombre ? '☀️' : '🌙'}
    </button>
  );
}
