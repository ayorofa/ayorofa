// Types d'annonces + affichage du temps relatif
export const BTYPE = {
  post:         { label: 'Publication',    color: '#8a6a3a' },
  demande:      { label: 'Demande',        color: '#2e7d5b' },
  offre_emploi: { label: "Offre d'emploi", color: '#a9863a' },
  recherche:    { label: 'Recherche',      color: '#24557a' },
};

export function ilya(iso) {
  if (!iso) return '';
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "à l'instant";
  if (s < 3600) return `il y a ${Math.floor(s / 60)} min`;
  if (s < 86400) return `il y a ${Math.floor(s / 3600)} h`;
  const j = Math.floor(s / 86400);
  if (j === 1) return 'hier';
  if (j < 30) return `il y a ${j} jours`;
  const m = Math.floor(j / 30);
  return m <= 1 ? 'il y a 1 mois' : `il y a ${m} mois`;
}
