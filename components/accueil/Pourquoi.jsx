import { RAISONS } from '@/data/accueil';
import {
  IcCoteDivoire, IcConfiance, IcProche, IcDirect, IcPartout, IcMobileMoney,
} from '@/components/accueil/Icones';

const ICONES = {
  coteDivoire: IcCoteDivoire, confiance: IcConfiance, proche: IcProche,
  direct: IcDirect, partout: IcPartout, paiement: IcMobileMoney,
};

/* §12 — Pourquoi Ayôrôfa Connect ? */
export default function Pourquoi() {
  return (
    <section className="ay-sec" aria-labelledby="ay-pourquoi-t">
      <div className="ay-cadre">
        <div className="ay-sec-tete ay-sec-tete-centre">
          <div>
            <p className="ay-oeil">La maison du savoir</p>
            <h2 id="ay-pourquoi-t" className="ay-h2">Pourquoi choisir Ayôrôfa Connect ?</h2>
          </div>
        </div>

        <ul className="ay-raisons">
          {RAISONS.map(([cle, titre, texte]) => {
            const Icone = ICONES[cle];
            return (
              <li key={cle} className="ay-raison">
                <span className="ay-raison-ic"><Icone taille={22} /></span>
                <h3 className="ay-raison-t">{titre}</h3>
                <p className="ay-raison-d">{texte}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
