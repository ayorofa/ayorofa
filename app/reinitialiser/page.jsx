'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export default function Reinitialiser() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [valide, setValide] = useState(false);
  const [pwd, setPwd] = useState('');
  const [pwd2, setPwd2] = useState('');
  const [msg, setMsg] = useState('');
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  // Supabase ouvre une session temporaire quand l'utilisateur arrive par le lien de l'e-mail.
  useEffect(() => {
    if (!supabase) { setReady(true); return; }
    let sub;
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) setValide(true);
      const res = supabase.auth.onAuthStateChange((event) => {
        if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') setValide(true);
      });
      sub = res.data.subscription;
      setReady(true);
    })();
    return () => { if (sub) sub.unsubscribe(); };
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setMsg('');
    if (pwd.length < 6) { setMsg('Le mot de passe doit contenir au moins 6 caractères.'); return; }
    if (pwd !== pwd2) { setMsg('Les deux mots de passe ne sont pas identiques.'); return; }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: pwd });
    setLoading(false);
    if (error) { setMsg(error.message); return; }
    setOk(true);
    setTimeout(() => router.push('/espace'), 1800);
  };

  if (!supabase) return <main className="sec"><div className="wrap"><div className="card">Configuration Supabase manquante.</div></div></main>;
  if (!ready) return <main className="sec"><div className="wrap"><p className="muted">Chargement…</p></div></main>;

  if (ok) {
    return (
      <main className="sec"><div className="wrap" style={{ maxWidth: 480 }}>
        <div className="card ok">
          <h1>Mot de passe modifié ✓</h1>
          <p className="muted">Vous êtes connecté. Redirection vers votre espace…</p>
        </div>
      </div></main>
    );
  }

  if (!valide) {
    return (
      <main className="sec"><div className="wrap" style={{ maxWidth: 480 }}>
        <div className="card">
          <h1>Lien invalide ou expiré</h1>
          <p className="muted">Ce lien n’est plus valable. Demandez-en un nouveau.</p>
          <Link className="btn btn-sm" href="/mot-de-passe-oublie" style={{ marginTop: 10 }}>Demander un nouveau lien</Link>
        </div>
      </div></main>
    );
  }

  return (
    <main className="sec"><div className="wrap" style={{ maxWidth: 480 }}>
      <p className="eyebrow">Sécurité</p>
      <h1>Choisir un nouveau mot de passe</h1>
      <form className="card form" onSubmit={submit} style={{ gridTemplateColumns: '1fr' }}>
        <label>Nouveau mot de passe
          <input type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} required minLength={6} />
        </label>
        <label>Confirmer le mot de passe
          <input type="password" value={pwd2} onChange={(e) => setPwd2(e.target.value)} required minLength={6} />
        </label>
        {msg && <div style={{ color: '#b3261e' }}>{msg}</div>}
        <button className="btn" type="submit" disabled={loading}>{loading ? '…' : 'Enregistrer'}</button>
      </form>
    </div></main>
  );
}
