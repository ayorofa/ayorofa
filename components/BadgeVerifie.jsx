// Badge « Profil vérifié » aux couleurs Ayôrôfa (or + encre).
export default function BadgeVerifie({ size = 'md', label = true }) {
  const s = size === 'sm' ? 14 : 17;
  return (
    <span className={'vbadge' + (size === 'sm' ? ' vbadge-sm' : '')} title="Profil vérifié par Ayôrôfa">
      <svg viewBox="0 0 24 24" width={s} height={s} aria-hidden="true">
        {/* sceau doré */}
        <path d="M12 1.6l2.5 1.9 3.1-.3 1 3 2.7 1.6-1.3 2.9.6 3.1-3 1-1.9 2.5-3-.7-3 .7-1.9-2.5-3-1 .6-3.1L1.1 7.8 3.8 6.2l1-3 3.1.3L12 1.6z"
              fill="#c9a24b" stroke="#a9863a" strokeWidth="0.7" strokeLinejoin="round" />
        <path d="M8.3 11.8l2.4 2.4 4.6-4.9" fill="none" stroke="#161310" strokeWidth="2.1"
              strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {label && <span>Vérifié</span>}
    </span>
  );
}
