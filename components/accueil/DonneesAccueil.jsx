'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

/* ══════════════════════════════════════════════════════════
   DONNÉES RÉELLES DE LA PAGE D'ACCUEIL

   Un seul passage en base, partagé par toutes les sections :
   la page reste rapide sur un téléphone et une connexion faible.

   Règle absolue du cahier des charges : rien n'est inventé.
   Quand une donnée n'existe pas encore, la section concernée
   se masque d'elle-même plutôt que d'afficher du faux.
   ══════════════════════════════════════════════════════════ */

const TYPES_OPPORTUNITE = ['offre_emploi', 'recherche', 'demande'];

const VIDE = {
  pret: false,
  stats: { professionnels: null, opportunites: null },
  pros: [],
  metiers: [],
  opportunites: [],
  temoignages: [],
};

const Contexte = createContext(VIDE);
export const useDonneesAccueil = () => useContext(Contexte);

export default function DonneesAccueil({ children }) {
  const [d, setD] = useState(VIDE);

  useEffect(() => {
    if (!supabase) { setD((x) => ({ ...x, pret: true })); return; }
    let vivant = true;

    (async () => {
      const [
        nbPros, nbOpp, pros, metiers, opportunites, avis,
      ] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true })
          .eq('banni', false).not('metier_principal', 'is', null),
        supabase.from('besoins').select('id', { count: 'exact', head: true })
          .in('type', TYPES_OPPORTUNITE),
        supabase.from('profiles')
          .select('id,nom,entreprise,metier_principal,ville,avatar_url,verifie,badges,experience_annees,competences')
          .eq('banni', false).not('metier_principal', 'is', null)
          .order('verifie', { ascending: false })
          .order('derniere_activite', { ascending: false, nullsFirst: false })
          .limit(12),
        supabase.from('profiles').select('metier_principal')
          .eq('banni', false).not('metier_principal', 'is', null).limit(2000),
        supabase.from('besoins').select('id,titre,type,metier,ville,created_at')
          .in('type', TYPES_OPPORTUNITE)
          .order('created_at', { ascending: false }).limit(6),
        supabase.from('avis').select('cible,auteur,note,texte,created_at')
          .not('texte', 'is', null)
          .order('created_at', { ascending: false }).limit(40),
      ]);

      if (!vivant) return;

      const listePros = pros.data || [];
      const lignesAvis = avis.data || [];

      /* Note moyenne réelle, calculée à partir des avis déposés */
      const parCible = {};
      lignesAvis.forEach((a) => {
        if (!parCible[a.cible]) parCible[a.cible] = { total: 0, n: 0 };
        parCible[a.cible].total += a.note;
        parCible[a.cible].n += 1;
      });
      const prosNotes = listePros.map((p) => {
        const r = parCible[p.id];
        return { ...p, note: r ? r.total / r.n : null, nbAvis: r ? r.n : 0 };
      });

      /* Métiers réellement représentés, du plus fourni au moins fourni */
      const compte = {};
      (metiers.data || []).forEach((p) => {
        compte[p.metier_principal] = (compte[p.metier_principal] || 0) + 1;
      });

      /* Témoignages : uniquement des avis rédigés par de vrais membres.
         On va chercher le nom de leur auteur pour pouvoir les citer. */
      let temoignages = [];
      const retenus = lignesAvis.filter((a) => (a.texte || '').trim().length > 40).slice(0, 6);
      if (retenus.length) {
        const ids = [...new Set(retenus.flatMap((a) => [a.auteur, a.cible]))];
        const { data: gens } = await supabase.from('profiles')
          .select('id,nom,ville,metier_principal,avatar_url,verifie').in('id', ids);
        const par = {};
        (gens || []).forEach((g) => { par[g.id] = g; });
        temoignages = retenus
          .filter((a) => par[a.auteur] && par[a.auteur].nom)
          .map((a) => ({
            id: `${a.cible}-${a.auteur}`,
            texte: a.texte.trim(),
            note: a.note,
            auteur: par[a.auteur],
            cible: par[a.cible] || null,
          }));
      }

      if (!vivant) return;
      setD({
        pret: true,
        stats: { professionnels: nbPros.count, opportunites: nbOpp.count },
        pros: prosNotes,
        metiers: compte,
        opportunites: opportunites.data || [],
        temoignages,
      });
    })().catch(() => { if (vivant) setD((x) => ({ ...x, pret: true })); });

    return () => { vivant = false; };
  }, []);

  return <Contexte.Provider value={d}>{children}</Contexte.Provider>;
}
