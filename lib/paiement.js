// Paiement — Ayôrôfa Connect
//
// PHASE 1 (maintenant) : paiement manuel assisté.
//   L'utilisateur paie par Mobile Money sur ton numéro, déclare sa référence,
//   et tu valides depuis /admin-plans. Aucun compte marchand requis.
//
// PHASE 2 (dès que ton RCCM est prêt) : passe MODE_AUTOMATIQUE à true et
//   renseigne tes clés CinetPay dans Vercel. Le paiement devient automatique.

export const MODE_AUTOMATIQUE = false;

// Ton numéro Mobile Money (paiement manuel)
export const MOBILE_MONEY = {
  wave:   { nom: 'Wave',         numero: '07 49 07 40 82' },
  orange: { nom: 'Orange Money', numero: '07 49 07 40 82' },
  mtn:    { nom: 'MTN MoMo',     numero: '07 49 07 40 82' },
  moov:   { nom: 'Moov Money',   numero: '07 49 07 40 82' },
};

export const WHATSAPP = '2250749074082';
