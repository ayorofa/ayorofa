'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import BesoinCard from '@/components/BesoinCard';
import Avatar from '@/components/Avatar';
import SponsorBanner from '@/components/SponsorBanner';
import { METIERS } from '@/data/metiers';
import { VILLES } from '@/data/villes';

const FILTRES = [
  { v: '', label: 'Tout' },
  { v: 'post', label: 'Publications' },
  { v: 'evenement', label: 'Événements' },
  { v: 'promotion', label: 'Promos' },
  { v: 'demande', label: 'Demandes' },
  { v: 'offre_emploi', label: "Offres d'emploi" },
  { v: 'recherche', label: 'Chercheurs' },
];

export default function Accueil() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uid, setUid] = useState(null);
  const [suivis, setSuivis] = useState([]);       // les gens que je suis
  const [moi, setMoi] = useState({ nom: '', avatar_url: null });
  const [onglet, setOnglet] = useState('tout');   // tout | abonnements
  const [type, setType] = useState('');
  const [metier, setMetier] = useState('');
  const [ville, setVille] = useState('');

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    let channel;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const me = user ? user.id : null;
      setUid(me);

      // Qui je suis (abonnements)
      if (me) {
        const { data: ab } = await supabase.from('abonnes').select('suivi').eq('suiveur', me);
        setSuivis((ab || []).map((a) => a.suivi));
        const { data: mp } = await supabase.from('profiles').select('nom,avatar_url').eq('id', me).maybeSingle();
        if (mp) setMoi(mp);
      }

      const { data } = await supabase.from('besoins').select('*')
        .order('created_at', { ascending: false }).limit(60);
      setItems(data || []);
      setLoading(false);

      channel = supabase.channel('accueil-feed')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'besoins' },
          (payload) => setItems((cur) => [payload.new, ...cur]))
        .subscribe();
    })();
    return () => { if (channel) supabase.removeChannel(channel); };
  }, []);

  const vus = items
    .filter((b) => onglet === 'tout' || suivis.includes(b.auteur))
    .filter((b) => !type || b.type === type)
    .filter((b) => !metier || b.metier === metier)
    .filter((b) => !ville || b.ville === ville);

  return (
    <>
      {!uid && (
        <section className="hero hero-slim">
          <div className="wrap">
            <p className="eyebrow" style={{ color: 'var(--gold-l)' }}>La plateforme de mise en relation</p>
            <h1>Un besoin d’un côté. Un talent de l’autre.</h1>
            <p>Découvrez les annonces en direct. Créez un compte gratuit pour publier, réagir et discuter.</p>
            <div className="hero-cta">
              <Link href="/inscription" className="btn">Créer mon compte — gratuit</Link>
              <Link href="/abonnements" className="btn btn-onink">Voir les formules</Link>
            </div>
          </div>
        </section>
      )}

      <main className="sec">
        <div className="wrap feed">
          {uid ? (
            <div className="composer card">
              <div className="composer-top">
                <Avatar url={moi.avatar_url} nom={moi.nom} size={44} href={`/profil/${uid}`} />
                <Link href="/publier" className="composer-input">
                  Quoi de neuf{moi.nom ? `, ${moi.nom.split(' ')[0]}` : ''} ? Publiez un besoin ou une offre…
                </Link>
              </div>
              <div className="composer-actions">
                <Link href="/publier">📷 <span>Photo</span></Link>
                <Link href="/publier">🎥 <span>Vidéo</span></Link>
                <Link href="/publier">📢 <span>Annonce</span></Link>
              </div>
            </div>
          ) : (
            <div className="feed-head">
              <div>
                <p className="eyebrow">En direct 🔴</p>
                <h2 style={{ margin: 0 }}>Besoins & opportunités</h2>
              </div>
              <Link href="/inscription" className="btn btn-sm">Publier</Link>
            </div>
          )}

          {/* Onglets : Tout / Mes abonnements */}
          {uid && (
            <div className="onglets" role="tablist">
              <button
                className={'onglet' + (onglet === 'tout' ? ' on' : '')}
                onClick={() => setOnglet('tout')}
                role="tab" aria-selected={onglet === 'tout'}
              >
                Tout
              </button>
              <button
                className={'onglet' + (onglet === 'abonnements' ? ' on' : '')}
                onClick={() => setOnglet('abonnements')}
                role="tab" aria-selected={onglet === 'abonnements'}
              >
                Mes abonnements
                {suivis.length > 0 && <span className="onglet-n">{suivis.length}</span>}
              </button>
            </div>
          )}

          <div className="chips" style={{ marginTop: uid ? 14 : 0 }}>
            {FILTRES.map((f) => (
              <button key={f.v} className={'chip' + (type === f.v ? ' on' : '')} onClick={() => setType(f.v)}>
                {f.label}
              </button>
            ))}
          </div>
          <div className="feed-filters">
            <select value={metier} onChange={(e) => setMetier(e.target.value)} aria-label="Métier">
              <option value="">Tous les métiers</option>
              {METIERS.map((m) => <option key={m.slug} value={m.slug}>{m.name}</option>)}
            </select>
            <select value={ville} onChange={(e) => setVille(e.target.value)} aria-label="Ville">
              <option value="">Toute la ville</option>
              {VILLES.map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>

          {onglet === 'tout' && <div style={{ margin: '16px 0' }}><SponsorBanner slot="home" /></div>}

          {loading ? (
            <p className="muted" style={{ marginTop: 18 }}>Chargement du fil…</p>
          ) : vus.length ? (
            <div style={{ display: 'grid', gap: 14, marginTop: 16 }}>
              {vus.map((b, i) => (
                <div key={b.id}>
                  <BesoinCard b={b} me={uid} />
                  {!uid && i === 2 && (
                    <div className="joinbox">
                      <h3>Rejoignez la communauté</h3>
                      <p>Créez un compte gratuit pour publier, réagir et contacter les membres.</p>
                      <Link href="/inscription" className="btn">Créer mon compte — gratuit</Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : onglet === 'abonnements' ? (
            /* Fil abonnements vide : on guide vers les membres */
            <div className="card vide" style={{ marginTop: 16 }}>
              <div className="vide-ic" aria-hidden="true">👥</div>
              <h3>{suivis.length === 0 ? 'Vous ne suivez personne' : 'Rien de neuf'}</h3>
              <p className="muted">
                {suivis.length === 0
                  ? 'Abonnez-vous à des membres pour voir leurs annonces ici, en priorité.'
                  : 'Les membres que vous suivez n’ont rien publié pour l’instant.'}
              </p>
              <Link href="/membres" className="btn">Découvrir des membres</Link>
            </div>
          ) : (
            <div className="card" style={{ marginTop: 16 }}>
              <h3>Le fil est encore calme</h3>
              <p className="muted">Soyez le premier à publier un besoin ou une offre.</p>
              <Link href={uid ? '/publier' : '/inscription'} className="btn btn-sm">Publier une annonce</Link>
            </div>
          )}

          {!uid && vus.length > 0 && (
            <div className="joinbox" style={{ marginTop: 20 }}>
              <h3>Vous voulez répondre à ces annonces ?</h3>
              <p>L’inscription est gratuite et prend 2 minutes.</p>
              <Link href="/inscription" className="btn">Créer mon compte</Link>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
