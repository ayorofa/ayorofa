// Corps de métiers & domaines — Côte d'Ivoire
// (les 10 premiers slugs sont conservés pour les annonces existantes)
export const METIERS = [
  // ── BTP & construction ──
  { slug: 'echafaudage',   name: 'Échafaudage' },
  { slug: 'maconnerie',    name: 'Maçonnerie' },
  { slug: 'electricite',   name: 'Électricité bâtiment' },
  { slug: 'plomberie',     name: 'Plomberie' },
  { slug: 'peinture',      name: 'Peinture & décoration' },
  { slug: 'carrelage',     name: 'Carrelage' },
  { slug: 'menuiserie',    name: 'Menuiserie (bois & alu)' },
  { slug: 'climatisation', name: 'Climatisation & froid' },
  { slug: 'soudure',       name: 'Soudure & ferronnerie' },
  { slug: 'btp_divers',    name: 'BTP & génie civil (divers)' },
  { slug: 'architecture',  name: 'Architecture & topographie' },
  { slug: 'etancheite',    name: 'Étanchéité & toiture' },
  { slug: 'vitrerie',      name: 'Vitrerie & miroiterie' },
  { slug: 'forage',        name: 'Forage & puits' },
  // ── Artisanat & services ──
  { slug: 'couture',       name: 'Couture & mode' },
  { slug: 'coiffure',      name: 'Coiffure & beauté' },
  { slug: 'esthetique',    name: 'Esthétique & onglerie' },
  { slug: 'bijouterie',    name: 'Bijouterie & horlogerie' },
  { slug: 'cordonnerie',   name: 'Cordonnerie & maroquinerie' },
  { slug: 'blanchisserie', name: 'Blanchisserie & pressing' },
  { slug: 'menage',        name: 'Ménage & aide à domicile' },
  { slug: 'jardinage',     name: 'Jardinage & espaces verts' },
  { slug: 'artisanat',     name: 'Artisanat & décoration' },
  // ── Auto, transport & logistique ──
  { slug: 'mecanique',     name: 'Mécanique auto / moto' },
  { slug: 'carrosserie',   name: 'Carrosserie & peinture auto' },
  { slug: 'transport',     name: 'Transport & logistique' },
  { slug: 'livraison',     name: 'Livraison & coursier' },
  { slug: 'chauffeur',     name: 'Chauffeur (VTC, taxi, poids lourd)' },
  // ── Alimentation & hôtellerie ──
  { slug: 'restauration',  name: 'Restauration & traiteur' },
  { slug: 'boulangerie',   name: 'Boulangerie & pâtisserie' },
  { slug: 'hotellerie',    name: 'Hôtellerie & tourisme' },
  // ── Commerce & gestion ──
  { slug: 'commerce',      name: 'Commerce & vente' },
  { slug: 'immobilier',    name: 'Immobilier' },
  { slug: 'comptabilite',  name: 'Comptabilité & gestion' },
  { slug: 'finance',       name: 'Finance & microfinance' },
  { slug: 'juridique',     name: 'Juridique & notariat' },
  { slug: 'marketing',     name: 'Communication & marketing' },
  { slug: 'evenementiel',  name: 'Événementiel & sonorisation' },
  // ── Digital & création ──
  { slug: 'informatique',  name: 'Informatique & digital' },
  { slug: 'telephonie',    name: 'Téléphonie & électronique' },
  { slug: 'energie',       name: 'Énergie solaire' },
  { slug: 'photographie',  name: 'Photographie & vidéo' },
  { slug: 'infographie',   name: 'Infographie & imprimerie' },
  { slug: 'musique',       name: 'Musique & arts' },
  { slug: 'media',         name: 'Journalisme & médias' },
  { slug: 'redaction',     name: 'Traduction & rédaction' },
  // ── Éducation, santé & sécurité ──
  { slug: 'enseignement',  name: 'Enseignement & formation' },
  { slug: 'sante',         name: 'Santé & bien-être' },
  { slug: 'securite',      name: 'Sécurité & gardiennage' },
  // ── Agriculture ──
  { slug: 'agriculture',   name: 'Agriculture & élevage' },
  { slug: 'peche',         name: 'Pêche & aquaculture' },
  // ──
  { slug: 'autres',        name: 'Autres métiers & services' },
];

export const metierBySlug = (slug) => METIERS.find((m) => m.slug === slug) || null;
