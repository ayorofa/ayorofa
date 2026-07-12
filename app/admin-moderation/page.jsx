'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import Avatar from '@/components/Avatar';
import { ilya } from '@/lib/meta';

const MOTIF = { spam: 'Spam', arnaque: 'Arnaque', faux: 'Faux profil', offensant: 'Offensant', autre: 'Autre' };
const TYPE = { besoin: 'Annonce', profil: 'Profil', commentaire: 'Commentaire' };

export default function Moderation() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [items, setItems] = useState([]);
  const [busy, setBusy] = useState(null);
  const [msg, setMsg] = useState('');

  const charger = async () => {
    const { data } = await supabase.from('signalements').select('*')
      .eq('statut', 'ouvert').order('created_at', { ascending: false }).limit(50);
    const sigs = data || [];

    // Contenu + auteur de chaque signalement
    const besoinIds = sigs.filter((s) => s.type === 'besoin').map((s) => s.cible_id);
    const userIds = [...new Set(sigs.map((s) => s.auteur_cible).filter(Boolean))];
    let besoins = {}, profils = {};
    if (besoinIds.length) {
      const { data: bs } = await supabase.from('besoins').select('id,titre,description').in('id', besoinIds);
      (bs || []).forEach((b) => { besoins[b.id] = b; });
    }
    if (userIds.length) {
      const { data: ps } = await supabase.from('profiles').select('id,nom,avatar_url,banni,verifie').in('id', userIds);
      (ps || []).forEach((p) => { profils[p.id] = p; });
    }
    setItems(sigs.map((s) => ({ ...s, besoin: besoins[s.cible_id], profil: profils[s.auteur_cible] })));
  };

  useEffect(() => {
    if (!supabase) { setReady(true); return; }
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/connexion'); return; }
      const { data } = await supabase.from('profiles').select('is_admin').eq('id', user.id).maybeSingle();
      const ok = !!(data && data.is_admin);
      setIsAdmin(ok);
      if (ok) await charger();
      setReady(true);
    })();
  }, [router]);

  const action = async (s, quoi) => {
    setBusy(s.id); setMsg('');
    try {
      if (quoi === 'supprimer' && s.type === 'besoin') {
        await supabase.from('besoins').delete().eq('id', s.cible_id);
      }
      if (quoi === 'supprimer' && s.type === 'commentaire') {
        await supabase.from('commentaires').delete().eq('id', s.cible_id);
      }
      if (quoi === 'bannir' && s.auteur_cible) {
        await supabase.from('profiles').update({ banni: true }).eq('id', s.auteur_cible);
      }
      if (quoi === 'debannir' && s.auteur_cible) {
        await supabase.from('profiles').update({ banni: false }).eq('id', s.auteur_cible);
      }
      const statut = quoi === 'rejeter' ? 'rejete' : 'traite';
      await supabase.from('signalements').update({ statut }).eq('id', s.id);
      await charger();
    } catch (e) {
      setMsg("Action impossible. Vérifiez que vous êtes bien administrateur.");
    }
    setBusy(null);
  };

  if (!supabase) return <main className="sec"><div className="wrap"><div className="card">Configuration Supabase manquante.</div></div></main>;
  if (!ready) return <main className="sec"><div className="wrap"><p className="muted">Chargement…</p></div></main>;
  if (!isAdmin) return <main className="sec"><div className="wrap"><div className="card"><h1>Accès réservé</h1><p className="muted">Cette page est réservée à l’administrateur.</p></div></div></main>;

  return (
    <main className="sec"><div className="wrap" style={{ maxWidth: 720 }}>
      <p className="eyebrow">Admin</p>
      <h1>Modération</h1>
      <p className="muted">Signalements en attente : <strong>{items.length}</strong></p>
      {msg && <div className="card" style={{ color: '#b3261e', marginTop: 12 }}>{msg}</div>}

      {items.length ? items.map((s) => (
        <div key={s.id} className="card" style={{ marginTop: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
            <span className="badge" style={{ color: '#b3261e', background: 'rgba(179,38,30,.1)' }}>
              ⚑ {MOTIF[s.motif] || s.motif}
            </span>
            <span className="muted sm">{TYPE[s.type] || s.type} · {ilya(s.created_at)}</span>
          </div>

          {s.profil && (
            <div className="post-head" style={{ marginTop: 10 }}>
              <Avatar url={s.profil.avatar_url} nom={s.profil.nom} size={38} href={`/profil/${s.auteur_cible}`} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="post-n"><strong>{s.profil.nom || 'Utilisateur'}</strong></div>
                {s.profil.banni && <span className="muted sm" style={{ color: '#b3261e' }}>Compte suspendu</span>}
              </div>
            </div>
          )}

          {s.besoin && (
            <div style={{ marginTop: 10, background: '#f7f3ea', borderRadius: 12, padding: 12 }}>
              <strong>{s.besoin.titre}</strong>
              {s.besoin.description && <p className="muted sm" style={{ margin: '4px 0 0' }}>{s.besoin.description}</p>}
            </div>
          )}
          {s.details && <p className="muted sm" style={{ marginTop: 8 }}>« {s.details} »</p>}

          <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
            {(s.type === 'besoin' || s.type === 'commentaire') && (
              <button className="btn btn-sm" onClick={() => action(s, 'supprimer')} disabled={busy === s.id}
                style={{ background: '#b3261e', color: '#fff' }}>
                Supprimer le contenu
              </button>
            )}
            {s.auteur_cible && !(s.profil && s.profil.banni) && (
              <button className="btn btn-sm" onClick={() => action(s, 'bannir')} disabled={busy === s.id}
                style={{ background: 'transparent', border: '1px solid #b3261e', color: '#b3261e' }}>
                Suspendre le membre
              </button>
            )}
            {s.profil && s.profil.banni && (
              <button className="btn btn-sm" onClick={() => action(s, 'debannir')} disabled={busy === s.id}
                style={{ background: 'transparent', border: '1px solid var(--line)', color: 'var(--text)' }}>
                Réactiver le membre
              </button>
            )}
            <button className="btn btn-sm" onClick={() => action(s, 'rejeter')} disabled={busy === s.id}
              style={{ background: 'transparent', border: '1px solid var(--line)', color: 'var(--text)' }}>
              Ignorer
            </button>
          </div>
        </div>
      )) : (
        <div className="card" style={{ marginTop: 14 }}>
          <p className="muted" style={{ margin: 0 }}>Aucun signalement. Tout va bien 👍</p>
        </div>
      )}

      <p className="muted sm" style={{ marginTop: 22 }}>
        <Link href="/admin-plans">→ Paiements à valider</Link>
      </p>
    </div></main>
  );
}
