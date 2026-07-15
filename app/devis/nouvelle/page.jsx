'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { METIERS } from '@/data/metiers';
import { VILLES } from '@/data/villes';
import { uploadMedia } from '@/lib/media';

function NouvelleDemande() {
  const router = useRouter();
  const sp = useSearchParams();
  const pour = sp.get('pour');
  const [cible, setCible] = useState(null);
  const [f, setF] = useState({ titre: '', description: '', metier: '', ville: '', budget: '', delai: '' });
  const [fichier, setFichier] = useState(null);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const on = (e) => setF({ ...f, [e.target.name]: e.target.value });

  useEffect(() => {
    if (!supabase || !pour) return;
    supabase.from('profiles').select('nom,metier_principal').eq('id', pour).maybeSingle()
      .then(({ data }) => {
        if (data) {
          setCible(data);
          if (data.metier_principal) setF((x) => ({ ...x, metier: data.metier_principal }));
        }
      });
  }, [pour]);

  const submit = async (e) => {
    e.preventDefault();
    setMsg(''); setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/connexion'); return; }
    let media = null, media_type = null;
    if (fichier) {
      try { const up = await uploadMedia(supabase, fichier, user.id); media = up.url; media_type = up.type; }
      catch (err) { setLoading(false); setMsg(err.message); return; }
    }
    const { data, error } = await supabase.from('demandes_devis').insert({
      client: user.id, pour: pour || null,
      titre: f.titre.trim(), description: f.description.trim() || null,
      metier: f.metier, ville: f.ville || null,
      budget: f.budget ? Number(f.budget) : null, delai: f.delai.trim() || null,
      media, media_type,
    }).select().single();
    setLoading(false);
    if (error) { setMsg(error.message); return; }
    router.push(`/devis/${data.id}`);
  };

  return (
    <main className="sec"><div className="wrap" style={{ maxWidth: 640 }}>
      <p className="eyebrow">Devis</p>
      <h1>Demander un devis</h1>
      {cible && <p className="muted sm">📩 Demande adressée à <strong>{cible.nom}</strong> — lui seul pourra y répondre.</p>}
      {!pour && <p className="muted sm">Votre demande sera visible des professionnels du métier choisi : vous recevrez plusieurs devis à comparer.</p>}

      <form className="card form" onSubmit={submit} style={{ marginTop: 14 }}>
        <label className="full">Que faut-il faire ?<input name="titre" value={f.titre} onChange={on} required
          placeholder="Ex. Carrelage salon 25 m², fourniture et pose" /></label>
        <label className="full">Détails<textarea name="description" value={f.description} onChange={on} rows={4}
          placeholder="Décrivez le travail, l’état actuel, vos attentes…" /></label>
        <label>Métier concerné
          <select name="metier" value={f.metier} onChange={on} required>
            <option value="">Choisir…</option>
            {METIERS.map((m) => <option key={m.slug} value={m.slug}>{m.name}</option>)}
          </select>
        </label>
        <label>Ville
          <select name="ville" value={f.ville} onChange={on}>
            <option value="">Choisir…</option>
            {VILLES.map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
        </label>
        <label>Budget indicatif (F CFA)<input name="budget" value={f.budget} onChange={on}
          type="number" min="0" placeholder="Ex. 250000" /></label>
        <label>Délai souhaité<input name="delai" value={f.delai} onChange={on}
          placeholder="Ex. sous 2 semaines" /></label>
        <div className="full">
          <span style={{ fontWeight: 600, fontSize: '.9rem' }}>Photo ou vidéo (facultatif)</span>
          {!fichier ? (
            <label className="media-add">📷 Montrer le chantier / l’objet
              <input type="file" accept="image/*,video/*" style={{ display: 'none' }}
                onChange={(e) => { const x = e.target.files && e.target.files[0]; if (x) setFichier(x); }} />
            </label>
          ) : (
            <div className="media-chip" style={{ margin: '8px 0 0', maxWidth: '100%' }}>
              {fichier.type.startsWith('video/') ? '🎥' : '📷'} {fichier.name}
              <button type="button" onClick={() => setFichier(null)}>✕</button>
            </div>
          )}
        </div>
        {msg && <p className="full" style={{ color: '#b3261e', margin: 0 }}>{msg}</p>}
        <button className="btn full" type="submit" disabled={loading}>{loading ? 'Envoi…' : 'Envoyer ma demande'}</button>
      </form>
    </div></main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<main className="sec"><div className="wrap"><p className="muted">Chargement…</p></div></main>}>
      <NouvelleDemande />
    </Suspense>
  );
}
