export const GUIDES = [
  { slug: 'prix-location-echafaudage-abidjan', titre: "Prix d'une location d'échafaudage à Abidjan (2026)", extrait: "Fourchettes de prix, ce qui fait varier le tarif, et comment payer moins cher.", },
  { slug: 'normes-securite-echafaudage', titre: 'Normes de sécurité échafaudage : le guide essentiel', extrait: "Les règles à connaître pour un chantier en sécurité et conforme.", },
  { slug: 'choisir-un-echafaudeur', titre: 'Comment choisir un bon échafaudeur ? 7 critères', extrait: "Vérifications, questions à poser et pièges à éviter avant de signer.", },
];
export const guideBySlug = (s) => GUIDES.find((g) => g.slug === s);
