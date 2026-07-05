'use client';
import { useState, useEffect } from 'react';
export default function CookieConsent() {
  const [show, setShow] = useState(false);
  useEffect(() => { try { if (!localStorage.getItem('cookie-consent')) setShow(true); } catch (e) {} }, []);
  if (!show) return null;
  const accept = () => { try { localStorage.setItem('cookie-consent', 'yes'); } catch (e) {} setShow(false); };
  return (
    <div className="cookie">
      <span>Nous utilisons des cookies pour la mesure d’audience et la publicité. <a href="/confidentialite">En savoir plus</a>.</span>
      <button onClick={accept}>J’accepte</button>
    </div>
  );
}
