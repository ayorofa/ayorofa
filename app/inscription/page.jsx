'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { METIERS } from '@/data/metiers';
import { VILLES } from '@/data/villes';

const TYPES = [
  { v: 'entreprise', label: 'Entreprise' },
  { v: 'particulier', label: 'Particulier' },
  { v: 'chercheur', label: "Chercheur d'emploi" },
];

export default function Inscription() {
  const router = useRouter();
  const [f, setF] = useState({ nom: '', email: '', password: '', type: 'particulier', ville: '' });
  const [interets, setInterets] = useState([]);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const on = (e) => setF({ ...f, [e.target.name]: e.target.value });
  const chip = (active) => ({ background: active ? 'var(--gold)' : 'transparent', color: active ? 'var(--ink)' : 'var(--text)', border: '1px solid var(--line)' });
  const toggle = (s) => setInterets((a) => (a.includes(s) ? a.filter((x) => x !== s) : [...a, s]));

  const submit = async (e) => {
    e.preventDefault();
    if (!supabase) { setMsg('Configuration Supabase manquante (variables d’environnement).'); return; }
    setLoading(true); setMsg('');
    const { error } = await supabase.auth.signUp({
      email: f.email, password: f.password,
      options: { data: { nom: f.nom, type: f.type, ville: f.ville, interets } },
    });
    setLoading(false);
    if (error) { setMsg(error.message); return; }
    router.push('/espace');
  };

  return (
    <main className="sec"><div className="wrap" style={{ maxWidth: 620 }}>
      <p className="eyebrow">Créer un compte</p>
      <h1>Inscription</h1>
      <form className="card form" onSubmit={submit}>
        <div className="full">
          <div style={{ fontWeight: 600, fontSize: '.9rem', marginBottom: 8 }}>Je suis…</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {TYPES.map((t) => (
              <button type="button" key={t.v} className="btn" style={chip(f.type === t.v)} onClick={() => setF({ ...f, type: t.v })}>{t.label}</button>
            ))}
          </div>
        </div>
        <label>Nom / Entreprise<input name="nom" value={f.nom} onChange={on} required /></label>
        <label>Ville
          <select name="ville" value={f.ville} onChange={on}>
            <option value="">Choisir…</option>
            {VILLES.map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
        </label>
        <label>E-mail<input name="email" type="email" value={f.email} onChange={on} required /></label>
        <label>Mot de passe<input name="password" type="password" value={f.password} onChange={on} required minLength={6} /></label>
        <div className="full">
          <div style={{ fontWeight: 600, fontSize: '.9rem', marginBottom: 8 }}>Centres d’intérêt</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {METIERS.map((m) => (
              <button type="button" key={m.slug} className="btn btn-sm" style={chip(interets.includes(m.slug))} onClick={() => toggle(m.slug)}>{m.name}</button>
            ))}
          </div>
        </div>
        {msg && <div className="full" style={{ color: '#b3261e' }}>{msg}</div>}
        <button className="btn full" type="submit" disabled={loading}>{loading ? '…' : 'Créer mon compte'}</button>
      </form>
      <p className="muted sm" style={{ marginTop: 14 }}>Déjà inscrit ? <a href="/connexion">Se connecter</a></p>
    </div></main>
  );
}
