export const METIERS = [
  { slug: 'echafaudage', name: 'Échafaudage', desc: 'Montage, location et démontage sécurisés.' },
  { slug: 'maconnerie', name: 'Maçonnerie', desc: 'Construction, murs, dalles, fondations.' },
  { slug: 'peinture', name: 'Peinture & façade', desc: 'Intérieur, extérieur, ravalement.' },
  { slug: 'electricite', name: 'Électricité', desc: 'Installation et mise aux normes.' },
  { slug: 'plomberie', name: 'Plomberie', desc: 'Sanitaire, réseaux, dépannage.' },
  { slug: 'carrelage', name: 'Carrelage', desc: 'Sols, murs, faïence.' },
  { slug: 'charpente', name: 'Charpente & toiture', desc: 'Bois, métal, couverture.' },
  { slug: 'etancheite', name: 'Étanchéité', desc: 'Terrasses, toitures, sous-sols.' },
];
export const metierBySlug = (s) => METIERS.find((m) => m.slug === s);
