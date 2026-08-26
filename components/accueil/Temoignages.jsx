'use client';
import Avatar from '@/components/Avatar';
import { metierBySlug } from '@/data/metiers';
import { IcAvis } from '@/components/accueil/Icones';
import { useDonneesAccueil } from '@/components/accueil/DonneesAccueil';

/* §13 — Témoignages.
   Uniquement de vrais avis, écrits par de vrais membres, sur
   de vrais professionnels. Tant qu'il n'y en a pas, la section
   ne s'affiche pas : rien n'est fabriqué pour remplir la page. */
export default function Temoignages() {
  const { temoignages } = useDonneesAccueil();
  if (temoignages.length === 0) return null;

  return (
    <section className="ay-sec ay-sec-creme" aria-labelledby="ay-temo-t">
      <div className="ay-cadre">
        <div className="ay-sec-tete ay-sec-tete-centre">
          <div>
            <p className="ay-oeil">Ils l’ont vécu</p>
            <h2 id="ay-temo-t" className="ay-h2">Ce que disent les membres</h2>
          </div>
        </div>

        <ul className="ay-temoignages">
          {temoignages.map((t) => {
            const metier = t.cible && metierBySlug(t.cible.metier_principal);
            return (
              <li key={t.id}>
                <figure className="ay-temoignage">
                  <p className="ay-temoignage-note" aria-label={`Note : ${t.note} sur 5`}>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <IcAvis key={n} taille={15}
                        style={{ opacity: n <= t.note ? 1 : 0.22 }} />
                    ))}
                  </p>
                  <blockquote><p>{t.texte}</p></blockquote>
                  <figcaption>
                    <Avatar url={t.auteur.avatar_url} nom={t.auteur.nom} size={38} />
                    <span>
                      <strong>{t.auteur.nom}</strong>
                      <em>
                        {t.auteur.ville || 'Côte d’Ivoire'}
                        {t.cible && t.cible.nom ? ` · à propos de ${t.cible.nom}` : ''}
                        {metier ? ` (${metier.name})` : ''}
                      </em>
                    </span>
                  </figcaption>
                </figure>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
