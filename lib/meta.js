export const BTYPE = {
  demande:      { label: 'Demande',            color: '#9c7421' },
  offre_emploi: { label: "Offre d'emploi",     color: '#2e7d5b' },
  recherche:    { label: "Recherche d'emploi", color: '#2f5a8a' },
};
export function ilya(iso) {
  const d = new Date(iso), s = (Date.now() - d.getTime()) / 1000;
  if (s < 60) return "à l'instant";
  if (s < 3600) return `il y a ${Math.floor(s / 60)} min`;
  if (s < 86400) return `il y a ${Math.floor(s / 3600)} h`;
  return d.toLocaleDateString('fr-FR');
}
