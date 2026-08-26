'use client';
import { IcTousMetiers, IcLocalite, IcVerifie, IcOpportunite } from '@/components/accueil/Icones';
import { NB_METIERS, NB_LOCALITES } from '@/data/accueil';
import { useDonneesAccueil } from '@/components/accueil/DonneesAccueil';

/* §05 — Statistiques.
   Les deux premiers chiffres viennent des catalogues du projet,
   les deux suivants de la base. Tant qu'un compte n'est pas
   revenu, on affiche « — » : on n'invente rien, on n'arrondit rien. */
export default function Statistiques() {
  const { stats, pret } = useDonneesAccueil();
  const nombre = (n) => (typeof n === 'number' ? n.toLocaleString('fr-FR') : (pret ? '—' : '…'));

  const lignes = [
    [IcTousMetiers, NB_METIERS.toString(), 'Métiers', 'Tous les corps de métier'],
    [IcLocalite, NB_LOCALITES.toString(), 'Localités', 'Partout en Côte d’Ivoire'],
    [IcVerifie, nombre(stats.professionnels), 'Professionnels', 'Profils avec un métier déclaré'],
    [IcOpportunite, nombre(stats.opportunites), 'Opportunités', 'Besoins, missions & emplois'],
  ];

  return (
    <section className="ay-stats" aria-label="La plateforme en chiffres">
      <div className="ay-cadre">
        <dl className="ay-stats-l">
          {lignes.map(([Icone, valeur, titre, detail]) => (
            <div key={titre} className="ay-stat">
              <span className="ay-stat-ic"><Icone taille={22} /></span>
              <div>
                <dt><span className="ay-stat-n">{valeur}</span> {titre}</dt>
                <dd>{detail}</dd>
              </div>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
