'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

// Suivre / Ne plus suivre un membre
export default function BoutonSuivre({ cibleId, me, petit = false, onChange }) {
  const [suivi, setSuivi] = useState(false);
  const [busy, setBusy] = useState(false);
  const [pret, setPret] = useState(false);

  useEffect(() => {
    if (!supabase || !me || !cibleId || me === cibleId) { setPret(true); return; }
    (async () => {
      const { data } = await supabase.from('abonnes').select('id')
        .eq('suiveur', me).eq('suivi', cibleId).maybeSingle();
      setSuivi(!!data);
      setPret(true);
    })();
  }, [me, cibleId]);

  if (me === cibleId) return null;
  if (!me) {
    return <a href="/inscription" className={'btn' + (petit ? ' btn-sm' : '')}>Suivre</a>;
  }
  if (!pret) return null;

  const basculer = async () => {
    setBusy(true);
    if (suivi) {
      await supabase.from('abonnes').delete().eq('suiveur', me).eq('suivi', cibleId);
      setSuivi(false);
      if (onChange) onChange(-1);
    } else {
      await supabase.from('abonnes').insert({ suiveur: me, suivi: cibleId });
      // notifier la personne
      await supabase.from('notifications').insert({
        destinataire: cibleId, emetteur: me, type: 'abonnement',
      });
      setSuivi(true);
      if (onChange) onChange(1);
    }
    setBusy(false);
  };

  return (
    <button
      className={'btn' + (petit ? ' btn-sm' : '') + (suivi ? ' btn-suivi' : '')}
      onClick={basculer}
      disabled={busy}
    >
      {busy ? '…' : suivi ? '✓ Abonné' : 'Suivre'}
    </button>
  );
}
