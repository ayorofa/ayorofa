/* ══════════════════════════════════════════════════════════
   ICÔNES AYÔRÔFA — dessinées pour la maison, à la main.
   Trait unique, 24×24, `currentColor` : elles prennent la
   couleur du contexte (or sur fond sombre, encre sur ivoire).
   Aucune icône propriétaire, aucune reprise d'une autre marque.
   ══════════════════════════════════════════════════════════ */

function Trait({ children, taille = 24, ...reste }) {
  return (
    <svg viewBox="0 0 24 24" width={taille} height={taille} fill="none"
      stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true" focusable="false" {...reste}>
      {children}
    </svg>
  );
}

/* ── Métiers ── */
export const IcMaconnerie = (p) => (
  <Trait {...p}><path d="M3 20h18" /><path d="M5 20v-4h6v4" /><path d="M13 20v-7h6v7" />
    <path d="M5 16h6M13 13h6M8 16v4M16 13v7" /><path d="M7 12l3-3 3 3" /></Trait>
);
export const IcPlomberie = (p) => (
  <Trait {...p}><path d="M5 5v5a4 4 0 0 0 4 4h4" /><path d="M13 11h5v6h-5z" />
    <path d="M3 3h4v4H3z" /><path d="M15 17v2M15 21h.01" /></Trait>
);
export const IcElectricite = (p) => (
  <Trait {...p}><path d="M13 2 4.5 13.5H11l-1 8.5 8.5-11.5H12z" /></Trait>
);
export const IcPeinture = (p) => (
  <Trait {...p}><path d="M4 4h13v5H4z" /><path d="M17 6.5h3v4h-8v3" /><path d="M10 13.5h4v7h-4z" /></Trait>
);
export const IcCarrelage = (p) => (
  <Trait {...p}><path d="M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z" /></Trait>
);
export const IcMenuiserie = (p) => (
  <Trait {...p}><path d="M3 7h13l5 5-5 5H3z" /><path d="M3 7v10" />
    <path d="M8 9v6M12 9v6" /></Trait>
);
export const IcMecanique = (p) => (
  <Trait {...p}><circle cx="12" cy="12" r="3.2" />
    <path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M18.4 5.6l-1.8 1.8M7.4 16.6l-1.8 1.8" /></Trait>
);
export const IcCoiffure = (p) => (
  <Trait {...p}><circle cx="6" cy="18" r="2.6" /><circle cx="18" cy="18" r="2.6" />
    <path d="M7.8 16.2 19 4M16.2 16.2 5 4" /></Trait>
);
export const IcTousMetiers = (p) => (
  <Trait {...p}><circle cx="6" cy="6" r="1.2" fill="currentColor" /><circle cx="12" cy="6" r="1.2" fill="currentColor" />
    <circle cx="18" cy="6" r="1.2" fill="currentColor" /><circle cx="6" cy="12" r="1.2" fill="currentColor" />
    <circle cx="12" cy="12" r="1.2" fill="currentColor" /><circle cx="18" cy="12" r="1.2" fill="currentColor" />
    <circle cx="6" cy="18" r="1.2" fill="currentColor" /><circle cx="12" cy="18" r="1.2" fill="currentColor" />
    <circle cx="18" cy="18" r="1.2" fill="currentColor" /></Trait>
);

/* ── Confiance & repères ── */
export const IcVerifie = (p) => (
  <Trait {...p}><path d="M12 3 4.5 6v5.5c0 4.4 3.1 8.2 7.5 9.5 4.4-1.3 7.5-5.1 7.5-9.5V6z" />
    <path d="m8.8 12 2.2 2.2 4.2-4.4" /></Trait>
);
export const IcAvis = (p) => (
  <Trait {...p}><path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9L3.5 9.7l5.9-.8z" /></Trait>
);
export const IcLocalite = (p) => (
  <Trait {...p}><path d="M12 21s6.5-5.6 6.5-10.5A6.5 6.5 0 0 0 5.5 10.5C5.5 15.4 12 21 12 21z" />
    <circle cx="12" cy="10.4" r="2.4" /></Trait>
);
export const IcPaiement = (p) => (
  <Trait {...p}><rect x="6.5" y="2.5" width="11" height="19" rx="2.5" />
    <path d="M10 5.5h4" /><path d="M9.5 12.5h5M12 10v5" /><path d="M11 19h2" /></Trait>
);

/* ── Comment ça marche ── */
export const IcRechercher = (p) => (
  <Trait {...p}><circle cx="10.5" cy="10.5" r="6.5" /><path d="m15.5 15.5 4.5 4.5" /></Trait>
);
export const IcComparer = (p) => (
  <Trait {...p}><path d="M4 6h7M4 12h7M4 18h7" /><path d="M15 8.5 17.5 6 20 8.5" />
    <path d="M17.5 6v12" /></Trait>
);
export const IcContacter = (p) => (
  <Trait {...p}><path d="M20 5H8a3 3 0 0 0-3 3v5a3 3 0 0 0 3 3h1v3.5L13.5 16H20a0 0 0 0 0 0 0" />
    <path d="M21 8v5a3 3 0 0 1-3 3" /><path d="M9 10h7M9 13h4" /></Trait>
);
export const IcChoisir = (p) => (
  <Trait {...p}><path d="M4 12.5 9 17.5 20 6.5" /><path d="M4 19h16" /></Trait>
);

/* ── Pourquoi Ayôrôfa Connect ── */
export const IcCoteDivoire = (p) => (
  <Trait {...p}><circle cx="12" cy="12" r="9" /><path d="M3.5 9.5h17M3.5 14.5h17" />
    <path d="M12 3c2.6 2.6 4 5.6 4 9s-1.4 6.4-4 9c-2.6-2.6-4-5.6-4-9s1.4-6.4 4-9z" /></Trait>
);
export const IcConfiance = (p) => (
  <Trait {...p}><path d="M12 3 4.5 6v5.5c0 4.4 3.1 8.2 7.5 9.5 4.4-1.3 7.5-5.1 7.5-9.5V6z" />
    <circle cx="12" cy="11" r="2.2" /><path d="M8.5 17c.8-1.6 2-2.4 3.5-2.4s2.7.8 3.5 2.4" /></Trait>
);
export const IcProche = (p) => (
  <Trait {...p}><circle cx="12" cy="12" r="2.5" /><path d="M12 4.5v2M12 17.5v2M4.5 12h2M17.5 12h2" />
    <circle cx="12" cy="12" r="7.5" strokeDasharray="3 3" /></Trait>
);
export const IcDirect = (p) => (
  <Trait {...p}><path d="M4 7h8v7H8l-3 2.5V14H4z" /><path d="M20 10h-4v7h1v2.5L20 17h0z" />
    <path d="M12 10.5V7h8v3.5" /></Trait>
);
export const IcPartout = (p) => (
  <Trait {...p}><rect x="2.5" y="5" width="13" height="9.5" rx="1.5" /><path d="M6 18.5h6" />
    <rect x="17" y="9" width="4.5" height="10" rx="1.5" /></Trait>
);
export const IcMobileMoney = (p) => (
  <Trait {...p}><rect x="7" y="2.5" width="10" height="19" rx="2.5" />
    <circle cx="12" cy="11.5" r="2.8" /><path d="M12 8.7v5.6M10.6 10.3h2.8M10.6 12.7h2.8" /></Trait>
);

/* ── Utilitaires ── */
export const IcFleche = (p) => (
  <Trait {...p}><path d="M4 12h15" /><path d="m13.5 6.5 6 5.5-6 5.5" /></Trait>
);
export const IcPlus = (p) => (
  <Trait {...p}><path d="M12 5v14M5 12h14" /></Trait>
);
export const IcPhoto = (p) => (
  <Trait {...p}><rect x="3" y="5.5" width="18" height="13" rx="2.5" />
    <circle cx="9" cy="10.5" r="1.8" /><path d="m4.5 17 4.5-4 3.5 3 3-2.5 4 3.5" /></Trait>
);
export const IcOpportunite = (p) => (
  <Trait {...p}><rect x="3" y="7" width="18" height="12.5" rx="2.5" />
    <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7" />
    <path d="M3 12.5h18" /></Trait>
);
export const IcHorloge = (p) => (
  <Trait {...p}><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 1.8" /></Trait>
);

/* Le temple Ayôrôfa — emblème de la maison, jamais recomposé :
   il reprend exactement le tracé du logo officiel du projet. */
export function Temple({ taille = 24, className = '' }) {
  return (
    <svg viewBox="0 0 48 48" width={taille} height={taille} className={className}
      aria-hidden="true" focusable="false" style={{ display: 'block' }}>
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 18 24 8l16 10" strokeWidth="2.6" />
        <path d="M9.5 21h29" strokeWidth="2.2" />
        <path d="M13 24v9M19 24v9M29 24v9M35 24v9" strokeWidth="2.4" />
        <path d="M8.5 36h31" strokeWidth="2.2" />
        <path d="M6.5 40h35" strokeWidth="2.6" />
      </g>
      <path d="M20.5 29.5h7" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="19" cy="29.5" r="3.1" fill="currentColor" />
      <circle cx="29" cy="29.5" r="3.1" fill="currentColor" />
    </svg>
  );
}
