'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import Avatar from '@/components/Avatar';
import { ilya } from '@/lib/meta';

const TEXTE = {
  connexion_demande: 'souhaite rejoindre votre réseau',
  connexion_acceptee: 'a accepté votre demande — vous êtes connectés 🎉',
  reaction: 'a réagi à votre annonce 👍',
  commentaire: 'a commenté votre annonce 💬',
  reponse: 'a répondu à votre commentaire ↩️',
  devis_demande: 'vous a adressé une demande de devis 📋',
  devis_recu: 'vous a envoyé un devis 💰',
  devis_accepte: 'a accepté votre devis 🎉',
  abonnement: 's’est abonné à votre profil',
  interet: 'est intéressé par votre annonce',
};

export default function Notifications() {
  const router = useRouter();
  const [me, setMe] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(null);

  const charger = async (uid) => {
    const { data } = await supabase.from('notifications').select('*')
      .eq('destinataire', uid).order('created_at', { ascending: false }).limit(50);
    const notifs = data || [];
    const ids = [...new Set(notifs.map((n) => n.emetteur).filter(Boolean))];
    let profs = {};
    if (ids.length) {
      const { data: ps } = await supabase.from('profiles').select('id,nom,avatar_url').in('id', ids);
      (ps || []).forEach((p) => { profs[p.id] = p; });
    }
    // demandes de connexion encore en attente ?
    const { data: cx } = await supabase.from('connexions').select('id,demandeur,statut')
      .eq('destinataire', uid).eq('statut', 'en_attente');
    const attente = {};
    (cx || []).forEach((c) => { attente[c.demandeur] = c.id; });
    setItems(notifs.map((n) => ({
      ...n,
      prof: profs[n.emetteur] || { nom: 'Un membre' },
      connexionId: n.type === 'connexion_demande' ? attente[n.emetteur] : null,
    })));
  };

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/connexion'); return; }
      setMe(user.id);
      await charger(user.id);
      setLoading(false);
      // tout marquer comme lu
      await supabase.from('notifications').update({ lu: true })
        .eq('destinataire', user.id).eq('lu', false);
    })();
  }, [router]);

  const repondre = async (n, statut) => {
    setBusy(n.id);
    await supabase.from('connexions').update({ statut }).eq('id', n.connexionId);
    await charger(me);
    setBusy(null);
  };

  if (!supabase) return <main className="sec"><div className="wrap"><div className="card">Configuration Supabase manquante.</div></div></main>;
  if (loading) return <main className="sec"><div className="wrap"><p className="muted">Chargement…</p></div></main>;

  return (
    <main className="sec"><div className="wrap" style={{ maxWidth: 640 }}>
      <p className="eyebrow">Activité</p>
      <h1>Notifications</h1>

      {items.length ? (
        <div style={{ display: 'grid', gap: 10, marginTop: 16 }}>
          {items.map((n) => (
            <div key={n.id} className={'card notif' + (!n.lu ? ' notif-new' : '')}>
              <Avatar url={n.prof.avatar_url} nom={n.prof.nom} size={44}
                href={n.emetteur ? `/profil/${n.emetteur}` : undefined} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0 }}>
                  {n.emetteur
                    ? <Link href={`/profil/${n.emetteur}`}><strong>{n.prof.nom}</strong></Link>
                    : <strong>{n.prof.nom}</strong>}{' '}
                  {TEXTE[n.type] || 'a interagi avec vous'}
                </p>
                <p className="muted sm" style={{ margin: '3px 0 0' }}>{ilya(n.created_at)}</p>

                {n.type === 'connexion_demande' && n.connexionId && (
                  <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                    <button className="btn btn-sm" onClick={() => repondre(n, 'acceptee')} disabled={busy === n.id}>
                      Accepter
                    </button>
                    <button className="btn btn-sm btn-ghost" onClick={() => repondre(n, 'refusee')} disabled={busy === n.id}>
                      Refuser
                    </button>
                  </div>
                )}
                {(n.type === 'reaction' || n.type === 'commentaire' || n.type === 'interet') && n.besoin && (
                  <Link href="/" className="muted sm" style={{ display: 'inline-block', marginTop: 6, textDecoration: 'underline' }}>
                    Voir l’annonce
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card vide" style={{ marginTop: 16 }}>
          <div className="vide-ic" aria-hidden="true">🔔</div>
          <h3>Aucune notification</h3>
          <p className="muted">Connectez-vous à des membres et publiez pour faire vivre votre réseau.</p>
          <Link href="/membres" className="btn">Découvrir des membres</Link>
        </div>
      )}
    </div></main>
  );
}
