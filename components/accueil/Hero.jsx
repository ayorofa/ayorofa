import Link from 'next/link';
import BoiteRecherche from '@/components/accueil/BoiteRecherche';
import { Temple, IcRechercher, IcPlus } from '@/components/accueil/Icones';
import { PHOTOS } from '@/data/accueil';

/* Décor du hero : une silhouette urbaine dessinée pour Ayôrôfa —
   tours, immeubles bas et la ligne d'eau d'une lagune. Tracé
   original, aucun bâtiment ni logo identifiable n'est reproduit.
   Elle s'efface derrière la photo dès qu'une photo est fournie. */
function SilhouetteUrbaine() {
  return (
    <svg className="ay-hero-ville" viewBox="0 0 1200 320" preserveAspectRatio="xMidYMax slice"
      aria-hidden="true" focusable="false">
      <g fill="currentColor" opacity=".5">
        <rect x="40" y="180" width="46" height="140" />
        <rect x="96" y="132" width="34" height="188" />
        <rect x="140" y="206" width="58" height="114" />
        <rect x="208" y="96" width="40" height="224" />
        <rect x="258" y="160" width="30" height="160" />
        <rect x="300" y="214" width="66" height="106" />
        <rect x="378" y="118" width="44" height="202" />
        <rect x="432" y="188" width="36" height="132" />
        <rect x="478" y="72" width="52" height="248" />
        <rect x="542" y="150" width="30" height="170" />
        <rect x="584" y="200" width="70" height="120" />
        <rect x="666" y="110" width="42" height="210" />
        <rect x="718" y="172" width="32" height="148" />
        <rect x="760" y="220" width="62" height="100" />
        <rect x="834" y="140" width="38" height="180" />
        <rect x="882" y="196" width="48" height="124" />
        <rect x="942" y="104" width="36" height="216" />
        <rect x="988" y="182" width="56" height="138" />
        <rect x="1056" y="146" width="32" height="174" />
        <rect x="1098" y="210" width="62" height="110" />
      </g>
      {/* fenêtres allumées — la ville qui travaille */}
      <g fill="currentColor" opacity=".9">
        <rect x="216" y="118" width="6" height="8" /><rect x="230" y="140" width="6" height="8" />
        <rect x="216" y="164" width="6" height="8" /><rect x="486" y="96" width="6" height="8" />
        <rect x="500" y="124" width="6" height="8" /><rect x="486" y="152" width="6" height="8" />
        <rect x="674" y="134" width="6" height="8" /><rect x="688" y="162" width="6" height="8" />
        <rect x="950" y="128" width="6" height="8" /><rect x="950" y="164" width="6" height="8" />
        <rect x="104" y="156" width="6" height="8" /><rect x="386" y="142" width="6" height="8" />
      </g>
      {/* la lagune */}
      <g stroke="currentColor" strokeWidth="2" fill="none" opacity=".55">
        <path d="M0 296h1200" strokeDasharray="70 26" />
        <path d="M0 308h1200" strokeDasharray="34 44" />
      </g>
    </svg>
  );
}


export default function Hero() {
  const photo = PHOTOS.hero;
  return (
    <section className="ay-hero" aria-labelledby="ay-titre">
      <div className={'ay-hero-fond' + (photo && photo.src ? ' ay-hero-fond--photo' : '')} aria-hidden="true">
        {photo && photo.src
          ? <img className="ay-hero-photo" src={photo.src} alt="" fetchPriority="high" decoding="async" />
          : <SilhouetteUrbaine />}
      </div>

      <div className="ay-cadre ay-hero-in">
        <div className="ay-hero-texte">
          <p className="ay-surtitre">
            <Temple taille={16} /> Le réseau professionnel de la Côte d’Ivoire
          </p>

          <h1 id="ay-titre" className="ay-h1">
            Le professionnel qu’il vous faut est peut-être{' '}
            <span className="ay-or">à deux rues d’ici.</span>
          </h1>

          <p className="ay-chapo">
            Trouvez un artisan, une entreprise ou une opportunité près de chez vous.
            Découvrez des professionnels vérifiés, consultez leurs réalisations,
            comparez les avis et contactez-les directement.
          </p>

          <div className="ay-hero-actions">
            <Link href="/membres" className="ay-btn ay-btn-or">
              <IcRechercher taille={18} /> Trouver un professionnel
            </Link>
            <Link href="/publier" className="ay-btn ay-btn-contour">
              <IcPlus taille={18} /> Publier un besoin
            </Link>
          </div>
        </div>

        <div className="ay-hero-boite">
          <BoiteRecherche />
        </div>
      </div>
    </section>
  );
}
