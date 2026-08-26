import Link from 'next/link';
import { ATOUTS_PRO, PHOTOS } from '@/data/accueil';
import { IcVerifie, IcFleche } from '@/components/accueil/Icones';
import PanneauMarque from '@/components/accueil/PanneauMarque';

/* §09 — Pour les professionnels. */
export default function EspacePro() {
  const photo = PHOTOS.professionnel;
  return (
    <section className="ay-pro-bloc" aria-labelledby="ay-pro-bloc-t">
      <div className="ay-cadre ay-pro-bloc-in">
        <div className="ay-pro-bloc-visuel" aria-hidden={!(photo && photo.src)}>
          {photo && photo.src
            ? <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" />
            : <PanneauMarque variante="ay-motif-or" />}
        </div>

        <div className="ay-pro-bloc-texte">
          <p className="ay-oeil ay-oeil-clair">Espace professionnel</p>
          <h2 id="ay-pro-bloc-t" className="ay-h2 ay-h2-clair">Vous êtes professionnel ?</h2>
          <p className="ay-sous ay-sous-clair">
            Créez votre vitrine et laissez les clients découvrir votre savoir-faire.
          </p>

          <ul className="ay-atouts">
            {ATOUTS_PRO.map((a) => (
              <li key={a}><IcVerifie taille={18} /> {a}</li>
            ))}
          </ul>

          <div className="ay-hero-actions">
            <Link href="/inscription" className="ay-btn ay-btn-or">
              Créer mon profil professionnel
            </Link>
            <Link href="/abonnements" className="ay-lien-plus ay-lien-plus-clair">
              En savoir plus <IcFleche taille={17} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
