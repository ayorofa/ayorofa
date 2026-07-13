// Statut de présence : « En ligne » ou « Vu il y a … »
export function statutPresence(iso) {
  if (!iso) return { enLigne: false, texte: 'Hors ligne' };
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (s < 300) return { enLigne: true, texte: 'En ligne' };          // < 5 min
  if (s < 3600) return { enLigne: false, texte: `Vu il y a ${Math.floor(s / 60)} min` };
  if (s < 86400) return { enLigne: false, texte: `Vu il y a ${Math.floor(s / 3600)} h` };
  const j = Math.floor(s / 86400);
  if (j === 1) return { enLigne: false, texte: 'Vu hier' };
  if (j < 7) return { enLigne: false, texte: `Vu il y a ${j} jours` };
  return { enLigne: false, texte: 'Vu il y a longtemps' };
}
