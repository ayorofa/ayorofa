'use client';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

/* Sentinelle : capte les erreurs qui font planter une page et les
   enregistre dans la base. Invisible pour le membre, précieuse pour toi. */

const vus = new Set();
let compteur = 0;

async function enregistrer(message, pile) {
  try {
    if (!supabase || !message) return;
    if (compteur >= 10) return;
    const cle = String(message).slice(0, 120);
    if (vus.has(cle)) return;
    vus.add(cle);
    compteur++;

    let membre = null;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      membre = user ? user.id : null;
    } catch (e) {}

    await supabase.from('erreurs').insert({
      membre,
      page: typeof window !== 'undefined' ? window.location.pathname : null,
      message: String(message).slice(0, 500),
      pile: pile ? String(pile).slice(0, 2000) : null,
      agent: typeof navigator !== 'undefined' ? String(navigator.userAgent).slice(0, 300) : null,
    });
  } catch (e) {
    // la sentinelle ne doit jamais provoquer d'erreur elle-même
  }
}

export default function Sentinelle() {
  useEffect(() => {
    const surErreur = (e) => {
      enregistrer(e.message || 'Erreur inconnue', e.error && e.error.stack);
    };
    const surRejet = (e) => {
      const r = e.reason;
      enregistrer(
        (r && (r.message || r.toString())) || 'Promesse rejetée',
        r && r.stack
      );
    };
    window.addEventListener('error', surErreur);
    window.addEventListener('unhandledrejection', surRejet);
    return () => {
      window.removeEventListener('error', surErreur);
      window.removeEventListener('unhandledrejection', surRejet);
    };
  }, []);

  return null;
}

export function signalerErreur(message, pile) {
  enregistrer(message, pile);
}
