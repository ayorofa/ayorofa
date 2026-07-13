'use client';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

// Signale que l'utilisateur est actif (toutes les 2 min, et à l'ouverture).
export default function PingPresence() {
  useEffect(() => {
    if (!supabase) return;
    let timer;
    const ping = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      await supabase.rpc('ping_presence');
    };
    ping();
    timer = setInterval(ping, 120000);
    const onVisible = () => { if (document.visibilityState === 'visible') ping(); };
    document.addEventListener('visibilitychange', onVisible);
    return () => { clearInterval(timer); document.removeEventListener('visibilitychange', onVisible); };
  }, []);
  return null;
}
