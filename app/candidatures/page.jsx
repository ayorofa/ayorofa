'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { ilya } from '@/lib/meta';
import Avatar from '@/components/Avatar';
import BadgeVerifie from '@/components/BadgeVerifie';

const ETAT = {
  nouvelle: { l: 'En attente', c: '#a9863a' },
  retenue: { l: 'Retenue 🎉', c: '#1A6B50' },
  ecartee: { l: 'Non retenue', c: '#8d8371' },
};

export default function Candidatures() {
  const [me, setMe] = useState(null);
  const [onglet, setOnglet] = useState('recues');
  const [envoyees, setEnvoyees] = useState([]);
  const [recues, setRecues] = useState([]);   // [{offre, candidatures:[…]}]
  const [loading, setLoading] = useState(true);

  const charger = async (uid) => {
    // mes candidatures envoyées
    const { data: env } = await supabase.from('candidatures').select('*')
      .eq('candidat', uid).order('created_at', { ascending: false });
    const offreIds = [...new Set((env || []).map((c) => c.offre))];
    let offres = {};
    if (offreIds.length) {
      const { data: bs } = await supabase.from('besoins').select('id,titre,auteur').in('id', offreIds);
      (bs || []).forEach((b) => { offres[b.id] = b; });
    }
    setEnvoyees((env || []).map((c) => ({ ...c, of: offres[c.offre] || { titre: 'Offre supprimée' } })));

    // candidatures reçues sur MES offres
    const { data: mesOffres } = await supabase.from('besoins')
      .select('id,titre,created_at').eq('auteur', uid).eq('type', 'offre_emploi')
      .order('created_at', { ascending: false });
    const ids = (mesOffres || []).map((o) => o.id);
    let parOffre = [];
    if (ids.length) {
      const { data: cands } = await supabase.from('candidatures').select('*')
        .in('offre', ids).order('created_at', { ascending: false });
      const cIds = [...new Set((cands || []).map((c) => c.candidat))];
      let profs = {};
      if (cIds.length) {
        const { data: ps } = await supabase.from('profiles')
          .select('id,nom,avatar_url,verifie,ville,metier_principal').in('id', cIds);
        (ps || []).forEach((p) => { profs[p.id] = p; });
      }
      parOffre = (mesOffres || []).map((o) => ({
        offre: o,
        candidatures: (cands || []).filter((c) => c.offre === o.id)
          .map((c) => ({ ...c, prof: profs[c.candidat] || { nom: 'Candidat' } })),
      })).filter((x) => x.candidatures.length > 0);
    }
    setRecues(parOffre);
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

  const decider = async (c, statut) => {
    await supabase.from('candidatures').update({ statut }).eq('id', c.id);
    await charger(me);
  };

  const nbRecues = recues.reduce((s, x) => s + x.candidatures.length, 0);

  return (
    <main className="sec"><div className="wrap" style={{ maxWidth: 720 }}>
      <p className="eyebrow">Emploi</p>
      <h1>Candidatures 💼</h1>

      <div className="onglets" style={{ marginTop: 12 }}>
        <button className={'onglet' + (onglet === 'recues' ? ' on' : '')} onClick={() => setOnglet('recues')}>
          Reçues (recruteur) {nbRecues > 0 && <span className="onglet-n">{nbRecues}</span>}
        </button>
        <button className={'onglet' + (onglet === 'envoyees' ? ' on' : '')} onClick={() => setOnglet('envoyees')}>
          Mes candidatures {envoyees.length > 0 && <span className="onglet-n">{envoyees.length}</span>}
        </button>
      </div>

      {loading ? <p className="muted" style={{ marginTop: 16 }}>Chargement…</p> : (
        <div style={{ marginTop: 16 }}>
          {onglet === 'recues' && (
            recues.length ? recues.map(({ offre, candidatures }) => (
              <div key={offre.id} style={{ marginBottom: 22 }}>
                <h2 style={{ fontSize: '1.05rem', margin: '0 0 8px' }}>
                  <Link href={`/annonce/${offre.id}`}>{offre.titre}</Link>{' '}
                  <span className="muted sm">({candidatures.length} candidat{candidatures.length > 1 ? 's' : ''})</span>
                </h2>
                <div style={{ display: 'grid', gap: 10 }}>
                  {candidatures.map((c) => {
                    const e = ETAT[c.statut] || ETAT.nouvelle;
                    return (
                      <div key={c.id} className="card">
                        <div style={{ display: 'flex', gap: 11, alignItems: 'center' }}>
                          <Avatar url={c.prof.avatar_url} nom={c.prof.nom} size={42} href={`/profil/${c.candidat}`} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div className="post-n">
                              <Link href={`/profil/${c.candidat}`}><strong>{c.prof.nom}</strong></Link>
                              {c.prof.verifie && <BadgeVerifie size="sm" />}
                            </div>
                            <p className="muted sm" style={{ margin: 0 }}>
                              {c.prof.ville ? `${c.prof.ville} · ` : ''}{ilya(c.created_at)}
                            </p>
                          </div>
                          <span className="badge" style={{ color: e.c, background: e.c + '1a' }}>{e.l}</span>
                        </div>
                        <p style={{ margin: '10px 0 0', fontSize: '.93rem' }}>{c.message}</p>
                        <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                          {c.cv && <a className="btn btn-sm btn-ghost" href={c.cv} target="_blank" rel="noopener">📄 {c.cv_nom || 'CV'}</a>}
                          <Link className="btn btn-sm btn-ghost" href={`/messages?to=${c.candidat}`}>Message</Link>
                          {c.statut === 'nouvelle' && (
                            <>
                              <button className="btn btn-sm" onClick={() => decider(c, 'retenue')}>✓ Retenir</button>
                              <button className="btn btn-sm btn-ghost" style={{ color: '#b3261e' }} onClick={() => decider(c, 'ecartee')}>Écarter</button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )) : (
              <div className="card">
                <p className="muted" style={{ margin: 0 }}>Aucune candidature reçue pour l’instant.
                Publiez une <strong>offre d’emploi</strong> : les candidats postuleront directement dessus, CV compris.</p>
                <Link className="btn btn-sm" href="/publier" style={{ marginTop: 10 }}>Publier une offre</Link>
              </div>
            )
          )}

          {onglet === 'envoyees' && (
            envoyees.length ? (
              <div style={{ display: 'grid', gap: 10 }}>
                {envoyees.map((c) => {
                  const e = ETAT[c.statut] || ETAT.nouvelle;
                  return (
                    <div key={c.id} className="card" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <Link href={`/annonce/${c.offre}`}><strong>{c.of.titre}</strong></Link>
                        <p className="muted sm" style={{ margin: '2px 0 0' }}>
                          Postulé {ilya(c.created_at)}{c.cv ? ' · CV joint 📄' : ''}
                        </p>
                      </div>
                      <span className="badge" style={{ color: e.c, background: e.c + '1a' }}>{e.l}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="card">
                <p className="muted" style={{ margin: 0 }}>Vous n’avez pas encore postulé.
                Filtrez le fil sur <strong>« Offres d’emploi »</strong> et touchez <strong>📩 Postuler</strong>.</p>
                <Link className="btn btn-sm" href="/fil" style={{ marginTop: 10 }}>Voir les offres</Link>
              </div>
            )
          )}
        </div>
      )}
    </div></main>
  );
}
