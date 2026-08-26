/* ══════════════════════════════════════════════════════════
   PAGE D'ACCUEIL — contenus éditoriaux & emplacements photo.

   PHOTOGRAPHIES (règle de propriété intellectuelle)
   ─────────────────────────────────────────────────
   Aucune photographie n'est livrée avec le code : le cahier des
   charges interdit d'utiliser une image récupérée au hasard ou
   appartenant à un tiers sans licence.

   Pour habiller la page avec vos propres visuels :
     1. déposez vos fichiers dans  /public/photos/
     2. renseignez le chemin ci-dessous (ex. '/photos/hero-abidjan.webp')
     3. décrivez l'image dans « alt » (accessibilité + référencement)

   Tant qu'une valeur reste à null, la section affiche son décor
   dessiné (dégradé encre + or) : la page reste complète et rapide,
   sans image cassée ni contenu emprunté.

   Formats conseillés : WebP ou AVIF, largeur ≤ 1600 px pour le hero,
   ≤ 800 px pour les blocs, poids ≤ 250 Ko.
   ══════════════════════════════════════════════════════════ */
import { METIERS } from '@/data/metiers';
import { ABIDJAN, VILLES_CI } from '@/data/villes';

/* Repères de couverture — comptés sur les catalogues réels du projet,
   jamais saisis à la main (§05 et §23 du cahier des charges). */
export const NB_METIERS = METIERS.length;
export const NB_LOCALITES =
  ABIDJAN.length + VILLES_CI.filter((v) => v !== 'Autre localité').length;

export const PHOTOS = {
  // Grand visuel du hero — une scène professionnelle à Abidjan.
  hero: { src: null, alt: '' },
  // Bloc « Vous avez un projet ? »
  projet: { src: null, alt: '' },
  // Bloc « Vous êtes professionnel ? »
  professionnel: { src: null, alt: '' },
};

/* Recherches populaires proposées sous la barre du hero.
   Ce sont des métiers réels du catalogue (data/metiers.js). */
export const RECHERCHES_POPULAIRES = [
  { slug: 'plomberie', label: 'Plombier' },
  { slug: 'electricite', label: 'Électricien' },
  { slug: 'maconnerie', label: 'Maçon' },
  { slug: 'peinture', label: 'Peintre' },
  { slug: 'carrelage', label: 'Carreleur' },
  { slug: 'mecanique', label: 'Mécanicien' },
  { slug: 'coiffure', label: 'Coiffeuse' },
  { slug: 'menuiserie', label: 'Menuisier' },
];

/* Métiers mis en avant sur la page d'accueil (§06 du cahier des charges).
   Les slugs correspondent au catalogue réel : chaque carte mène à une
   recherche qui donne des résultats. */
export const METIERS_VEDETTES = [
  { slug: 'maconnerie', label: 'Maçonnerie' },
  { slug: 'plomberie', label: 'Plomberie' },
  { slug: 'electricite', label: 'Électricité' },
  { slug: 'peinture', label: 'Peinture' },
  { slug: 'carrelage', label: 'Carrelage' },
  { slug: 'menuiserie', label: 'Menuiserie' },
  { slug: 'mecanique', label: 'Mécanique' },
  { slug: 'coiffure', label: 'Coiffure & beauté' },
];

/* Les quatre temps du parcours (§10). */
export const ETAPES = [
  ['01', 'Recherchez', 'Trouvez un professionnel par métier, service ou localisation.'],
  ['02', 'Comparez', 'Consultez les profils, réalisations, avis et disponibilités.'],
  ['03', 'Contactez', 'Échangez directement avec le professionnel.'],
  ['04', 'Choisissez', 'Travaillez avec le professionnel qui correspond à votre besoin.'],
];

/* Les six raisons (§12). */
export const RAISONS = [
  ['coteDivoire', 'Pensé pour la Côte d’Ivoire', 'Une plateforme adaptée aux réalités locales.'],
  ['confiance', 'Plus de confiance', 'Profils vérifiés et avis clients.'],
  ['proche', 'Proche de vous', 'Recherche par ville, commune et localité.'],
  ['direct', 'Contact direct', 'Échangez directement avec les professionnels.'],
  ['partout', 'Accessible partout', 'Expérience pensée pour téléphone et ordinateur.'],
  ['paiement', 'Paiements adaptés', 'Solutions adaptées au contexte local.'],
];

/* Ce que la vitrine apporte au professionnel (§09). */
export const ATOUTS_PRO = [
  'Présentez vos services et réalisations',
  'Recevez des demandes de clients',
  'Développez votre réputation',
  'Soyez visible dans les recherches',
  'Gérez vos missions simplement',
];

/* Questions fréquentes — texte repris à l'identique de l'ancienne
   page d'accueil, pour ne perdre ni le contenu ni la donnée
   structurée FAQPage déjà indexée par les moteurs. */
export const FAQ = [
  ['Est-ce vraiment gratuit ?', 'Oui. S’inscrire, publier des besoins, contacter des professionnels et bâtir son réseau ne coûte rien. Les professionnels qui veulent plus de visibilité peuvent prendre le badge Vérifié ou un plan Pro, à partir de 2 000 F par mois.'],
  ['Que vaut le badge « Vérifié » ?', 'Il n’est pas automatique. Notre équipe contrôle l’identité, l’activité réelle et les références avant de l’attribuer. C’est ce qui vous distingue d’un profil créé en trois minutes ailleurs.'],
  ['Je n’ai pas d’entreprise déclarée, puis-je m’inscrire ?', 'Oui. Ayôrôfa Connect est fait pour l’économie réelle : artisans, indépendants, ateliers, PME. Ce qui compte, c’est votre savoir-faire et ce que vos clients disent de vous.'],
  ['Comment se passe le paiement ?', 'Par Mobile Money — Wave, Orange, MTN, Moov — depuis votre téléphone, en quelques secondes. Ni carte bancaire, ni compte en banque exigé.'],
  ['Mes données sont-elles protégées ?', 'Connexions chiffrées, messages privés visibles des seuls participants, et conformité à la loi ivoirienne n° 2013-450 sur la protection des données personnelles.'],
  ['Ça marche avec peu de connexion ?', 'L’application s’installe sur votre écran d’accueil, se charge vite et reste utilisable quand le réseau faiblit. Elle est pensée pour les téléphones d’ici.'],
];
