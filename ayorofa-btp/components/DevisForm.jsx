'use client';
import { useState } from 'react';
import { METIERS } from '@/data/metiers';
import { VILLES } from '@/data/villes';
const WHATSAPP = '2250749074082';
export default function DevisForm({ presetMetier = '', presetPro = '' }) {
  const [done, setDone] = useState(false);
  const [f, setF] = useState({ nom: '', tel: '', metier: presetMetier, ville: '', desc: '' });
  const on = (e) => setF({ ...f, [e.target.name]: e.target.value });
  const submit = (e) => {
    e.preventDefault();
    // Démo : pas de base de données -> confirmation + relais WhatsApp.
    setDone(true);
  };
  if (done) {
    const msg = encodeURIComponent(`Demande de devis BTP\nNom: ${f.nom}\nTél: ${f.tel}\nMétier: ${f.metier}\nVille: ${f.ville}${presetPro ? `\nPro: ${presetPro}` : ''}\nBesoin: ${f.desc}`);
    return (
      <div className="card ok">
        <h3>Demande enregistrée ✓</h3>
        <p className="muted">Merci {f.nom || ''} ! Un professionnel va vous recontacter.</p>
        <a className="btn" href={`https://wa.me/${WHATSAPP}?text=${msg}`} target="_blank" rel="noopener">Confirmer sur WhatsApp</a>
      </div>
    );
  }
  return (
    <form className="card form" onSubmit={submit}>
      <label>Nom complet<input name="nom" value={f.nom} onChange={on} required /></label>
      <label>Téléphone<input name="tel" value={f.tel} onChange={on} required /></label>
      <label>Métier
        <select name="metier" value={f.metier} onChange={on} required>
          <option value="">Choisir…</option>
          {METIERS.map((m) => <option key={m.slug} value={m.slug}>{m.name}</option>)}
        </select>
      </label>
      <label>Ville
        <select name="ville" value={f.ville} onChange={on} required>
          <option value="">Choisir…</option>
          {VILLES.map((v) => <option key={v} value={v}>{v}</option>)}
        </select>
      </label>
      <label className="full">Décrivez votre chantier<textarea name="desc" value={f.desc} onChange={on} rows={4} required /></label>
      <button className="btn full" type="submit">Envoyer ma demande</button>
    </form>
  );
}
