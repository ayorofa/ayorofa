'use client';
import Link from 'next/link';
import { METIERS_VEDETTES } from '@/data/accueil';
import { useDonneesAccueil } from '@/components/accueil/DonneesAccueil';
import {
  IcMaconnerie, IcPlomberie, IcElectricite, IcPeinture, IcCarrelage,
  IcMenuiserie, IcMecanique, IcCoiffure, IcTousMetiers, IcFleche,
} from '@/components/accueil/Icones';

const ICONES = {
  maconnerie: IcMaconnerie, plomberie: IcPlomberie, electricite: IcElectricite,
  peinture: IcPeinture, carrelage: IcCarrelage, menuiserie: IcMenuiserie,
  mecanique: IcMecanique, coiffure: IcCoiffure,
};

/* §06 — Métiers populaires.
   Le compteur n'apparaît que là où des professionnels sont
   réellement inscrits : une carte sans inscrit reste une porte
   d'entrée, pas une fausse promesse. */
export default function Metiers() {
  const { metiers } = useDonneesAccueil();

  return (
    <section className="ay-sec" aria-labelledby="ay-metiers-t">
      <div className="ay-cadre">
        <div className="ay-sec-tete">
          <div>
            <p className="ay-oeil">Métiers</p>
            <h2 id="ay-metiers-t" className="ay-h2">Trouvez le savoir-faire qu’il vous faut</h2>
          </div>
          <Link href="/membres" className="ay-lien-plus">
            Voir tous les métiers <IcFleche taille={17} />
          </Link>
        </div>

        <ul className="ay-metiers">
          {METIERS_VEDETTES.map(({ slug, label }) => {
            const Icone = ICONES[slug] || IcTousMetiers;
            const n = metiers[slug] || 0;
            return (
              <li key={slug}>
                <Link href={`/membres?metier=${slug}`} className="ay-metier">
                  <span className="ay-metier-ic"><Icone taille={26} /></span>
                  <span className="ay-metier-n">{label}</span>
                  {n > 0 && <span className="ay-metier-c">{n} pro{n > 1 ? 's' : ''}</span>}
                </Link>
              </li>
            );
          })}
          <li>
            <Link href="/membres" className="ay-metier ay-metier-tous">
              <span className="ay-metier-ic"><IcTousMetiers taille={26} /></span>
              <span className="ay-metier-n">Tous les métiers</span>
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}
