'use client';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { METIERS, metierBySlug } from '@/data/metiers';
import { VILLES } from '@/data/villes';
import Avatar from '@/components/Avatar';
import BadgeVerifie from '@/components/BadgeVerifie';

const ACTIONS = [
  { v: 'publication', l: '📝 Rédiger une annonce', aide: 'Décrivez ce que vous voulez annoncer (besoin, offre, actualité) : l’assistant écrit la publication.' },
  { v: 'corriger', l: '✍️ Corriger un texte', aide: 'Collez votre texte : orthographe, grammaire et style seront corrigés sans changer le sens.' },
  { v: 'devis', l: '📋 Générer un devis', aide: 'Décrivez les travaux, le montant et le délai : l’assistant met en forme un devis professionnel.' },
  { v: 'cv', l: '📄 Générer un CV', aide: 'Indiquez métier, expériences, formation et langues : l’assistant structure votre CV.' },
  { v: 'lettre', l: '💌 Rédiger une lettre', aide: 'Motivation, demande, réclamation… donnez le contexte, l’assistant rédige.' },
  { v: 'profil', l: '⭐ Améliorer mon profil', aide: 'Décrivez votre activité et vos points forts : l’assistant écrit votre présentation « À propos ».' },
  { v: 'reponse', l: '💬 Répondre à un message', aide: 'Collez le message reçu : l’assistant propose une réponse professionnelle.' },
  { v: 'estimation', l: '💰 Estimer un coût', aide: 'Choisissez le métier et décrivez la prestation : estimation d’abord sur les devis réels de la plateforme.' },
  { v: 'reco_pros', l: '🛠 Trouver des pros', aide: 'Choisissez un métier (et une ville) : les meilleurs profils correspondants.' },
  { v: 'reco_candidats', l: '🙋 Trouver des candidats', aide: 'Choisissez un métier : les chercheurs d’emploi intéressés.' },
];

function Assistant() {
  const sp = useSearchParams();
  const [action, setAction] = useState(sp.get('action') || 'publication');
  const [contexte, setContexte] = useState('');
  const [metier, setMetier] = useState('');
  const [ville, setVille] = useState('');
  const [resultat, setResultat] = useState('');
  const [liste, setListe] = useState(null);
  const [source, setSource] = useState('');
  const [err, setErr] = useState('');
  const [inactif, setInactif] = useState(false);
  const [busy, setBusy] = useState(false);
  const [copie, setCopie] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) window.location.href = '/connexion';
    });
  }, []);

  const meta = ACTIONS.find((a) => a.v === action) || ACTIONS[0];
  const estReco = action === 'reco_pros' || action === 'reco_candidats';
  const veutMetier = estReco || action === 'estimation';
  const veutTexte = !estReco;

  const lancer = async (e) => {
    e.preventDefault();
    setErr(''); setResultat(''); setListe(null); setInactif(false); setCopie(false); setBusy(true);
    const { data: { session } } = await supabase.auth.getSession();
    const r = await fetch('/api/ia', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.access_token}` },
      body: JSON.stringify({ action, contexte, metier, ville }),
    });
    const j = await r.json();
    setBusy(false);
    if (r.status === 503 || j.error === 'inactif') { setInactif(true); return; }
    if (!r.ok) { setErr(j.error || 'Une erreur est survenue.'); return; }
    if (j.liste) setListe(j.liste);
    if (j.texte) { setResultat(j.texte); setSource(j.source || ''); }
  };

  const copier = async () => {
    try { await navigator.clipboard.writeText(resultat); setCopie(true); setTimeout(() => setCopie(false), 2000); } catch (e) {}
  };

  return (
    <main className="sec"><div className="wrap" style={{ maxWidth: 720 }}>
      <p className="eyebrow">Assistant ✨</p>
      <h1>Votre assistant Ayôrôfa</h1>
      <p className="muted sm">Il rédige, corrige, estime et recommande — en français, à l’ivoirienne.</p>

      <div className="chips" style={{ marginTop: 14 }}>
        {ACTIONS.map((a) => (
          <button key={a.v} className={'chip' + (action === a.v ? ' on' : '')}
            onClick={() => { setAction(a.v); setResultat(''); setListe(null); setErr(''); setInactif(false); }}>
            {a.l}
          </button>
        ))}
      </div>

      <form className="card form" onSubmit={lancer} style={{ marginTop: 14 }}>
        <p className="muted sm full" style={{ margin: 0 }}>{meta.aide}</p>

        {veutMetier && (
          <label>Métier
            <select value={metier} onChange={(e) => setMetier(e.target.value)} required={estReco}>
              <option value="">Choisir…</option>
              {METIERS.map((m) => <option key={m.slug} value={m.slug}>{m.name}</option>)}
            </select>
          </label>
        )}
        {action === 'reco_pros' && (
          <label>Ville (optionnel)
            <select value={ville} onChange={(e) => setVille(e.target.value)}>
              <option value="">Toute la Côte d’Ivoire</option>
              {VILLES.map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
          </label>
        )}
        {veutTexte && (
          <label className="full">{action === 'reponse' ? 'Le message reçu' : action === 'corriger' ? 'Votre texte' : 'Décrivez votre besoin'}
            <textarea value={contexte} onChange={(e) => setContexte(e.target.value)} rows={5}
              required={action !== 'estimation'}
              placeholder={
                action === 'publication' ? 'Ex. Je cherche 2 maçons pour une dalle de 60 m² à Yopougon, démarrage lundi, budget 350 000 F…' :
                action === 'cv' ? 'Ex. Kouassi Jean, électricien bâtiment, 6 ans d’expérience (chantiers Cocody, société X), CAP électricité, français et baoulé…' :
                action === 'estimation' ? 'Ex. Peinture complète d’un appartement 3 pièces à Marcory, murs + plafonds…' :
                'Donnez le maximum de détails utiles…'
              } />
          </label>
        )}

        {err && <div className="full" style={{ color: '#b3261e' }}>{err}</div>}
        <button className="btn full" type="submit" disabled={busy}>
          {busy ? '✨ L’assistant réfléchit…' : '✨ Lancer l’assistant'}
        </button>
      </form>

      {inactif && (
        <div className="card" style={{ marginTop: 14, background: '#FFF8E8', border: '1.5px dashed var(--gold)' }}>
          <p style={{ margin: 0 }}>
            🔧 <strong>L’assistant IA arrive très bientôt !</strong> Cette fonction est en cours d’activation par l’équipe Ayôrôfa.
            En attendant, l’<strong>estimation de coût</strong> et les <strong>recommandations</strong> fonctionnent déjà.
          </p>
        </div>
      )}

      {resultat && (
        <div className="card" style={{ marginTop: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h2 style={{ fontSize: '1.05rem', margin: 0, marginRight: 'auto' }}>Résultat</h2>
            {source === 'donnees' && <span className="badge" style={{ color: '#1A6B50', background: '#1A6B501a' }}>Données réelles</span>}
            <button className="btn btn-sm" onClick={copier}>{copie ? '✓ Copié !' : '📋 Copier'}</button>
          </div>
          <p className="ia-resultat">{resultat}</p>
          {action === 'publication' && (
            <Link className="btn btn-sm btn-ghost" href="/publier">→ Ouvrir la page Publier</Link>
          )}
          {action === 'profil' && (
            <Link className="btn btn-sm btn-ghost" href="/profil/modifier">→ Coller dans mon profil</Link>
          )}
        </div>
      )}

      {liste && (
        <div style={{ marginTop: 14 }}>
          <h2 style={{ fontSize: '1.05rem' }}>
            {action === 'reco_pros' ? 'Professionnels recommandés' : 'Candidats potentiels'} ({liste.length})
          </h2>
          {liste.length ? (
            <div style={{ display: 'grid', gap: 10, marginTop: 10 }}>
              {liste.map((m) => (
                <div key={m.id} className="card" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <Avatar url={m.avatar_url} nom={m.nom} size={44} href={`/profil/${m.id}`} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="post-n">
                      <Link href={`/profil/${m.id}`}><strong>{m.nom || 'Utilisateur'}</strong></Link>
                      {m.verifie && <BadgeVerifie size="sm" />}
                    </div>
                    <p className="muted sm" style={{ margin: 0 }}>
                      {m.metier_principal ? (metierBySlug(m.metier_principal)?.name || '') : ''}
                      {m.ville ? ` · ${m.ville}` : ''}
                    </p>
                  </div>
                  <Link className="btn btn-sm" href={`/profil/${m.id}`}>Voir</Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="muted sm">Aucun profil correspondant pour l’instant — la communauté grandit chaque jour !</p>
          )}
        </div>
      )}

      <p className="muted sm" style={{ marginTop: 20 }}>
        ⚖️ L’assistant vous aide à rédiger : relisez toujours avant de publier. Limite : 20 utilisations IA par jour et par membre.
      </p>
    </div></main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<main className="sec"><div className="wrap"><p className="muted">Chargement…</p></div></main>}>
      <Assistant />
    </Suspense>
  );
}
