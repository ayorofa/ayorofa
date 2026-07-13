// Professionnels vedettes — informations réelles (site officiel safechaf.com).
export const PROS = [
  {
    slug: 'safechaf',
    nom: 'SafEchaf',
    metier: 'echafaudage',
    ville: 'Koumassi',
    desc: "Location, montage et démontage d'échafaudages métalliques, tours d'escalier, étaiements et coffrages pour le BTP et l'industrie. La sécurité des hommes et du matériel en priorité, dans le respect de l'environnement. Références : Cargill, SIR, Ivoire Ingénierie.",
    adresse: "Immeuble adjacent NBIG Sécurité, Bd VGE, Koumassi — 07 BP 534 Abidjan 07",
    telephone: '+225 05 75 200 194',
    site: 'safechaf.com',
    note: 5.0,
    avis: 0,
    verifie: true,
  },
];

// ── Fonctions utilisées par les pages /pro/[slug], /annuaire et /guides ──
export const proBySlug = (slug) => PROS.find((p) => p.slug === slug) || null;
export const prosByMetier = (metier) => PROS.filter((p) => p.metier === metier);
export const prosByVille = (ville) => PROS.filter((p) => p.ville === ville);
export const prosVedettes = () => PROS.filter((p) => p.verifie);
export const getPro = proBySlug;

export default PROS;
