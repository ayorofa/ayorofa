'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import BesoinCard from '@/components/BesoinCard';

export default function AnnonceClient({ id }) {
  const [b, setB] = useState(null);
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setMe(user ? user.id : null);
      const { data } = await supabase.from('besoins').select('*').eq('id', id).maybeSingle();
      setB(data);
      setLoading(false);
    })();
  }, [id]);

  return (
    <main className="sec"><div className="wrap" style={{ maxWidth: 680 }}>
      {loading ? <p className="muted">Chargement…</p> :
       b ? (
        <>
          <BesoinCard b={b} me={me} />
          <p style={{ marginTop: 16 }}>
            <Link className="btn btn-ghost btn-sm" href={me ? '/fil' : '/'}>← Voir toutes les annonces</Link>
          </p>
        </>
       ) : (
        <div className="card">
          <p style={{ margin: 0 }}>Cette annonce n’existe plus ou a été retirée.</p>
          <Link className="btn btn-sm" href="/" style={{ marginTop: 10 }}>Retour à l’accueil</Link>
        </div>
       )}
    </div></main>
  );
}
