'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export default function Connexion() {
  const router = useRouter();
  const [f, setF] = useState({ email: '', password: '' });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const on = (e) => setF({ ...f, [e.target.name]: e.target.value });
  const submit = async (e) => {
    e.preventDefault();
    if (!supabase) { setMsg('Configuration Supabase manquante.'); return; }
    setLoading(true); setMsg('');
    const { error } = await supabase.auth.signInWithPassword({ email: f.email, password: f.password });
    setLoading(false);
    if (error) { setMsg(error.message); return; }
    router.push('/espace');
  };
  return (
    <main className="sec"><div className="wrap" style={{ maxWidth: 460 }}>
      <p className="eyebrow">Connexion</p><h1>Se connecter</h1>
      <form className="card form" onSubmit={submit} style={{ gridTemplateColumns: '1fr' }}>
        <label>E-mail<input name="email" type="email" value={f.email} onChange={on} required /></label>
        <label>Mot de passe<input name="password" type="password" value={f.password} onChange={on} required /></label>
        {msg && <div style={{ color: '#b3261e' }}>{msg}</div>}
        <button className="btn" type="submit" disabled={loading}>{loading ? '…' : 'Connexion'}</button>
      </form>
      <p className="muted sm" style={{ marginTop: 14 }}>
        <Link href="/mot-de-passe-oublie">Mot de passe oublié ?</Link>
      </p>
      <p className="muted sm" style={{ marginTop: 6 }}>Pas de compte ? <Link href="/inscription">S’inscrire</Link></p>
    </div></main>
  );
}
