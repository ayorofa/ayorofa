'use client';
import { statutPresence } from '@/lib/presence';

// Pastille verte « En ligne » ou texte « Vu il y a … »
export default function Presence({ date, pastilleSeule = false }) {
  const { enLigne, texte } = statutPresence(date);
  if (pastilleSeule) {
    return enLigne ? <span className="pastille-on" title="En ligne" aria-label="En ligne" /> : null;
  }
  return (
    <span className={'presence' + (enLigne ? ' on' : '')}>
      {enLigne && <span className="pt" aria-hidden="true" />}
      {texte}
    </span>
  );
}
