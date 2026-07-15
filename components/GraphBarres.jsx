'use client';
// Petit graphique en barres or/encre, sans bibliothèque.
export default function GraphBarres({ donnees = [], hauteur = 140 }) {
  const max = Math.max(1, ...donnees.map((d) => d.v));
  const bw = 100 / Math.max(1, donnees.length);
  return (
    <svg viewBox={`0 0 100 ${hauteur / 2.6 + 14}`} style={{ width: '100%', height: hauteur }}
      role="img" aria-label="Graphique d'activité">
      {donnees.map((d, i) => {
        const h = (d.v / max) * (hauteur / 2.6 - 6);
        const H = hauteur / 2.6;
        return (
          <g key={i}>
            <rect x={i * bw + bw * 0.18} y={H - h} width={bw * 0.64} height={Math.max(h, 0.5)}
              rx="1.2" fill={i === donnees.length - 1 ? '#C9A24B' : '#D9CDB2'}>
              <title>{d.l} : {d.v}</title>
            </rect>
            <text x={i * bw + bw / 2} y={H + 6} textAnchor="middle" fontSize="3.6" fill="#8D8371">{d.l}</text>
            {d.v > 0 && <text x={i * bw + bw / 2} y={H - h - 1.6} textAnchor="middle" fontSize="3.4"
              fontWeight="700" fill="#161310">{d.v}</text>}
          </g>
        );
      })}
    </svg>
  );
}
