'use client';
import { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { METIERS, metierBySlug } from '@/data/metiers';
import { VILLES } from '@/data/villes';
import Avatar from '@/components/Avatar';
import BadgeVerifie from '@/components/BadgeVerifie';
import BadgesPro from '@/components/BadgesPro';
import BesoinCard from '@/components/BesoinCard';

const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

function lireHistorique() {
  try { return JSON.parse(localStorage.getItem('ayo-recherches') || '[]'); } catch (e) { return []; }
}
function ajouterHistorique(t) {
  try {
    const h = [t, ...lireHistorique().filter((x) => x !== t)].slice(0, 6);
    localStorage.setItem('ayo-recherches', JSON.stringify(h));
  } catch (e) {}
}

function Recherche() {
  const sp = useSearchParams();
  const router = useRouter();
  const [q, setQ] = useState(sp.get('q') || '');
  const [me, setMe] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [ouvert, setOuvert] = useState(false);
  const [historique, setHistorique] = useState([]);
  const [populaires, setPopulaires] = useState([]);
  const [resMembres, setResMembres] = useState([]);
  const [resAnnonces, setResAnnonces] = useState([]);
  const [cherche, setCherche] = useState(false);
  const [fait, setFait] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    setHistorique(lireHistorique());
    if (!supabase) return;
    supabase.auth.getUser().then(({ data: { user } }) => setMe(user ? user.id : null));
    supabase.from('recherches').select('terme,n').order('n', { ascending: false }).limit(8)
      .then(({ data }) => setPopulaires((data || []).map((r) => r.terme)));
    const q0 = sp.get('q');
    if (q0) lancer(q0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── suggestions instantanées ──
  const suggerer = (val) => {
    const n = norm(val);
    if (n.length < 2) { setSuggestions([]); return; }
    const sug = [];
    METIERS.forEach((m) => { if (norm(m.name).includes(n)) sug.push({ t: 'metier', v: m.slug, l: m.name }); });
    VILLES.forEach((v) => { if (norm(v).includes(n)) sug.push({ t: 'ville', v, l: v }); });
    setSuggestions(sug.slice(0, 6));
    // membres par nom / entreprise (léger, avec délai)
    clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      if (!supabase) return;
      const { data } = await supabase.from('profiles')
        .select('id,nom,avatar_url,verifie,badges,metier_principal,ville')
        .or(`nom.ilike.%${val}%,entreprise.ilike.%${val}%`).limit(4);
      setSuggestions((s) => [...s.filter((x) => x.t !== 'membre'),
        ...(data || []).map((p) => ({ t: 'membre', v: p.id, l: p.nom || 'Utilisateur', p }))].slice(0, 9));
    }, 250);
  };

  const onInput = (e) => {
    const val = e.target.value;
    setQ(val); setOuvert(true); setFait(false);
    suggerer(val);
  };

  // ── lancer une recherche complète ──
  const lancer = async (terme) => {
    const t = terme.trim();
    if (!t) return;
    setQ(t); setOuvert(false); setCherche(true); setFait(false);
    router.replace(`/recherche?q=${encodeURIComponent(t)}`);
    ajouterHistorique(t); setHistorique(lireHistorique());
    if (supabase) supabase.rpc('chercher_terme', { t }).then(() => {});

    const estTag = t.startsWith('#');
    const motif = `%${estTag ? t : t}%`;

    const [membres, annonces] = await Promise.all([
      estTag ? Promise.resolve({ data: [] }) :
        supabase.from('profiles')
          .select('id,nom,type,ville,avatar_url,verifie,badges,metier_principal,entreprise,competences')
          .or(`nom.ilike.${motif},entreprise.ilike.${motif},zone.ilike.${motif}`)
          .limit(12),
      supabase.from('besoins')
        .select('*')
        .or(`titre.ilike.${motif},description.ilike.${motif}`)
        .order('created_at', { ascending: false })
        .limit(12),
    ]);

    // recherche aussi par métier correspondant
    let parMetier = [];
    if (!estTag) {
      const slugs = METIERS.filter((m) => norm(m.name).includes(norm(t))).map((m) => m.slug);
      if (slugs.length) {
        const { data } = await supabase.from('profiles')
          .select('id,nom,type,ville,avatar_url,verifie,badges,metier_principal,entreprise')
          .in('metier_principal', slugs).limit(12);
        parMetier = data || [];
      }
    }
    const vus = new Set();
    const tousMembres = [...(membres.data || []), ...parMetier].filter((m) => {
      if (vus.has(m.id)) return false; vus.add(m.id); return true;
    });

    setResMembres(tousMembres);
    setResAnnonces(annonces.data || []);
    setCherche(false); setFait(true);
  };

  return (
    <main className="sec"><div className="wrap" style={{ maxWidth: 720 }}>
      <p className="eyebrow">Recherche</p>
      <h1>Que cherchez-vous ?</h1>

      <div className="r-boite">
        <form onSubmit={(e) => { e.preventDefault(); lancer(q); }} className="r-form">
          <input value={q} onChange={onInput} onFocus={() => setOuvert(true)}
            placeholder="Métier, nom, entreprise, ville, #hashtag…"
            aria-label="Recherche" autoComplete="off" />
          <button className="btn" type="submit">🔎</button>
        </form>

        {ouvert && suggestions.length > 0 && (
          <div className="r-sugg" role="listbox">
            {suggestions.map((s, i) => (
              s.t === 'membre' ? (
                <Link key={i} className="r-s" href={`/profil/${s.v}`}>
                  <Avatar url={s.p.avatar_url} nom={s.l} size={28} />
                  <span><strong>{s.l}</strong>{s.p.verifie && ' ✔'} <em className="muted sm">
                    {s.p.metier_principal ? metierBySlug(s.p.metier_principal)?.name : ''}{s.p.ville ? ` · ${s.p.ville}` : ''}</em></span>
                </Link>
              ) : (
                <button key={i} type="button" className="r-s" onClick={() => lancer(s.l)}>
                  <span className="r-ic">{s.t === 'metier' ? '🛠' : '📍'}</span>
                  <span>{s.l} <em className="muted sm">{s.t === 'metier' ? 'métier' : 'ville'}</em></span>
                </button>
              )
            ))}
          </div>
        )}
      </div>

      {/* Historique + populaires (quand pas de résultats affichés) */}
      {!fait && !cherche && (
        <div style={{ marginTop: 18 }}>
          {historique.length > 0 && (
            <>
              <p className="r-titre">Vos recherches récentes</p>
              <div className="chips">
                {historique.map((h) => (
                  <button key={h} className="chip" onClick={() => lancer(h)}>{h}</button>
                ))}
              </div>
            </>
          )}
          {populaires.length > 0 && (
            <>
              <p className="r-titre" style={{ marginTop: 16 }}>Recherches populaires 🔥</p>
              <div className="chips">
                {populaires.map((h) => (
                  <button key={h} className="chip" onClick={() => lancer(h)}>{h}</button>
                ))}
              </div>
            </>
          )}
          <p className="r-titre" style={{ marginTop: 16 }}>Explorer par métier</p>
          <div className="chips">
            {METIERS.slice(0, 10).map((m) => (
              <Link key={m.slug} className="chip" href={`/membres?metier=${m.slug}`}>{m.name}</Link>
            ))}
          </div>
        </div>
      )}

      {cherche && <p className="muted" style={{ marginTop: 20 }}>Recherche en cours…</p>}

      {fait && (
        <div style={{ marginTop: 20 }}>
          {/* Membres */}
          <h2 style={{ fontSize: '1.1rem' }}>Membres & professionnels ({resMembres.length})</h2>
          {resMembres.length ? (
            <div style={{ display: 'grid', gap: 10, marginTop: 10 }}>
              {resMembres.map((m) => (
                <div key={m.id} className="card" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <Avatar url={m.avatar_url} nom={m.nom} size={44} href={`/profil/${m.id}`} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="post-n">
                      <Link href={`/profil/${m.id}`}><strong>{m.nom || 'Utilisateur'}</strong></Link>
                      {m.verifie && <BadgeVerifie size="sm" />}
                      <BadgesPro badges={m.badges} mini />
                    </div>
                    <p className="muted sm" style={{ margin: 0 }}>
                      {m.metier_principal ? (metierBySlug(m.metier_principal)?.name || '') : ''}
                      {m.entreprise ? ` · ${m.entreprise}` : ''}{m.ville ? ` · ${m.ville}` : ''}
                    </p>
                  </div>
                  <Link className="btn btn-sm" href={`/profil/${m.id}`}>Voir</Link>
                </div>
              ))}
            </div>
          ) : <p className="muted sm" style={{ marginTop: 8 }}>Aucun membre trouvé pour « {q} ».</p>}

          {/* Annonces */}
          <h2 style={{ fontSize: '1.1rem', marginTop: 24 }}>Annonces & publications ({resAnnonces.length})</h2>
          {resAnnonces.length ? (
            <div style={{ display: 'grid', gap: 14, marginTop: 10 }}>
              {resAnnonces.map((b) => <BesoinCard key={b.id} b={b} me={me} />)}
            </div>
          ) : <p className="muted sm" style={{ marginTop: 8 }}>Aucune annonce trouvée pour « {q} ».</p>}
        </div>
      )}
    </div></main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<main className="sec"><div className="wrap"><p className="muted">Chargement…</p></div></main>}>
      <Recherche />
    </Suspense>
  );
}
