'use client';
import { useId, useState } from 'react';
import { useRouter } from 'next/navigation';
import { METIERS } from '@/data/metiers';
import { VILLES } from '@/data/villes';
import { RECHERCHES_POPULAIRES } from '@/data/accueil';
import { IcRechercher } from '@/components/accueil/Icones';

/* ══════════════════════════════════════════════════════════
   BOÎTE DE RECHERCHE — le cœur du hero.
   Deux questions simples : quoi, et où.
   Elle ne crée aucune logique nouvelle : elle envoie vers
   /recherche, la recherche déjà en place dans l'application.
   ══════════════════════════════════════════════════════════ */
export default function BoiteRecherche({ compacte = false }) {
  const router = useRouter();
  const [quoi, setQuoi] = useState('');
  const [ou, setOu] = useState('');
  const idQuoi = useId();
  const idOu = useId();

  const lancer = (e) => {
    e.preventDefault();
    const q = quoi.trim();
    const v = ou.trim();
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (v) params.set('ville', v);
    // Sans mot-clé, on ouvre l'annuaire des membres filtré sur la localité.
    if (!q) { router.push(v ? `/membres?ville=${encodeURIComponent(v)}` : '/membres'); return; }
    router.push(`/recherche?${params.toString()}`);
  };

  return (
    <div className={'ay-boite' + (compacte ? ' ay-boite-compacte' : '')}>
      <form onSubmit={lancer} role="search" aria-label="Rechercher un professionnel">
        <div className="ay-champ">
          <label htmlFor={idQuoi}>De quoi avez-vous besoin ?</label>
          <span className="ay-champ-in">
            <IcRechercher taille={18} />
            <input id={idQuoi} name="q" type="search" value={quoi} list="ay-metiers"
              onChange={(e) => setQuoi(e.target.value)} autoComplete="off"
              placeholder="Métier, service, professionnel ou entreprise…" />
          </span>
        </div>

        <div className="ay-champ">
          <label htmlFor={idOu}>Où ?</label>
          <span className="ay-champ-in">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"
              strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 21s6.5-5.6 6.5-10.5A6.5 6.5 0 0 0 5.5 10.5C5.5 15.4 12 21 12 21z" />
              <circle cx="12" cy="10.4" r="2.4" />
            </svg>
            <input id={idOu} name="ville" type="text" value={ou} list="ay-villes"
              onChange={(e) => setOu(e.target.value)} autoComplete="address-level2"
              placeholder="Ville, commune ou localité" />
          </span>
        </div>

        <button className="ay-btn ay-btn-encre ay-boite-go" type="submit">
          <IcRechercher taille={18} /> Rechercher
        </button>
      </form>

      <datalist id="ay-metiers">
        {METIERS.map((m) => <option key={m.slug} value={m.name} />)}
      </datalist>
      <datalist id="ay-villes">
        {VILLES.filter((v) => v !== 'Autre localité').map((v) => <option key={v} value={v} />)}
      </datalist>

      <div className="ay-populaires">
        <span className="ay-populaires-t">Recherches populaires</span>
        <span className="ay-populaires-l">
          {RECHERCHES_POPULAIRES.map((r) => (
            <button key={r.slug} type="button" className="ay-puce"
              onClick={() => { setQuoi(r.label); router.push(`/membres?metier=${r.slug}`); }}>
              {r.label}
            </button>
          ))}
        </span>
      </div>
    </div>
  );
}
