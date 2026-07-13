'use client';
import { useState, useEffect } from 'react';

// Bandeau « Installer l'application » — en haut de la plateforme.
// Android/Chrome : installation en 1 clic.
// iPhone/Safari : Apple ne le permet pas -> on explique la manip.
export default function InstallApp() {
  const [prompt, setPrompt] = useState(null);   // Android
  const [visible, setVisible] = useState(false);
  const [ios, setIos] = useState(false);
  const [aide, setAide] = useState(false);

  useEffect(() => {
    // Déjà installée ? on n'affiche rien.
    const installee = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    if (installee) return;

    // Refusé récemment ? on respecte (7 jours).
    try {
      const refus = localStorage.getItem('install-refus');
      if (refus && Date.now() - Number(refus) < 7 * 24 * 3600 * 1000) return;
    } catch (e) {}

    const estIos = /iphone|ipad|ipod/i.test(window.navigator.userAgent);
    if (estIos) { setIos(true); setVisible(true); return; }

    const onPrompt = (e) => { e.preventDefault(); setPrompt(e); setVisible(true); };
    window.addEventListener('beforeinstallprompt', onPrompt);
    return () => window.removeEventListener('beforeinstallprompt', onPrompt);
  }, []);

  const installer = async () => {
    if (ios) { setAide(true); return; }
    if (!prompt) return;
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === 'accepted') setVisible(false);
    setPrompt(null);
  };

  const fermer = () => {
    setVisible(false);
    try { localStorage.setItem('install-refus', String(Date.now())); } catch (e) {}
  };

  if (!visible) return null;

  return (
    <>
      <div className="install">
        <span className="install-ic" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3v12M7 11l5 5 5-5M5 20h14" />
          </svg>
        </span>
        <span className="install-t">
          <strong>Installer l’application</strong>
          <span className="install-s">Accès rapide depuis votre écran d’accueil</span>
        </span>
        <button className="btn btn-sm install-b" onClick={installer}>Installer</button>
        <button className="install-x" onClick={fermer} aria-label="Fermer">✕</button>
      </div>

      {aide && (
        <div className="modal-bg" onClick={() => setAide(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Installer sur iPhone</h3>
            <p className="muted sm">En 3 étapes, dans Safari :</p>
            <ol className="ios-steps">
              <li>Touchez le bouton <strong>Partager</strong> ⬆️ (en bas de Safari)</li>
              <li>Faites défiler et choisissez <strong>« Sur l’écran d’accueil »</strong></li>
              <li>Touchez <strong>Ajouter</strong> — c’est fait !</li>
            </ol>
            <button className="btn btn-sm" onClick={() => setAide(false)} style={{ marginTop: 12 }}>J’ai compris</button>
          </div>
        </div>
      )}
    </>
  );
}
