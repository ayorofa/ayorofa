// Paiement — Ayôrôfa Connect
//
// AUTOMATIQUE : dès que les clés CinetPay sont dans Vercel, l'utilisateur est
// redirigé vers la page de paiement Mobile Money (Wave, Orange, MTN, Moov).
// Après paiement, CinetPay prévient notre serveur, qui active le plan
// ET le badge « Vérifié » automatiquement.
//
// MANUEL (secours) : si les clés ne sont pas configurées, on affiche le
// paiement manuel (numéro + déclaration), validé depuis /admin-plans.

export const MOBILE_MONEY_NUMERO = '07 49 07 40 82';
export const WHATSAPP = '2250749074082';

// true si les clés CinetPay sont présentes côté serveur
export const cinetpayActif = () =>
  Boolean(process.env.CINETPAY_API_KEY && process.env.CINETPAY_SITE_ID);
