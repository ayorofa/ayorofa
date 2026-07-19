'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

const MOTIFS = [
  { v: 'spam', label: 'Spam / publicité' },
  { v: 'arnaque', label: 'Arnaque / tentative de fraude' },
  { v: 'faux', label: 'Faux profil / fausse annonce' },
  { v: 'offensant', label: 'Contenu offensant' },
  { v: 'autre', label: 'Autre' },
];

// <Signaler type="besoin" cibleId={b.id} auteurCible={b.auteur} />
export default function Signaler({ type, cibleId, auteurCible, me }) {
  const [ouvert, setOuvert] = useState(false);
  const [motif, setMotif] = useState('spam');
  const [details, setDetails] = useState('');
  const [erreur, setErreur] = useState('');
  const [fait, setFait] = useState(false);
  const [busy, setBusy] = useState(false);

  const envoyer = async (e) => {
    e.preventDefault();
    if (!me) { window.location.href = '/inscription'; return; }
    setBusy(true);
    const { error } = await supabase.from('signalements').insert({
      type, cible_id: cibleId, auteur_cible: auteurCible || null,
      signale_par: me, motif, details: details.trim() || null,
    });
    setBusy(false);
    if (error) { setErreur('Échec de l’envoi. Vérifiez votre connexion et réessayez.'); return; }
    setErreur(''); setFait(true);
    setTimeout(() => { setOuvert(false); setFait(false); setDetails(''); }, 2200);
  };

  if (!me) return null;

  return (
    <>
      <button className="lien-signaler" onClick={() => setOuvert(true)} aria-label="Signaler">
        ⚑ Signaler
      </button>

      {ouvert && (
        <div className="modal-bg" onClick={() => setOuvert(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Signaler">
            {fait ? (
              <>
                <h3>Signalement envoyé ✓</h3>
                <p className="muted">Merci. Notre équipe va examiner ce contenu.</p>
              </>
            ) : (
              <form onSubmit={envoyer}>
                <h3>Signaler ce contenu</h3>
                <p className="muted sm">Aidez-nous à garder la plateforme saine.</p>
                <div style={{ display: 'grid', gap: 8, margin: '14px 0' }}>
                  {MOTIFS.map((m) => (
                    <label key={m.v} className="radio">
                      <input type="radio" name="motif" value={m.v}
                        checked={motif === m.v} onChange={() => setMotif(m.v)} />
                      <span>{m.label}</span>
                    </label>
                  ))}
                </div>
                <textarea value={details} onChange={(e) => setDetails(e.target.value)} rows={3}
                  placeholder="Précisions (facultatif)"
                  style={{ width: '100%', padding: 11, border: '1px solid var(--line)', borderRadius: 10, fontFamily: 'inherit', fontSize: 16 }} />
                {erreur && (
                  <p style={{ color: '#b3261e', fontSize: '.85rem', margin: '10px 0 0' }}>{erreur}</p>
                )}
                <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                  <button className="btn btn-sm" type="submit" disabled={busy}>{busy ? '…' : 'Envoyer'}</button>
                  <button className="btn btn-sm" type="button" onClick={() => setOuvert(false)}
                    style={{ background: 'transparent', border: '1px solid var(--line)', color: 'var(--text)' }}>Annuler</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
