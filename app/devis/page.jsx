'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { ilya } from '@/lib/meta';
import { metierBySlug } from '@/data/metiers';

const STATUT = {
  ouverte: { l: 'Ouverte', c: '#2e7d5b' }, attribuee: { l: 'Attribuée', c: '#a9863a' },
  terminee: { l: 'Terminée', c: '#24557a' }, annulee: { l: 'Annulée', c: '#8d8371' },
};

export default function Devis() {
  const [me, setMe] = useState(null);
  const [onglet, setOnglet] = useState('mes');
  const [mes, setMes] = useState([]);
  const [ouvertes, setOuvertes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = '/connexion'; return; }
      setMe(user.id);
      const [{ data: m }, { data: o }] = await Promise.all([
        supabase.from('demandes_devis').select('*').eq('client', user.id).order('created_at', { ascending: false }),
        supabase.from('demandes_devis').select('*').eq('statut', 'ouverte').neq('client', user.id)
          .or(`pro.is.null,pro.eq.${user.id}`).order('created_at', { ascending: false }).limit(30),
      ]);
      setMes(m || []); setOuvertes(o || []);
      setLoading(false);
    })();
  }, []);

  const Ligne = ({ d }) => {
    const s = STATUT[d.statut] || STATUT.ouverte;
    return (
      <Link href={`/devis/${d.id}`} className="card devis-ligne">
        <div style={{ flex: 1, minWidth: 0 }}>
          <strong>{d.titre}</strong>
          <p className="muted sm" style={{ margin: '3px 0 0' }}>
            {d.metier ? (metierBySlug(d.metier)?.name || d.metier) + ' · ' : ''}
            {d.lieu || 'Côte d’Ivoire'} · {ilya(d.created_at)}
            {d.budget ? ` · Budget : ${Number(d.budget).toLocaleString('fr-FR')} F` : ''}
            {d.pro ? ' · 🎯 ciblée' : ''}
          </p>
        </div>
        <span className="badge" style={{ color: s.c, background: s.c + '1a' }}>{s.l}</span>
      </Link>
    );
  };

  return (
    <main className="sec"><div className="wrap" style={{ maxWidth: 720 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <div style={{ marginRight: 'auto' }}>
          <p className="eyebrow">Devis</p>
          <h1 style={{ margin: 0 }}>Demandes de devis</h1>
        </div>
        <Link className="btn" href="/devis/nouvelle">＋ Demander un devis</Link>
      </div>

      <div className="onglets" style={{ marginTop: 14 }}>
        <button className={'onglet' + (onglet === 'mes' ? ' on' : '')} onClick={() => setOnglet('mes')}>
          Mes demandes {mes.length > 0 && <span className="onglet-n">{mes.length}</span>}
        </button>
        <button className={'onglet' + (onglet === 'pro' ? ' on' : '')} onClick={() => setOnglet('pro')}>
          À traiter (pros) {ouvertes.length > 0 && <span className="onglet-n">{ouvertes.length}</span>}
        </button>
      </div>

      {loading ? <p className="muted" style={{ marginTop: 16 }}>Chargement…</p> : (
        <div style={{ display: 'grid', gap: 10, marginTop: 14 }}>
          {(onglet === 'mes' ? mes : ouvertes).map((d) => <Ligne key={d.id} d={d} />)}
          {(onglet === 'mes' ? mes : ouvertes).length === 0 && (
            <div className="card">
              <p className="muted" style={{ margin: 0 }}>
                {onglet === 'mes'
                  ? 'Aucune demande pour l’instant. Décrivez votre besoin et recevez plusieurs devis à comparer.'
                  : 'Aucune demande à traiter pour le moment. Revenez bientôt — ou complétez votre profil pro pour être choisi en direct !'}
              </p>
              {onglet === 'mes' && <Link className="btn btn-sm" href="/devis/nouvelle" style={{ marginTop: 10 }}>Demander un devis</Link>}
            </div>
          )}
        </div>
      )}
    </div></main>
  );
}
