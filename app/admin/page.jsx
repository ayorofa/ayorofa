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

export default function Admin() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [f, setF] = useState({ type: 'demande', titre: '', description: '', metier: '', ville: '', source: '', contact: '', lien: '' });
  const [msg, setMsg] = useState('');
  const [ok, setOk] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!supabase) { setReady(true); return; }
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/connexion'); return; }
      const { data } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
      setIsAdmin(!!(data && data.is_admin));
      setReady(true);
    })();
  }, [router]);

  const on = (e) => setF({ ...f, [e.target.name]: e.target.value });
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setMsg(''); setOk('');
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from('besoins').insert({
      auteur: user.id, type: f.type, titre: f.titre, description: f.description,
      metier: f.metier, ville: f.ville,
      source: f.source || null, contact: f.contact || null, lien: f.lien || null,
    });
    setLoading(false);
    if (error) { setMsg(error.message); return; }
    setOk('Annonce publiée ✓');
    setF({ type: f.type, titre: '', description: '', metier: f.metier, ville: f.ville, source: '', contact: '', lien: '' });
  };

  if (!supabase) return <main className="sec"><div className="wrap"><div className="card">Configuration Supabase manquante.</div></div></main>;
  if (!ready) return <main className="sec"><div className="wrap"><p className="muted">Chargement…</p></div></main>;
  if (!isAdmin) return <main className="sec"><div className="wrap"><div className="card"><h1>Accès réservé</h1><p className="muted">Cette page est réservée à l’administrateur.</p></div></div></main>;

  return (
    <main className="sec"><div className="wrap" style={{ maxWidth: 640 }}>
      <p className="eyebrow">Admin</p><h1>Ajouter une annonce repérée</h1>
      <p className="muted" style={{ marginBottom: 18 }}>Publie rapidement une annonce vue ailleurs (avec l’accord de la personne). Indique son contact pour que les membres puissent la joindre.</p>
      <form className="card form" onSubmit={submit}>
        <label className="full">Type
          <select name="type" value={f.type} onChange={on}>{TYPES.map((t) => <option key={t.v} value={t.v}>{t.label}</option>)}</select>
        </label>
        <label className="full">Titre<input name="titre" value={f.titre} onChange={on} required /></label>
        <label>Métier
          <select name="metier" value={f.metier} onChange={on} required><option value="">Choisir…</option>{METIERS.map((m) => <option key={m.slug} value={m.slug}>{m.name}</option>)}</select>
        </label>
        <label>Ville
          <select name="ville" value={f.ville} onChange={on}><option value="">Choisir…</option>{VILLES.map((v) => <option key={v} value={v}>{v}</option>)}</select>
        </label>
        <label className="full">Description<textarea name="description" value={f.description} onChange={on} rows={3} /></label>
        <label>Auteur / source<input name="source" value={f.source} onChange={on} placeholder="Nom, ou d’où vient l’annonce" /></label>
        <label>Contact WhatsApp<input name="contact" value={f.contact} onChange={on} placeholder="Ex. 2250700000000" /></label>
        <label className="full">Lien d’origine (optionnel)<input name="lien" value={f.lien} onChange={on} placeholder="https://…" /></label>
        {msg && <div className="full" style={{ color: '#b3261e' }}>{msg}</div>}
        {ok && <div className="full" style={{ color: '#2e7d5b' }}>{ok}</div>}
        <button className="btn full" type="submit" disabled={loading}>{loading ? '…' : "Publier l’annonce"}</button>
      </form>
    </div></main>
  );
}
