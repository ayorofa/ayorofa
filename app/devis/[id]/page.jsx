'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { metierBySlug } from '@/data/metiers';
import { ilya } from '@/lib/meta';
import Avatar from '@/components/Avatar';
import BadgeVerifie from '@/components/BadgeVerifie';
import BadgesPro from '@/components/BadgesPro';
import MediaView from '@/components/MediaView';

export default function DetailDemande({ params }) {
  const id = params.id;
  const [me, setMe] = useState(null);
  const [d, setD] = useState(null);
  const [devis, setDevis] = useState([]);
  const [monDevis, setMonDevis] = useState(null);
  const [f, setF] = useState({ montant: '', delai: '', message: '' });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const charger = async (uid) => {
    const { data: dd } = await supabase.from('demandes_devis').select('*').eq('id', id).maybeSingle();
    setD(dd);
    if (!dd) return;
    const { data: dv } = await supabase.from('devis').select('*').eq('demande', id)
      .order('montant', { ascending: true });
    const rows = dv || [];
    const ids = [...new Set(rows.map((x) => x.pro))];
    let nm = {};
    if (ids.length) {
      const { data: ps } = await supabase.from('profiles')
        .select('id,nom,avatar_url,verifie,badges,metier_principal,ville').in('id', ids);
      (ps || []).forEach((p) => { nm[p.id] = p; });
    }
    const enrichis = rows.map((x) => ({ ...x, prof: nm[x.pro] || { nom: 'Professionnel' } }));
    setDevis(enrichis);
    setMonDevis(enrichis.find((x) => x.pro === uid) || null);
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
  }, [id]);

  const envoyerDevis = async (e) => {
    e.preventDefault();
    if (!f.montant) return;
    setBusy(true); setMsg('');
    const { error } = await supabase.from('devis').insert({
      demande: id, pro: me, montant: Number(f.montant),
      delai: f.delai.trim() || null, message: f.message.trim() || null,
    });
    setBusy(false);
    if (error) { setMsg(error.message); return; }
    await charger(me);
  };

  const accepter = async (dv) => {
    const avertissement =
      `Accepter le devis de ${dv.prof.nom} à ${Number(dv.montant).toLocaleString('fr-FR')} F ?\n\n` +
      "En acceptant, vous concluez un accord directement avec ce professionnel.\n" +
      "Ayôrôfa Connect n'est pas partie à cet accord et n'intervient ni dans son " +
      "exécution, ni dans le paiement, ni en cas de litige.";
    if (!window.confirm(avertissement)) return;
    setBusy(true);
    await supabase.from('devis').update({ statut: 'accepte' }).eq('id', dv.id);
    await supabase.from('devis').update({ statut: 'refuse' }).eq('demande', id).neq('id', dv.id);
    await supabase.from('demandes_devis').update({ statut: 'attribuee' }).eq('id', id);
    setBusy(false);
    await charger(me);
  };

  if (loading) return <main className="sec"><div className="wrap"><p className="muted">Chargement…</p></div></main>;
  if (!d) return <main className="sec"><div className="wrap"><div className="card">Demande introuvable ou non accessible.</div></div></main>;

  const m = metierBySlug(d.metier);
  const estClient = me === d.client;
  const terminer = async () => {
    if (!window.confirm('Marquer cette prestation comme terminée ?')) return;
    await supabase.from('demandes_devis').update({ statut: 'terminee' }).eq('id', id);
    await charger(me);
  };

  const accepte = devis.find((x) => x.statut === 'accepte');

  return (
    <main className="sec"><div className="wrap" style={{ maxWidth: 680 }}>
      <p className="eyebrow">Demande de devis · {ilya(d.created_at)}</p>
      <h1 style={{ fontSize: '1.4rem' }}>{d.titre}</h1>
      <div className="card" style={{ marginTop: 12 }}>
        <p className="muted sm" style={{ margin: 0 }}>
          {m ? m.name : d.metier}{d.ville ? ` · ${d.ville}` : ''}
          {d.budget ? ` · Budget indicatif : ${Number(d.budget).toLocaleString('fr-FR')} F` : ''}
          {d.delai ? ` · Délai : ${d.delai}` : ''}
        </p>
        {d.description && <p style={{ marginTop: 10 }}>{d.description}</p>}
        <MediaView url={d.media} type={d.media_type} />
      </div>

      {/* ── CÔTÉ PRO : répondre ── */}
      {!estClient && d.statut === 'ouverte' && !monDevis && (
        <form className="card form" onSubmit={envoyerDevis} style={{ marginTop: 16 }}>
          <h2 style={{ margin: 0, fontSize: '1.05rem' }} className="full">Proposer mon devis</h2>
          <label>Montant (F CFA)<input type="number" min="1" required value={f.montant}
            onChange={(e) => setF({ ...f, montant: e.target.value })} placeholder="Ex. 230000" /></label>
          <label>Délai de réalisation<input value={f.delai}
            onChange={(e) => setF({ ...f, delai: e.target.value })} placeholder="Ex. 5 jours" /></label>
          <label className="full">Message<textarea rows={3} value={f.message}
            onChange={(e) => setF({ ...f, message: e.target.value })}
            placeholder="Ce que comprend votre offre, vos références…" /></label>
          {msg && <p className="full" style={{ color: '#b3261e', margin: 0 }}>{msg}</p>}
          <button className="btn full" type="submit" disabled={busy}>{busy ? '…' : 'Envoyer mon devis'}</button>
        </form>
      )}
      {!estClient && monDevis && (
        <div className="card" style={{ marginTop: 16, borderColor: monDevis.statut === 'accepte' ? '#1A6B50' : undefined }}>
          <p style={{ margin: 0 }}>
            <strong>Votre devis :</strong> {Number(monDevis.montant).toLocaleString('fr-FR')} F
            {monDevis.delai ? ` · ${monDevis.delai}` : ''} — {' '}
            {monDevis.statut === 'accepte' ? <strong style={{ color: '#1A6B50' }}>✅ Accepté ! Contactez le client.</strong> :
             monDevis.statut === 'refuse' ? <span className="muted">non retenu</span> : 'en attente de réponse'}
          </p>
          {monDevis.statut === 'accepte' &&
            <a className="btn btn-sm" href={`/messages?to=${d.client}`} style={{ marginTop: 10 }}>💬 Contacter le client</a>}
        </div>
      )}

      {/* ── CÔTÉ CLIENT : comparer et accepter ── */}
      {estClient && (
        <div style={{ marginTop: 20 }}>
          <h2 style={{ fontSize: '1.1rem' }}>Devis reçus ({devis.length}) {devis.length > 1 && '— du moins cher au plus cher'}</h2>
          {devis.length ? devis.map((dv) => (
            <div key={dv.id} className="card" style={{ marginTop: 10,
              borderColor: dv.statut === 'accepte' ? '#1A6B50' : undefined,
              opacity: dv.statut === 'refuse' ? 0.55 : 1 }}>
              <div style={{ display: 'flex', gap: 11, alignItems: 'center' }}>
                <Avatar url={dv.prof.avatar_url} nom={dv.prof.nom} size={42} href={`/profil/${dv.pro}`} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="post-n">
                    <Link href={`/profil/${dv.pro}`}><strong>{dv.prof.nom}</strong></Link>
                    {dv.prof.verifie && <BadgeVerifie size="sm" />}
                    <BadgesPro badges={dv.prof.badges} mini />
                  </div>
                  <p className="muted sm" style={{ margin: 0 }}>
                    {dv.prof.metier_principal ? (metierBySlug(dv.prof.metier_principal)?.name || '') : ''}
                    {dv.prof.ville ? ` · ${dv.prof.ville}` : ''} · {ilya(dv.created_at)}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'Georgia,serif', fontWeight: 700, fontSize: '1.15rem' }}>
                    {Number(dv.montant).toLocaleString('fr-FR')} F</div>
                  {dv.delai && <div className="muted sm">{dv.delai}</div>}
                </div>
              </div>
              {dv.message && <p style={{ margin: '10px 0 0', fontSize: '.93rem' }}>{dv.message}</p>}
              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                {dv.statut === 'accepte' ? (
                  <>
                    <span className="badge" style={{ color: '#1A6B50', background: '#1A6B501a' }}>✅ Devis accepté</span>
                    <a className="btn btn-sm" href={`/messages?to=${dv.pro}`}>💬 Organiser la prestation</a>
                  </>
                ) : d.statut === 'ouverte' ? (
                  <>
                    <button className="btn btn-sm" onClick={() => accepter(dv)} disabled={busy}>✓ Accepter ce devis</button>
                    <a className="btn btn-sm btn-ghost" href={`/messages?to=${dv.pro}`}>Question au pro</a>
                  </>
                ) : null}
              </div>
            </div>
          )) : <p className="muted" style={{ marginTop: 10 }}>Aucun devis pour l’instant — les professionnels du métier « {m ? m.name : d.metier} » voient votre demande.</p>}

          {accepte && (
            <div className="card" style={{ marginTop: 14, background: '#F6FBF7' }}>
              <p style={{ margin: 0, fontSize: '.93rem' }}>
                <strong>Et maintenant ?</strong> Convenez des détails et du paiement (Mobile Money) directement avec {accepte.prof.nom}.
                Une fois la prestation terminée, <Link href={`/profil/${accepte.pro}`}><strong>laissez-lui un avis ★</strong></Link> —
                c’est ce qui fait vivre la confiance sur Ayôrôfa Connect.
              </p>
              <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                {d.statut === 'attribuee' && (
                  <button className="btn btn-sm btn-ghost" onClick={terminer} type="button">✓ Prestation terminée</button>
                )}
                {d.statut === 'terminee' && (
                  <Link className="btn btn-sm" href={`/profil/${accepte.pro}`}>🎉 ★ Laisser un avis à {accepte.prof.nom}</Link>
                )}
              </div>
            </div>
          )}
        </div>
      )}
<p className="mention-legale">
        Ayôrôfa Connect met en relation les membres. Les accords, prestations et paiements se
        concluent directement entre le client et le professionnel : la plateforme n’y est pas
        partie, n’encaisse aucune somme au titre des prestations et n’intervient pas en cas de
        litige. Le badge <strong>Vérifié</strong> atteste de contrôles effectués à la date de son
        attribution et ne garantit ni la qualité ni la bonne exécution des travaux.{' '}
        <Link href="/cgu">Conditions générales</Link>.
      </p>
    </div></main>
  );
}
