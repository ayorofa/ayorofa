'use client';
import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export default function MotDePasseOublie() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!supabase) { setMsg('Configuration Supabase manquante.'); return; }
    setLoading(true); setMsg('');
    const redirectTo = `${window.location.origin}/reinitialiser`;
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo });
    setLoading(false);
    if (error) { setMsg(error.message); return; }
    setSent(true);
  };

  if (sent) {
    return (
      <main className="sec"><div className="wrap" style={{ maxWidth: 480 }}>
        <div className="card ok">
          <h1>Vérifiez vos e-mails ✓</h1>
          <p className="muted">Si un compte existe avec cette adresse, vous allez recevoir un lien pour choisir un nouveau mot de passe.</p>
          <p className="muted sm">Pensez à regarder dans les spams. Le lien expire après un moment.</p>
          <Link className="btn btn-sm" href="/connexion" style={{ marginTop: 10 }}>Retour à la connexion</Link>
        </div>
      </div></main>
    );
  }

  return (
    <main className="sec"><div className="wrap" style={{ maxWidth: 480 }}>
      <p className="eyebrow">Mot de passe oublié</p>
      <h1>Réinitialiser mon mot de passe</h1>
      <p className="muted" style={{ marginBottom: 18 }}>Entrez l’adresse e-mail de votre compte. Nous vous enverrons un lien pour en choisir un nouveau.</p>
      <form className="card form" onSubmit={submit} style={{ gridTemplateColumns: '1fr' }}>
        <label>E-mail
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="votre@email.com" />
        </label>
        {msg && <div style={{ color: '#b3261e' }}>{msg}</div>}
        <button className="btn" type="submit" disabled={loading}>{loading ? '…' : 'Envoyer le lien'}</button>
      </form>
      <p className="muted sm" style={{ marginTop: 14 }}>
        <Link href="/connexion">Retour à la connexion</Link>
      </p>
    </div></main>
  );
}
