import Link from 'next/link';
import { Temple, IcRechercher } from '@/components/accueil/Icones';

/* §15 — CTA final. Palette Ayôrôfa : encre, or, ivoire. */
export default function CtaFinal() {
  return (
    <section className="ay-final" aria-labelledby="ay-final-t">
      <div className="ay-cadre ay-final-in">
        <span className="ay-final-emblem" aria-hidden="true"><Temple taille={38} /></span>
        <h2 id="ay-final-t" className="ay-h2 ay-h2-clair">
          Votre prochain client est peut-être déjà à la recherche de{' '}
          <span className="ay-or">votre savoir-faire.</span>
        </h2>
        <p className="ay-sous ay-sous-clair">
          Un besoin d’un côté. Un talent de l’autre.
        </p>
        <div className="ay-hero-actions">
          <Link href="/inscription" className="ay-btn ay-btn-or">Créer mon profil</Link>
          <Link href="/membres" className="ay-btn ay-btn-contour">
            <IcRechercher taille={18} /> Trouver un professionnel
          </Link>
        </div>
      </div>
    </section>
  );
}
