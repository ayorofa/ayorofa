// Badges professionnels Ayôrôfa : attribués uniquement par l'équipe (back office).
const DEF = {
  expert:     { e: '🏆', l: 'Expert' },
  top:        { e: '⭐', l: 'Top Prestataire' },
  premium:    { e: '💎', l: 'Premium' },
  partenaire: { e: '👑', l: 'Partenaire' },
};

export default function BadgesPro({ badges = [], mini = false }) {
  const list = (badges || []).filter((b) => DEF[b]);
  if (!list.length) return null;
  return (
    <span className={'badges-pro' + (mini ? ' mini' : '')}>
      {list.map((b) => (
        <span key={b} className="bp" title={DEF[b].l} aria-label={DEF[b].l}>
          {DEF[b].e}{!mini && <em>{DEF[b].l}</em>}
        </span>
      ))}
    </span>
  );
}
