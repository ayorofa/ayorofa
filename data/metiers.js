// Métiers / centres d'intérêt de la plateforme
export const METIERS = [
  { slug: 'echafaudage',  name: 'Échafaudage',          desc: 'Location, montage et démontage' },
  { slug: 'maconnerie',   name: 'Maçonnerie',           desc: 'Gros œuvre, dalles, murs' },
  { slug: 'electricite',  name: 'Électricité',          desc: 'Installation et dépannage' },
  { slug: 'plomberie',    name: 'Plomberie',            desc: 'Sanitaire et canalisations' },
  { slug: 'peinture',     name: 'Peinture',             desc: 'Intérieur, façades, décoration' },
  { slug: 'carrelage',    name: 'Carrelage',            desc: 'Pose sols et murs' },
  { slug: 'menuiserie',   name: 'Menuiserie',           desc: 'Bois et aluminium' },
  { slug: 'climatisation',name: 'Climatisation & froid',desc: 'Installation et entretien' },
  { slug: 'soudure',      name: 'Soudure & métal',      desc: 'Structures et ferronnerie' },
  { slug: 'btp_divers',   name: 'BTP & services divers',desc: 'Autres corps de métier' },
];

export const metierBySlug = (slug) => METIERS.find((m) => m.slug === slug) || null;
