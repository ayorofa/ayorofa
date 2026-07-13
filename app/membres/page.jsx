'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import Avatar from '@/components/Avatar';
import BadgeVerifie from '@/components/BadgeVerifie';
import Presence from '@/components/Presence';
import BoutonReseau from '@/components/BoutonReseau';
import { METIERS, metierBySlug } from '@/data/metiers';
import { VILLES } from '@/data/villes';

const TYPES = [
  { v: '', label: 'Tous' },
  { v: 'entreprise', label: 'Entreprises' },
  { v: 'particulier', label: 'Particuliers' },
  { v: 'chercheur', label: "Chercheurs d'emploi" },
];
const TYPE_LABEL = { entreprise: 'Entreprise', particulier: 'Particulier', chercheur: "Chercheur d'emploi" };

export default function Membres() {
  const [me, setMe] = useState(null);
  const [mesInterets, setMesInterets] = useState([]);
  const [membres, setMembres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState('');
  const [ville, setVille] = useState('');
  const [metier, setMetier] = useState('');
  const [q, setQ] = useState('');
  const [enLigneSeul, setEnLigneSeul] = useState(false);

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setMe(user ? user.id : null);
      if (user) {
        const { data: moi } = await supabase.from('profiles').select('interets').eq('id', user.id).maybeSingle();
        setMesInterets((moi && moi.interets) || []);
      }
      const { data } = await supabase.from('profiles')
        .select('id,nom,type,ville,interets,avatar_url,verifie,bio,derniere_activite')
        .eq('banni', false)
        .order('derniere_activite', { ascending: false, nullsFirst: false })
        .limit(100);
      setMembres(data || []);
      setLoading(false);
    })();
  }, []);

  const actif = (m) => {
    if (!m.derniere_activite) return false;
    return (Date.now() - new Date(m.derniere_activite).getTime()) / 1000 < 300;
  };

  // Suggestions : ceux qui partagent mes centres d'intérêt
  const partage = (m) =>
    mesInterets.length > 0 && (m.interets || []).some((i) => mesInterets.includes(i));

  const vus = membres
    .filter((m) => m.id !== me)
    .filter((m) => !type || m.type === type)
    .filter((m) => !ville || m.ville === ville)
    .filter((m) => !metier || (m.interets || []).includes(metier))
    .filter((m) => !q || (m.nom || '').toLowerCase().includes(q.toLowerCase()))
    .filter((m) => !enLigneSeul || actif(m))
    .sort((a, b) => (partage(b) ? 1 : 0) - (partage(a) ? 1 : 0));

  const enLigneCount = membres.filter((m) => m.id !== me && actif(m)).length;

  if (!supabase) return <main className="sec"><div className="wrap"><div className="card">Configuration Supabase manquante.</div></div></main>;

  return (
    <main className="sec"><div className="wrap" style={{ maxWidth: 760 }}>
      <p className="eyebrow">La communauté</p>
      <h1>Membres</h1>
      <p className="muted">
        {membres.length} membre(s) · <strong style={{ color: 'var(--ok)' }}>{enLigneCount} en ligne</strong>
      </p>

      {/* Recherche + filtres */}
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher un membre…"
        style={{ width: '100%', marginTop: 14, padding: 13, border: '1px solid var(--line)', borderRadius: 12, fontSize: 16 }} />

      <div className="chips" style={{ marginTop: 12 }}>
        {TYPES.map((t) => (
          <button key={t.v} className={'chip' + (type === t.v ? ' on' : '')} onClick={() => setType(t.v)}>{t.label}</button>
        ))}
        <button className={'chip' + (enLigneSeul ? ' on' : '')} onClick={() => setEnLigneSeul(!enLigneSeul)}>
          🟢 En ligne
        </button>
      </div>

      <div className="feed-filters" style={{ marginTop: 10 }}>
        <select value={metier} onChange={(e) => setMetier(e.target.value)} aria-label="Centre d'intérêt">
          <option value="">Tous les intérêts</option>
          {METIERS.map((m) => <option key={m.slug} value={m.slug}>{m.name}</option>)}
        </select>
        <select value={ville} onChange={(e) => setVille(e.target.value)} aria-label="Ville">
          <option value="">Toute la ville</option>
          {VILLES.map((v) => <option key={v} value={v}>{v}</option>)}
        </select>
      </div>

      {loading ? <p className="muted" style={{ marginTop: 18 }}>Chargement…</p> : (
        <div style={{ display: 'grid', gap: 12, marginTop: 18 }}>
          {vus.length ? vus.map((m) => (
            <div key={m.id} className="card membre">
              <div className="membre-av">
                <Avatar url={m.avatar_url} nom={m.nom} size={54} href={`/profil/${m.id}`} />
                {actif(m) && <span className="pastille-on" title="En ligne" />}
              </div>
              <div className="membre-t">
                <div className="post-n">
                  <Link href={`/profil/${m.id}`}><strong>{m.nom || 'Utilisateur'}</strong></Link>
                  {m.verifie && <BadgeVerifie size="sm" />}
                </div>
                <p className="muted sm" style={{ margin: '2px 0' }}>
                  {TYPE_LABEL[m.type] || m.type}{m.ville ? ` · ${m.ville}` : ''}
                </p>
                <Presence date={m.derniere_activite} />
                {partage(m) && <span className="tag-match">Centres d’intérêt communs</span>}
                {(m.interets || []).length > 0 && (
                  <p className="muted sm" style={{ margin: '6px 0 0' }}>
                    {(m.interets || []).slice(0, 3).map((i) => (metierBySlug(i) ? metierBySlug(i).name : i)).join(' · ')}
                  </p>
                )}
              </div>
              <div className="membre-a">
                <BoutonReseau cibleId={m.id} me={me} petit />
                {me && (
                  <a className="btn btn-sm btn-ghost" href={`/messages?to=${m.id}`}>Message</a>
                )}
              </div>
            </div>
          )) : (
            <div className="card"><p className="muted" style={{ margin: 0 }}>Aucun membre ne correspond à ces critères.</p></div>
          )}
        </div>
      )}
    </div></main>
  );
}
