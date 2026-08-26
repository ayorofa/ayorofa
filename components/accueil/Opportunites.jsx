'use client';
import Link from 'next/link';
import { metierBySlug } from '@/data/metiers';
import { BTYPE, ilya } from '@/lib/meta';
import { IcFleche, IcLocalite, IcHorloge, IcOpportunite } from '@/components/accueil/Icones';
import { useDonneesAccueil } from '@/components/accueil/DonneesAccueil';

/* §11 — Opportunités.
   Uniquement de vraies annonces publiées sur la plateforme.
   S'il n'y en a aucune, la section disparaît. */
export default function Opportunites() {
  const { opportunites, pret } = useDonneesAccueil();

  if (pret && opportunites.length === 0) return null;

  return (
    <section className="ay-sec ay-sec-creme" aria-labelledby="ay-opp-t">
      <div className="ay-cadre">
        <div className="ay-sec-tete">
          <div>
            <p className="ay-oeil">En direct</p>
            <h2 id="ay-opp-t" className="ay-h2">Les opportunités sont aussi sur Ayôrôfa.</h2>
            <p className="ay-sous">Emplois, missions, prestations et recrutements publiés par la communauté.</p>
          </div>
          <Link href="/besoins" className="ay-lien-plus">
            Voir toutes les opportunités <IcFleche taille={17} />
          </Link>
        </div>

        {!pret ? (
          <ul className="ay-opps" aria-hidden="true">
            {[0, 1, 2].map((k) => <li key={k}><span className="ay-opp ay-squelette" /></li>)}
          </ul>
        ) : (
          <ul className="ay-opps">
            {opportunites.map((o) => {
              const t = BTYPE[o.type] || { label: o.type };
              const m = metierBySlug(o.metier);
              return (
                <li key={o.id}>
                  <Link href={`/annonce/${o.id}`} className="ay-opp">
                    <span className="ay-opp-ic"><IcOpportunite taille={20} /></span>
                    <span className="ay-opp-type">{t.label}</span>
                    <h3 className="ay-opp-t">{o.titre}</h3>
                    <p className="ay-opp-m">
                      {m ? m.name : o.metier}
                      {o.ville ? <> · <IcLocalite taille={14} /> {o.ville}</> : null}
                    </p>
                    <p className="ay-opp-q"><IcHorloge taille={14} /> {ilya(o.created_at)}</p>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
