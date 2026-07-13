'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    try { if (!localStorage.getItem('cookies-ok')) setVisible(true); } catch (e) {}
  }, []);
  if (!visible) return null;
  const accepter = () => {
    try { localStorage.setItem('cookies-ok', '1'); } catch (e) {}
    setVisible(false);
  };
  return (
    <div className="cookie" role="dialog" aria-label="Cookies">
      <span>Nous utilisons des cookies pour améliorer votre expérience. <Link href="/confidentialite">En savoir plus</Link></span>
      <button onClick={accepter}>D’accord</button>
    </div>
  );
}
