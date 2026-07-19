'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';

/* Signal d'arrivée d'une notification ou d'un message.
   Trois modes au choix du membre : carillon 🔔 · voix 🗣 · silence 🔕
   La voix utilise l'enregistrement /notif-ayorofa.mp3 s'il existe,
   sinon la voix de synthèse du téléphone (féminine, en français). */

const MODES = ['carillon', 'voix', 'off'];
const ICONE = { carillon: '🔔', voix: '🗣', off: '🔕' };
const LIBELLE = {
  carillon: 'Carillon à l’arrivée d’une notification',
  voix: 'Voix « Ayôrôfa Connect » à l’arrivée d’une notification',
  off: 'Notifications silencieuses',
};
const PHRASE = 'Ayorofa Connect';
const FICHIER = '/notif-ayorofa.mp3';

export default function SonNotif() {
  const [mode, setMode] = useState('carillon');
  const ctxRef = useRef(null);
  const audioRef = useRef(null);
  const voixRef = useRef(null);
  const dernier = useRef(0);

  useEffect(() => {
    try {
      const m = localStorage.getItem('ayo-son');
      if (MODES.includes(m)) setMode(m);
    } catch (e) {}
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const choisir = () => {
      const voix = window.speechSynthesis.getVoices().filter((v) => /^fr/i.test(v.lang));
      if (!voix.length) return;
      const feminine = voix.find((v) =>
        /female|femme|amélie|amelie|audrey|marie|virginie|chantal|google français/i.test(v.name));
      voixRef.current = feminine || voix[0];
    };
    choisir();
    window.speechSynthesis.onvoiceschanged = choisir;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, []);

  useEffect(() => {
    const debloquer = () => {
      try {
        if (!ctxRef.current) {
          const AC = window.AudioContext || window.webkitAudioContext;
          if (AC) ctxRef.current = new AC();
        }
        if (ctxRef.current && ctxRef.current.state === 'suspended') ctxRef.current.resume();
        if (!audioRef.current) {
          const a = new Audio(FICHIER);
          a.preload = 'auto';
          a.volume = 0.85;
          audioRef.current = a;
        }
      } catch (e) {}
      window.removeEventListener('pointerdown', debloquer);
      window.removeEventListener('keydown', debloquer);
    };
    window.addEventListener('pointerdown', debloquer, { once: true });
    window.addEventListener('keydown', debloquer, { once: true });
    return () => {
      window.removeEventListener('pointerdown', debloquer);
      window.removeEventListener('keydown', debloquer);
    };
  }, []);

  const carillon = () => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    try {
      if (ctx.state === 'suspended') ctx.resume();
      const g = ctx.createGain();
      g.connect(ctx.destination);
      g.gain.setValueAtTime(0.0001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.07, ctx.currentTime + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.42);
      [[880, 0], [1174.7, 0.13]].forEach(([f, d]) => {
        const o = ctx.createOscillator();
        o.type = 'sine';
        o.frequency.value = f;
        o.connect(g);
        o.start(ctx.currentTime + d);
        o.stop(ctx.currentTime + d + 0.3);
      });
    } catch (e) {}
  };

  const synthese = () => {
    try {
      const s = window.speechSynthesis;
      if (!s) { carillon(); return; }
      s.cancel();
      const u = new SpeechSynthesisUtterance(PHRASE);
      if (voixRef.current) u.voice = voixRef.current;
      u.lang = 'fr-FR';
      u.rate = 0.92;
      u.pitch = 1.15;
      u.volume = 0.9;
      s.speak(u);
    } catch (e) { carillon(); }
  };

  const parler = () => {
    const a = audioRef.current;
    if (a) {
      a.currentTime = 0;
      const p = a.play();
      if (p && p.then) { p.then(() => {}).catch(() => synthese()); return; }
      return;
    }
    synthese();
  };

  const jouer = useCallback(() => {
    if (mode === 'off') return;
    const t = Date.now();
    if (t - dernier.current < 2500) return;
    dernier.current = t;
    if (mode === 'voix') parler(); else carillon();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  useEffect(() => {
    if (!supabase) return;
    let ch;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      ch = supabase.channel('son-notif')
        .on('postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'notifications', filter: `destinataire=eq.${user.id}` },
          jouer)
        .on('postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'messages', filter: `destinataire=eq.${user.id}` },
          jouer)
        .subscribe();
    })();
    return () => { if (ch) supabase.removeChannel(ch); };
  }, [jouer]);

  const basculer = () => {
    const suivant = MODES[(MODES.indexOf(mode) + 1) % MODES.length];
    setMode(suivant);
    try { localStorage.setItem('ayo-son', suivant); } catch (e) {}
    dernier.current = 0;
    if (suivant === 'voix') setTimeout(parler, 60);
    else if (suivant === 'carillon') setTimeout(carillon, 60);
  };

  return (
    <button onClick={basculer} className="btn-theme" title={LIBELLE[mode]} aria-label={LIBELLE[mode]}>
      {ICONE[mode]}
    </button>
  );
}
