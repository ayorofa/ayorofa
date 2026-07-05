'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { metierBySlug } from '@/data/metiers';

const TYPE_LABEL = { entreprise: 'Entreprise', particulier: 'Particulier', chercheur: "Chercheur d'emploi" };

export default function Espace() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/connexion'); return; }
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      setProfile(data || { type: 'particulier', interets: [] });
      setLoading(false);
    })();
  }, [router]);

  const logout = async () => { await supabase.auth.signOut(); router.push('/'); };

  if (!supabase) return <main className="sec"><div className="wrap"><div className="card">Configuration Supabase manquante — ajoutez les variables d’environnement puis redéployez.</div></div></main>;
  if (loading) return <main className="sec"><div className="wrap"><p className="muted">Chargement…</p></div></main>;

  const interets = (profile?.interets || []).map((s) => metierBySlug(s)?.name || s);
  return (
    <main className="sec"><div className="wrap">
      <p className="eyebrow">Mon espace</p>
      <h1>Bonjour {profile?.nom || ''} 👋</h1>
      <div className="card" style={{ maxWidth: 640 }}>
        <p><strong>Profil :</strong> {TYPE_LABEL[profile?.type] || profile?.type}</p>
        <p><strong>Ville :</strong> {profile?.ville || '—'}</p>
        <p><strong>Centres d’intérêt :</strong> {interets.join(', ') || '—'}</p>
        <button className="btn btn-sm" onClick={logout} style={{ marginTop: 12 }}>Se déconnecter</button>
      </div>
      <div style={{ marginTop: 30 }}>
        <p className="eyebrow">Suggestions pour vous</p>
        <h2>Bientôt : vos besoins & opportunités en temps réel</h2>
        <p className="muted" style={{ maxWidth: 560 }}>À l’étape suivante, tu verras ici en direct les demandes et offres correspondant à tes centres d’intérêt.</p>
      </div>
    </div></main>
  );
}
