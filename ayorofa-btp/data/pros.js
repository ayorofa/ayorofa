// Données d'exemple. À remplacer par ta base (Prisma/PostgreSQL).
export const PROS = [
  { slug: 'safechaf', nom: 'SafEchaf', metier: 'echafaudage', ville: 'Cocody', note: 4.9, avis: 37, verifie: true, tel: '+225 07 49 07 40 82', desc: "Spécialiste de l'échafaudage : montage, location et sécurité de chantier. Plus de 10 ans d'expérience à Abidjan." },
  { slug: 'kone-btp', nom: 'Koné BTP', metier: 'maconnerie', ville: 'Yopougon', note: 4.7, avis: 24, verifie: true, tel: '', desc: 'Maçonnerie générale : fondations, murs, dalles. Devis rapide et travail soigné.' },
  { slug: 'ivoire-peinture', nom: 'Ivoire Peinture', metier: 'peinture', ville: 'Marcory', note: 4.6, avis: 18, verifie: false, tel: '', desc: 'Peinture intérieure et ravalement de façade. Finitions premium.' },
  { slug: 'volt-ci', nom: 'Volt CI', metier: 'electricite', ville: 'Plateau', note: 4.8, avis: 31, verifie: true, tel: '', desc: 'Installations électriques et mise aux normes pour particuliers et entreprises.' },
  { slug: 'aqua-plomberie', nom: 'Aqua Plomberie', metier: 'plomberie', ville: 'Treichville', note: 4.5, avis: 12, verifie: false, tel: '', desc: 'Plomberie sanitaire, réseaux et dépannage 7j/7.' },
  { slug: 'carro-deco', nom: 'Carro Déco', metier: 'carrelage', ville: 'Abobo', note: 4.7, avis: 20, verifie: true, tel: '', desc: 'Pose de carrelage, faïence et mosaïque. Sols et murs.' },
  { slug: 'toit-plus', nom: 'Toit Plus', metier: 'charpente', ville: 'Bingerville', note: 4.6, avis: 15, verifie: false, tel: '', desc: 'Charpente bois et métal, couverture et toiture.' },
  { slug: 'etanch-pro', nom: 'Étanch Pro', metier: 'etancheite', ville: 'Koumassi', note: 4.8, avis: 22, verifie: true, tel: '', desc: 'Étanchéité de terrasses et toitures. Garantie décennale.' },
  { slug: 'batir-ci', nom: 'Bâtir CI', metier: 'maconnerie', ville: 'Cocody', note: 4.9, avis: 40, verifie: true, tel: '', desc: 'Entreprise générale du bâtiment. Gros œuvre et second œuvre.' },
  { slug: 'lumiere-elec', nom: 'Lumière Élec', metier: 'electricite', ville: 'Yopougon', note: 4.4, avis: 9, verifie: false, tel: '', desc: 'Dépannage électrique rapide et installations domestiques.' },
];
export const proBySlug = (s) => PROS.find((p) => p.slug === s);
