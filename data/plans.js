// Plans d'abonnement — Ayôrôfa Connect
// PUBLICATION_GRATUITE : true = publier reste gratuit (phase de lancement).
// Passe à false quand tu voudras activer le paiement.
export const PUBLICATION_GRATUITE = true;

export const PLANS = [
  {
    id: 'decouverte',
    nom: 'Découverte',
    prix: 0,
    periode: 'toujours',
    desc: 'Pour explorer la communauté et trouver ce dont vous avez besoin.',
    cta: 'Créer mon compte',
    href: '/inscription',
    atouts: [
      'Inscription gratuite',
      "Accès au fil d'actualité en temps réel",
      'Recherche de pros et de besoins',
      'Messagerie avec les membres',
      'Suggestions selon vos centres d’intérêt',
    ],
  },
  {
    id: 'pro',
    nom: 'Pro',
    prix: 3000,
    periode: 'par mois',
    desc: 'Pour publier vos besoins, vos offres et vos annonces.',
    cta: 'Choisir Pro',
    href: '/publier',
    vedette: true,
    atouts: [
      'Tout le plan Découverte',
      'Publiez vos besoins et vos offres',
      'Publiez vos offres d’emploi',
      'Vos annonces mises en avant dans le fil',
      'Statistiques de vues sur vos annonces',
    ],
  },
  {
    id: 'verifie',
    nom: 'Vérifié',
    prix: 10000,
    periode: 'par mois',
    desc: 'Pour inspirer confiance et être choisi en priorité.',
    cta: 'Devenir vérifié',
    href: '/contact-verification',
    top: true,
    atouts: [
      'Tout le plan Pro',
      'Badge « Profil vérifié » ✓',
      'Priorité dans les résultats de recherche',
      'Profil mis en avant dans l’annuaire',
      'Accompagnement par l’équipe Ayôrôfa',
    ],
  },
];
