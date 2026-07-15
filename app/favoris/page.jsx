'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import Avatar from '@/components/Avatar';
import BadgeVerifie from '@/components/BadgeVerifie';
import BadgesPro from '@/components/BadgesPro';
import { metierBySlug } from '@/data/metiers';

const TYPE_LABEL = { entreprise: 'Entreprise', particulier: 'Particulier', chercheur: "Chercheur d'emploi" };

export default function Favoris() {
  const [me, setMe] = useState(null);
  const [liste, setListe] = useState([]);
  const [loading, setLoading] = useState(true);

  const charger = async (uid) => {
    const { data: favs } = await supabase.from('favoris').select('cible').eq('proprietaire', uid);
    const ids = (favs || []).map((f) => f.cible);
    if (!ids.length) { setListe([]); return; }
    const { data: ps } = await supabase.from('profiles')
      .select('id,nom,type,ville,metier_principal,avatar_url,verifie,badges')
      .in('id', ids);
    setListe(ps || []);
  };

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = '/connexion'; return; }
      setMe(user.id);
      await charger(user.id);
      setLoading(false);
    })();
  }, []);

  const retirer = async (cible) => {
    await supabase.from('favoris').delete().eq('proprietaire', me).eq('cible', cible);
    setListe((l) => l.filter((x) => x.id !== cible));
  };

  return (
    <main className="sec"><div className="wrap" style={{ maxWidth: 720 }}>
      <p className="eyebrow">Mon carnet</p>
      <h1>Profils enregistrés ★</h1>
      <p className="muted sm">Les professionnels et membres que vous avez mis de côté.</p>
      {loading ? <p className="muted" style={{ marginTop: 16 }}>Chargement…</p> :
      liste.length ? (
        <div style={{ display: 'grid', gap: 12, marginTop: 16 }}>
          {liste.map((m) => (
            <div key={m.id} className="card" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <Avatar url={m.avatar_url} nom={m.nom} size={48} href={`/profil/${m.id}`} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="post-n">
                  <Link href={`/profil/${m.id}`}><strong>{m.nom || 'Utilisateur'}</strong></Link>
                  {m.verifie && <BadgeVerifie size="sm" />}
                  <BadgesPro badges={m.badges} mini />
                </div>
                <p className="muted sm" style={{ margin: 0 }}>
                  {m.metier_principal ? (metierBySlug(m.metier_principal)?.name || m.metier_principal) : (TYPE_LABEL[m.type] || m.type)}
                  {m.ville ? ` · ${m.ville}` : ''}
                </p>
              </div>
              <Link className="btn btn-sm" href={`/messages?to=${m.id}`}>Message</Link>
              <button className="btn btn-sm btn-ghost" onClick={() => retirer(m.id)} aria-label="Retirer">✕</button>
            </div>
          ))}
        </div>
      ) : (
        <div className="card" style={{ marginTop: 16 }}>
          <p className="muted" style={{ margin: 0 }}>Aucun profil enregistré pour l’instant.
          Sur un profil, touchez <strong>☆ Enregistrer</strong> pour le retrouver ici.</p>
          <Link className="btn btn-sm" href="/membres" style={{ marginTop: 10 }}>Parcourir l’annuaire</Link>
        </div>
      )}
    </div></main>
  );
}
