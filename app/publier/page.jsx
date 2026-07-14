'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { METIERS } from '@/data/metiers';
import { VILLES } from '@/data/villes';
import { uploadMedia } from '@/lib/media';

const TYPES = [
  { v: 'post', label: '📝 Publication simple' },
  { v: 'demande', label: '🔨 Demande de prestation' },
  { v: 'offre_emploi', label: "💼 Offre d'emploi" },
  { v: 'recherche', label: "🙋 Recherche d'emploi" },
];
const WA = '2250749074082';
const waLink = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(
  'Bonjour Ayôrôfa Connect 👋\nJe veux publier une annonce :\n- Type (demande / offre / emploi) :\n- Métier :\n- Ville :\n- Détails :\n- Mon contact :');

export default function Publier() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [f, setF] = useState({ type: 'demande', titre: '', description: '', metier: '', ville: '', lien: '' });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [fichier, setFichier] = useState(null);
  const [apercu, setApercu] = useState(null);

  const choisirFichier = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setFichier(file);
    setApercu(file.type.startsWith('image/') ? URL.createObjectURL(file) : null);
  };
  const retirerFichier = () => { setFichier(null); setApercu(null); };

  useEffect(() => {
    if (!supabase) { setReady(true); return; }
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/connexion'); return; }
      const { data } = await supabase.from('profiles').select('type').eq('id', user.id).single();
      if (data && data.type === 'entreprise') setF((v) => ({ ...v, type: 'offre_emploi' }));
      else if (data && data.type === 'chercheur') setF((v) => ({ ...v, type: 'recherche' }));
      setReady(true);
    })();
  }, [router]);

  const on = (e) => setF({ ...f, [e.target.name]: e.target.value });
  const submit = async (e) => {
    e.preventDefault();
    if (!supabase) { setMsg('Configuration Supabase manquante.'); return; }
    setLoading(true); setMsg('');
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/connexion'); return; }
    let media = null, media_type = null;
    if (fichier) {
      try {
        const up = await uploadMedia(supabase, fichier, user.id);
        media = up.url; media_type = up.type;
      } catch (err) {
        setLoading(false); setMsg(err.message); return;
      }
    }
    const estPost = f.type === 'post';
    if (estPost && !f.description.trim() && !media) {
      setLoading(false); setMsg('Écrivez quelque chose ou ajoutez une photo.'); return;
    }
    const texte = f.description.trim();
    const { error } = await supabase.from('besoins').insert({
      auteur: user.id,
      type: f.type,
      titre: estPost ? (texte ? texte.slice(0, 90) : 'Publication') : f.titre,
      description: texte || null,
      metier: estPost ? (f.metier || 'autres') : f.metier,
      ville: f.ville || null,
      lien: f.lien || null, media, media_type,
    });
    setLoading(false);
    if (error) { setMsg(error.message); return; }
    router.push('/besoins');
  };

  if (!ready) return <main className="sec"><div className="wrap"><p className="muted">Chargement…</p></div></main>;
  return (
    <main className="sec"><div className="wrap" style={{ maxWidth: 620 }}>
      <p className="eyebrow">Publier</p><h1>Publier</h1>
      <a className="btn" href={waLink} target="_blank" rel="noopener" style={{ background: '#25D366', color: '#fff', marginBottom: 14 }}>Publier en 1 message sur WhatsApp</a>
      <p className="muted sm" style={{ marginBottom: 18 }}>…ou remplissez le formulaire ci-dessous.</p>
      <form className="card form" onSubmit={submit}>
        <div className="full">
          <span style={{ fontWeight: 600, fontSize: '.9rem' }}>Que voulez-vous publier ?</span>
          <div className="chips" style={{ marginTop: 8 }}>
            {TYPES.map((t) => (
              <button key={t.v} type="button" className={'chip' + (f.type === t.v ? ' on' : '')}
                onClick={() => setF({ ...f, type: t.v })}>{t.label}</button>
            ))}
          </div>
        </div>

        {f.type === 'post' ? (
          <>
            <label className="full">Votre publication
              <textarea name="description" value={f.description} onChange={on} rows={5} autoFocus
                placeholder="Exprimez-vous : une actualité, un conseil, une réalisation, une question à la communauté…" />
            </label>
            <label>Domaine (facultatif)
              <select name="metier" value={f.metier} onChange={on}><option value="">Général</option>{METIERS.map((m) => <option key={m.slug} value={m.slug}>{m.name}</option>)}</select>
            </label>
            <label>Ville (facultatif)
              <select name="ville" value={f.ville} onChange={on}><option value="">Toute la Côte d’Ivoire</option>{VILLES.map((v) => <option key={v} value={v}>{v}</option>)}</select>
            </label>
          </>
        ) : (
          <>
            <label className="full">Titre<input name="titre" value={f.titre} onChange={on} required placeholder="Ex. Recherche maçon pour dalle 40m²" /></label>
            <label>Métier / domaine
              <select name="metier" value={f.metier} onChange={on} required><option value="">Choisir…</option>{METIERS.map((m) => <option key={m.slug} value={m.slug}>{m.name}</option>)}</select>
            </label>
            <label>Ville
              <select name="ville" value={f.ville} onChange={on}><option value="">Choisir…</option>{VILLES.map((v) => <option key={v} value={v}>{v}</option>)}</select>
            </label>
            <label className="full">Description<textarea name="description" value={f.description} onChange={on} rows={4} placeholder="Détaillez votre besoin, budget, délais…" /></label>
          </>
        )}
        {f.type !== 'post' && (
          <label className="full">Lien d’origine (optionnel)<input name="lien" value={f.lien} onChange={on} placeholder="https://… (si l’annonce vient d’ailleurs)" /></label>
        )}
        <div className="full">
          <span style={{ fontWeight: 600, fontSize: '.9rem' }}>Photo ou vidéo (facultatif)</span>
          {!fichier ? (
            <label className="media-add">
              📷 Ajouter une photo ou une vidéo
              <input type="file" accept="image/*,video/*" onChange={choisirFichier} style={{ display: 'none' }} />
            </label>
          ) : (
            <div className="media-prev">
              {apercu ? <img src={apercu} alt="" /> : <span className="media-nom">🎥 {fichier.name}</span>}
              <button type="button" className="media-x" onClick={retirerFichier} aria-label="Retirer">✕</button>
            </div>
          )}
          <p className="muted sm" style={{ margin: '6px 0 0' }}>Photo : 6 Mo max · Vidéo : 25 Mo max</p>
        </div>
        {msg && <div className="full" style={{ color: '#b3261e' }}>{msg}</div>}
        <button className="btn full" type="submit" disabled={loading}>{loading ? '…' : 'Publier'}</button>
      </form>
    </div></main>
  );
}
