'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabaseClient';

/* ── Redirection : un membre connecté va droit à son fil ── */
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

/* ══════════════════════════════════════════════════════════
   L'APPARIEMENT — la signature de la page.
   Un besoin réel à gauche, le talent qui y répond à droite,
   reliés par un trait d'or qui se trace.
   ══════════════════════════════════════════════════════════ */
const PAIRES = [
  {
    besoin: { t: 'Carrelage 40 m² à poser', lieu: 'Yopougon', quand: 'il y a 4 min' },
    talent: { n: 'Kouassi B.', m: 'Carreleur', v: 'Yopougon', a: '8 ans', note: '4,8' },
  },
  {
    besoin: { t: '30 tenues pour une cérémonie', lieu: 'Treichville', quand: 'il y a 11 min' },
    talent: { n: 'Aya D.', m: 'Couturière', v: 'Treichville', a: '12 ans', note: '4,9' },
  },
  {
    besoin: { t: 'Panne électrique dans l’atelier', lieu: 'Koumassi', quand: 'il y a 20 min' },
    talent: { n: 'Traoré I.', m: 'Électricien', v: 'Koumassi', a: '6 ans', note: '4,7' },
  },
  {
    besoin: { t: 'Recrute 3 maçons — chantier', lieu: 'Bingerville', quand: 'il y a 32 min' },
    talent: { n: 'Yao K.', m: 'Maçon', v: 'Abidjan', a: '15 ans', note: '5,0' },
  },
  {
    besoin: { t: 'Groupe électrogène à réparer', lieu: 'Adjamé', quand: 'il y a 48 min' },
    talent: { n: 'Diarra S.', m: 'Mécanicien', v: 'Adjamé', a: '9 ans', note: '4,6' },
  },
];

export function Appariement() {
  const [i, setI] = useState(0);
  const [fige, setFige] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) { setFige(true); return; }
    const t = setInterval(() => setI((x) => (x + 1) % PAIRES.length), 3600);
    return () => clearInterval(t);
  }, []);

  const p = PAIRES[i];
  return (
    <div className="ay-match" aria-live="off">
      <div className="ay-match-col">
        <span className="ay-tag ay-tag-besoin">Un besoin</span>
        <div key={`b${i}`} className={'ay-fiche ay-fiche-besoin' + (fige ? '' : ' ay-anim')}>
          <p className="ay-fiche-t">{p.besoin.t}</p>
          <p className="ay-fiche-m">📍 {p.besoin.lieu} · {p.besoin.quand}</p>
        </div>
      </div>

      <div className="ay-lien" aria-hidden="true">
        <span className={'ay-lien-trait' + (fige ? '' : ' ay-anim')} />
        <span className="ay-lien-pt">✦</span>
      </div>

      <div className="ay-match-col">
        <span className="ay-tag ay-tag-talent">Un talent</span>
        <div key={`t${i}`} className={'ay-fiche ay-fiche-talent' + (fige ? '' : ' ay-anim')}>
          <p className="ay-fiche-t">
            {p.talent.n} <span className="ay-verif" title="Profil vérifié">✔</span>
          </p>
          <p className="ay-fiche-m">{p.talent.m} · {p.talent.a} · {p.talent.v}</p>
          <p className="ay-fiche-note">★ {p.talent.note}</p>
        </div>
      </div>
    </div>
  );
}

/* ── Recherche du hero ── */
export function HeroRecherche() {
  const [q, setQ] = useState('');
  const router = useRouter();
  const go = (e) => {
    e.preventDefault();
    router.push(q.trim() ? `/recherche?q=${encodeURIComponent(q.trim())}` : '/membres');
  };
  return (
    <form className="ay-search" onSubmit={go} role="search">
      <input value={q} onChange={(e) => setQ(e.target.value)}
        placeholder="Un métier, un nom, une ville…"
        aria-label="Rechercher un professionnel ou un service" />
      <button className="ay-btn ay-btn-or" type="submit">Chercher</button>
    </form>
  );
}

/* ── Chiffres réels de la plateforme ── */
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
    [F(n.annonces), 'annonces'],
    ['52', 'métiers'],
    ['82', 'localités'],
  ];
  return (
    <div className="ay-stats">
      {stats.map(([v, l]) => (
        <div key={l} className="ay-stat">
          <span className="ay-stat-n">{v}</span>
          <span className="ay-stat-l">{l}</span>
        </div>
      ))}
    </div>
  );
}
