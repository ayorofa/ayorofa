'use client';
import Link from 'next/link';
import Avatar from '@/components/Avatar';
import BadgeVerifie from '@/components/BadgeVerifie';
import { metierBySlug } from '@/data/metiers';
import { IcFleche, IcLocalite, IcAvis } from '@/components/accueil/Icones';
import { useDonneesAccueil } from '@/components/accueil/DonneesAccueil';

/* §07 — Des professionnels près de chez vous.
   Les cartes ne montrent que des membres réellement inscrits.
   Un champ vide (note, expérience, spécialités) disparaît au
   lieu d'être comblé : aucun profil n'est inventé ni embelli.
   Sur mobile, la liste devient un carrousel tactile. */
export default function ProsProches() {
  const { pros, pret } = useDonneesAccueil();

  if (pret && pros.length === 0) return null;

  return (
    <section className="ay-sec ay-sec-creme" aria-labelledby="ay-pros-t">
      <div className="ay-cadre">
        <div className="ay-sec-tete">
          <div>
            <p className="ay-oeil">Professionnels</p>
            <h2 id="ay-pros-t" className="ay-h2">Des professionnels près de chez vous</h2>
            <p className="ay-sous">Découvrez des professionnels inscrits et évalués par la communauté.</p>
          </div>
          <Link href="/membres" className="ay-lien-plus">
            Voir tous les professionnels <IcFleche taille={17} />
          </Link>
        </div>

        {!pret ? (
          <ul className="ay-pros" aria-hidden="true">
            {[0, 1, 2, 3].map((k) => <li key={k}><span className="ay-pro ay-squelette" /></li>)}
          </ul>
        ) : (
          <ul className="ay-pros">
            {pros.map((p) => {
              const metier = metierBySlug(p.metier_principal);
              const specialites = (p.competences || []).slice(0, 2);
              return (
                <li key={p.id}>
                  <article className="ay-pro">
                    <div className="ay-pro-tete">
                      <Avatar url={p.avatar_url} nom={p.nom} size={48} />
                      {p.verifie && <span className="ay-pro-badge"><BadgeVerifie size="sm" /></span>}
                    </div>

                    <h3 className="ay-pro-nom">{p.nom || 'Professionnel'}</h3>
                    <p className="ay-pro-metier">{metier ? metier.name : p.metier_principal}</p>
                    {p.entreprise && <p className="ay-pro-entreprise">{p.entreprise}</p>}

                    {p.ville && (
                      <p className="ay-pro-ligne"><IcLocalite taille={15} /> {p.ville}</p>
                    )}
                    {p.nbAvis > 0 && (
                      <p className="ay-pro-ligne ay-pro-note">
                        <IcAvis taille={15} /> {p.note.toFixed(1).replace('.', ',')}
                        <span> ({p.nbAvis} avis)</span>
                      </p>
                    )}
                    {p.experience_annees > 0 && (
                      <p className="ay-pro-ligne">{p.experience_annees} an{p.experience_annees > 1 ? 's' : ''} d’expérience</p>
                    )}

                    {specialites.length > 0 && (
                      <ul className="ay-pro-tags">
                        {specialites.map((s) => <li key={s}>{s}</li>)}
                      </ul>
                    )}

                    <Link href={`/profil/${p.id}`} className="ay-btn ay-btn-contour-encre ay-pro-cta">
                      Voir le profil
                    </Link>
                  </article>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
