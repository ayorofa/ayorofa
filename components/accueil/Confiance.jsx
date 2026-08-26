import { IcVerifie, IcAvis, IcLocalite, IcPaiement } from '@/components/accueil/Icones';
import { NB_LOCALITES } from '@/data/accueil';

/* §04 — Indicateurs de confiance.
   Quatre repères vérifiables. Aucun chiffre d'audience,
   aucune promesse invérifiable : seulement ce que la
   plateforme fait réellement. */
const REPERES = [
  [IcVerifie, 'Profils vérifiés', 'Contrôlés par notre équipe'],
  [IcAvis, 'Avis clients', 'Déposés par de vrais clients'],
  [IcLocalite, 'Partout en Côte d’Ivoire', `${NB_LOCALITES} localités au catalogue`],
  [IcPaiement, 'Paiement mobile', 'Wave, Orange, MTN, Moov'],
];

export default function Confiance() {
  return (
    <section className="ay-confiance" aria-label="Nos repères de confiance">
      <div className="ay-cadre">
        <ul className="ay-confiance-l">
          {REPERES.map(([Icone, titre, detail]) => (
            <li key={titre}>
              <span className="ay-confiance-ic"><Icone taille={20} /></span>
              <span>
                <strong>{titre}</strong>
                <em>{detail}</em>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
