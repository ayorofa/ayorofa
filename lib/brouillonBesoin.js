/* ══════════════════════════════════════════════════════════
   BROUILLON DE BESOIN

   Le bloc « Vous avez un projet ? » de la page d'accueil ne
   publie rien lui-même : il prépare le formulaire existant
   (/publier) et le laisse faire son travail — mêmes règles,
   mêmes contrôles, même table.

   Le texte passe par sessionStorage (il survit à un passage
   par la connexion). La photo, elle, ne peut pas être
   sérialisée : elle est gardée en mémoire le temps de la
   navigation, et /publier propose de toute façon son propre
   champ photo si elle n'a pas suivi.
   ══════════════════════════════════════════════════════════ */
const CLE = 'ayorofa-brouillon-besoin';
let fichierEnAttente = null;

export function poserBrouillon(champs, fichier) {
  try { sessionStorage.setItem(CLE, JSON.stringify(champs)); } catch (e) {}
  fichierEnAttente = fichier || null;
}

export function prendreBrouillon() {
  let champs = null;
  try {
    const brut = sessionStorage.getItem(CLE);
    if (brut) { champs = JSON.parse(brut); sessionStorage.removeItem(CLE); }
  } catch (e) {}
  const fichier = fichierEnAttente;
  fichierEnAttente = null;
  return champs ? { champs, fichier } : null;
}
