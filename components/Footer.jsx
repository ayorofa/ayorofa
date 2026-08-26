import Link from 'next/link';
import Logo from '@/components/Logo';

/* §16 — Pied de page.
   Quatre colonnes, et rien qui mène nulle part : chaque lien
   pointe vers une page réellement en ligne. */
const COLONNES = [
  ['Découvrir', [
    ['Accueil', '/'],
    ['Professionnels', '/membres'],
    ['Métiers', '/annuaire'],
    ['Opportunités', '/besoins'],
    ['Comment ça marche ?', '/#comment-ca-marche'],
  ]],
  ['Pour les professionnels', [
    ['Créer mon profil', '/inscription'],
    ['Publier mes services', '/publier'],
    ['Développer ma visibilité', '/abonnements'],
    ['Vérifier mon profil', '/abonnements'],
    ['Tarifs', '/abonnements'],
  ]],
  ['Aide', [
    ['Centre d’aide', '/guides'],
    ['Questions fréquentes', '/#faq'],
    ['Contact', 'mailto:contact@ayorofa.com'],
    ['Signaler un problème', 'mailto:contact@ayorofa.com?subject=Signalement'],
  ]],
  ['Légal', [
    ['Conditions générales', '/cgu'],
    ['Politique de confidentialité', '/confidentialite'],
    ['Mentions légales', '/mentions-legales'],
    ['Politique de vérification', '/cgu#verification'],
  ]],
];

export default function Footer() {
  return (
    <footer className="ftr">
      <div className="wrap ftr-in">
        <div className="ftr-marque">
          <div className="brand">
            <span className="brand-logo"><Logo size={30} /></span>
            <span className="brand-mots">
              Ayôrôfa <b>Connect</b>
              <em>la maison du savoir</em>
            </span>
          </div>
          <p className="ftr-signature">Un besoin d’un côté. Un talent de l’autre.</p>
          <p className="muted ftr-lieu">Abidjan, Côte d’Ivoire · en français</p>
        </div>

        <div className="ftr-cols">
          {COLONNES.map(([titre, liens]) => (
            <nav key={titre} className="ftr-col" aria-label={titre}>
              <h2 className="ftr-col-t">{titre}</h2>
              <ul>
                {liens.map(([label, href]) => (
                  <li key={label}>
                    {href.startsWith('mailto:')
                      ? <a href={href}>{label}</a>
                      : <Link href={href}>{label}</Link>}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>
      <div className="wrap ftr-copy">
        © {new Date().getFullYear()} Ayôrôfa Connect — Abidjan, Côte d’Ivoire
      </div>
    </footer>
  );
}
