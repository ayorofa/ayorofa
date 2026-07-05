'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { METIERS } from '@/data/metiers';
import { VILLES } from '@/data/villes';

const TYPES = [
  { v: 'demande', label: 'Demande de prestation' },
  { v: 'offre_emploi', label: "Offre d'emploi" },
  { v: 'recherche', label: "Recherche d'emploi" },
];

export default function Publier() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [f, setF] = useState({ type: 'demande', titre: '', description: '', metier: '', ville: '' });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!supabase) { setReady(true); return; }
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/connexion'); return; }
      const { data } = await supabase.from('profiles').select('type').eq('id', user.id).single();
      if (data?.type === 'entreprise') setF((v) => ({ ...v, type: 'offre_emploi' }));
      else if (data?.type === 'chercheur') setF((v) => ({ ...v, type: 'recherche' }));
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
    const { error } = await supabase.from('besoins').insert({
      auteur: user.id, type: f.type, titre: f.titre, description: f.description, metier: f.metier, ville: f.ville,
    });
    setLoading(false);
    if (error) { setMsg(error.message); return; }
    router.push('/besoins');
  };

  if (!ready) return <main className="sec"><div className="wrap"><p className="muted">Chargement…</p></div></main>;
  return (
    <main className="sec"><div className="wrap" style={{ maxWidth: 620 }}>
      <p className="eyebrow">Publier</p><h1>Publier un besoin ou une offre</h1>
      <form className="card form" onSubmit={submit}>
        <label className="full">Type d’annonce
          <select name="type" value={f.type} onChange={on}>
            {TYPES.map((t) => <option key={t.v} value={t.v}>{t.label}</option>)}
          </select>
        </label>
        <label className="full">Titre<input name="titre" value={f.titre} onChange={on} required placeholder="Ex. Recherche maçon pour dalle 40m²" /></label>
        <label>Métier / domaine
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
        <label className="full">Description<textarea name="description" value={f.description} onChange={on} rows={4} placeholder="Détaillez votre besoin, budget, délais…" /></label>
        {msg && <div className="full" style={{ color: '#b3261e' }}>{msg}</div>}
        <button className="btn full" type="submit" disabled={loading}>{loading ? '…' : 'Publier'}</button>
      </form>
    </div></main>
  );
}
