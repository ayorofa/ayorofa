'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

// Bouton réseau façon LinkedIn :
// aucun lien -> « Se connecter »   |  demande envoyée -> « Demande envoyée » (annulable)
// demande reçue -> « Accepter / Refuser »  |  acceptée -> « ✓ Dans votre réseau »
export default function BoutonReseau({ cibleId, me, petit = false }) {
  const [etat, setEtat] = useState('charge'); // charge|aucun|envoyee|recue|connecte
  const [cid, setCid] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!supabase || !cibleId || me === cibleId) { setEtat('aucun'); return; }
    if (!me) { setEtat('aucun'); return; }
    (async () => {
      const { data } = await supabase.from('connexions').select('*')
        .or(`and(demandeur.eq.${me},destinataire.eq.${cibleId}),and(demandeur.eq.${cibleId},destinataire.eq.${me})`)
        .maybeSingle();
      if (!data) { setEtat('aucun'); return; }
      setCid(data.id);
      if (data.statut === 'acceptee') setEtat('connecte');
      else if (data.statut === 'refusee') setEtat('aucun');
      else setEtat(data.demandeur === me ? 'envoyee' : 'recue');
    })();
  }, [me, cibleId]);

  if (me === cibleId) return null;
  if (!me) return <a href="/inscription" className={'btn' + (petit ? ' btn-sm' : '')}>Se connecter</a>;
  if (etat === 'charge') return null;

  const demander = async () => {
    setBusy(true);
    const { data } = await supabase.from('connexions')
      .insert({ demandeur: me, destinataire: cibleId }).select().single();
    if (data) { setCid(data.id); setEtat('envoyee'); }
    setBusy(false);
  };
  const annuler = async () => {
    setBusy(true);
    await supabase.from('connexions').delete().eq('id', cid);
    setEtat('aucun'); setCid(null); setBusy(false);
  };
  const repondre = async (statut) => {
    setBusy(true);
    await supabase.from('connexions').update({ statut }).eq('id', cid);
    setEtat(statut === 'acceptee' ? 'connecte' : 'aucun');
    setBusy(false);
  };

  if (etat === 'recue') {
    return (
      <span style={{ display: 'inline-flex', gap: 6 }}>
        <button className="btn btn-sm" onClick={() => repondre('acceptee')} disabled={busy}>Accepter</button>
        <button className="btn btn-sm btn-ghost" onClick={() => repondre('refusee')} disabled={busy}>Refuser</button>
      </span>
    );
  }
  if (etat === 'connecte') {
    return <button className={'btn btn-suivi' + (petit ? ' btn-sm' : '')} onClick={annuler} disabled={busy}
      title="Retirer de mon réseau">✓ Dans votre réseau</button>;
  }
  if (etat === 'envoyee') {
    return <button className={'btn btn-ghost' + (petit ? ' btn-sm' : '')} onClick={annuler} disabled={busy}
      title="Annuler la demande">Demande envoyée</button>;
  }
  return <button className={'btn' + (petit ? ' btn-sm' : '')} onClick={demander} disabled={busy}>
    {busy ? '…' : 'Se connecter'}
  </button>;
}
