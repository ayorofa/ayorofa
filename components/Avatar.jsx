'use client';
import Link from 'next/link';

// Avatar réutilisable : photo si elle existe, sinon initiale sur fond encre.
export default function Avatar({ url, nom, size = 40, href, className = '' }) {
  const initiale = (nom || 'U').trim().charAt(0).toUpperCase();
  const style = { width: size, height: size, flex: `0 0 ${size}px`, fontSize: Math.round(size * 0.42) };

  const inner = url ? (
    <img src={url} alt={nom || 'Profil'} className={'avatar ' + className} style={style} loading="lazy" />
  ) : (
    <span className={'avatar avatar-i ' + className} style={style} aria-label={nom || 'Profil'}>{initiale}</span>
  );

  if (href) return <Link href={href} className="avatar-l" aria-label={nom || 'Voir le profil'}>{inner}</Link>;
  return inner;
}
