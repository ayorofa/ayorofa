// Logo Ayôrôfa Connect : le temple de la maison Ayôrôfa,
// avec en son coeur deux points reliés — le lien, la mise en relation.
export default function Logo({ size = 28, className = '' }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} className={className}
         role="img" aria-label="Ayôrôfa Connect" style={{ display: 'block' }}>
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
