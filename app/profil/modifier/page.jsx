'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { METIERS } from '@/data/metiers';
import { VILLES } from '@/data/villes';

const LANGUES = ['Français', 'Anglais', 'Dioula', 'Baoulé', 'Bété', 'Sénoufo', 'Yacouba', 'Agni', 'Autre'];
const PAIEMENTS = ['Wave', 'Orange Money', 'MTN Money', 'Moov Money', 'Espèces', 'Virement bancaire'];
const DISPOS = ['Disponible', 'Disponible sous conditions', 'Occupé actuellement'];

export default function ModifierProfil() {
  const router = useRouter();
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [f, setF] = useState({
    nom: '', bio: '', entreprise: '', experience_annees: '', metier_principal: '',
    competences: '', diplomes: '', langues: [], horaires: '', disponibilite: '',
    zone: '', ville: '', telephone: '', whatsapp: '', site: '', facebook: '', tiktok: '',
    moyens_paiement: [],
  });

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/connexion'); return; }
      setMe(user.id);
      const { data: p } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
      if (p) {
        setF({
          nom: p.nom || '', bio: p.bio || '', entreprise: p.entreprise || '',
          experience_annees: p.experience_annees || '', metier_principal: p.metier_principal || '',
          competences: (p.competences || []).join(', '),
          diplomes: (p.diplomes || []).join('\n'),
          langues: p.langues || [], horaires: p.horaires || '',
          disponibilite: p.disponibilite || '', zone: p.zone || '', ville: p.ville || '',
          telephone: p.telephone || '', whatsapp: p.whatsapp || '', site: p.site || '',
          facebook: p.facebook || '', tiktok: p.tiktok || '',
          moyens_paiement: p.moyens_paiement || [],
        });
      }
      setLoading(false);
    })();
  }, [router]);

  const on = (e) => setF({ ...f, [e.target.name]: e.target.value });
  const toggle = (champ, val) => {
    const arr = f[champ].includes(val) ? f[champ].filter((x) => x !== val) : [...f[champ], val];
    setF({ ...f, [champ]: arr });
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true); setMsg('');
    const maj = {
      nom: f.nom.trim() || null,
      bio: f.bio.trim() || null,
      entreprise: f.entreprise.trim() || null,
      experience_annees: f.experience_annees ? Number(f.experience_annees) : null,
      metier_principal: f.metier_principal || null,
      competences: f.competences.split(',').map((x) => x.trim()).filter(Boolean).slice(0, 15),
      diplomes: f.diplomes.split('\n').map((x) => x.trim()).filter(Boolean).slice(0, 10),
      langues: f.langues,
      horaires: f.horaires.trim() || null,
      disponibilite: f.disponibilite || null,
      zone: f.zone.trim() || null,
      ville: f.ville || null,
      telephone: f.telephone.trim() || null,
      whatsapp: f.whatsapp.trim() || null,
      site: f.site.trim() || null,
      facebook: f.facebook.trim() || null,
      tiktok: f.tiktok.trim() || null,
      moyens_paiement: f.moyens_paiement,
    };
    const { error } = await supabase.from('profiles').update(maj).eq('id', me);
    setSaving(false);
    if (error) { setMsg(error.message); return; }
    router.push(`/profil/${me}`);
  };

  if (!supabase) return <main className="sec"><div className="wrap"><div className="card">Configuration manquante.</div></div></main>;
  if (loading) return <main className="sec"><div className="wrap"><p className="muted">Chargement…</p></div></main>;

  return (
    <main className="sec"><div className="wrap" style={{ maxWidth: 720 }}>
      <p className="eyebrow">Mon profil professionnel</p>
      <h1>Complétez votre vitrine</h1>
      <p className="muted" style={{ marginTop: 6 }}>
        Plus votre profil est complet, plus vous inspirez confiance — et plus vous recevez de demandes.
      </p>

      <form className="card form" onSubmit={save} style={{ marginTop: 16 }}>
        <label className="full">Nom ou nom d’entreprise
          <input name="nom" value={f.nom} onChange={on} required /></label>
        <label className="full">Présentation
          <textarea name="bio" value={f.bio} onChange={on} rows={3}
            placeholder="Qui êtes-vous ? Que faites-vous de mieux ?" /></label>

        <label>Métier principal
          <select name="metier_principal" value={f.metier_principal} onChange={on}>
            <option value="">Choisir…</option>
            {METIERS.map((m) => <option key={m.slug} value={m.slug}>{m.name}</option>)}
          </select></label>
        <label>Années d’expérience
          <input name="experience_annees" value={f.experience_annees} onChange={on} type="number" min="0" max="60" placeholder="Ex. 8" /></label>

        <label>Entreprise (si différente)
          <input name="entreprise" value={f.entreprise} onChange={on} placeholder="Ex. SafEchaf" /></label>
        <label>Ville
          <select name="ville" value={f.ville} onChange={on}>
            <option value="">Choisir…</option>
            {VILLES.map((v) => <option key={v} value={v}>{v}</option>)}
          </select></label>

        <label className="full">Compétences <span className="muted sm">(séparées par des virgules, 15 max)</span>
          <input name="competences" value={f.competences} onChange={on}
            placeholder="Ex. dalle béton, enduit, carrelage grand format, lecture de plans" /></label>

        <label className="full">Diplômes & certifications <span className="muted sm">(un par ligne)</span>
          <textarea name="diplomes" value={f.diplomes} onChange={on} rows={3}
            placeholder={'CAP Maçonnerie — INFPA\nHabilitation travail en hauteur'} /></label>

        <div className="full">
          <span style={{ fontWeight: 600, fontSize: '.9rem' }}>Langues parlées</span>
          <div className="chips" style={{ marginTop: 8 }}>
            {LANGUES.map((l) => (
              <button key={l} type="button" className={'chip' + (f.langues.includes(l) ? ' on' : '')}
                onClick={() => toggle('langues', l)}>{l}</button>
            ))}
          </div>
        </div>

        <label>Disponibilité
          <select name="disponibilite" value={f.disponibilite} onChange={on}>
            <option value="">—</option>
            {DISPOS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select></label>
        <label>Horaires
          <input name="horaires" value={f.horaires} onChange={on} placeholder="Ex. Lun–Sam, 7h30 – 18h" /></label>

        <label className="full">Zone d’intervention
          <input name="zone" value={f.zone} onChange={on}
            placeholder="Ex. Koumassi, Marcory, Port-Bouët — déplacement possible tout Abidjan" /></label>

        <div className="full">
          <span style={{ fontWeight: 600, fontSize: '.9rem' }}>Moyens de paiement acceptés</span>
          <div className="chips" style={{ marginTop: 8 }}>
            {PAIEMENTS.map((m) => (
              <button key={m} type="button" className={'chip' + (f.moyens_paiement.includes(m) ? ' on' : '')}
                onClick={() => toggle('moyens_paiement', m)}>{m}</button>
            ))}
          </div>
        </div>

        <label>Téléphone <span className="muted sm">(affiché sur le profil)</span>
          <input name="telephone" value={f.telephone} onChange={on} placeholder="+225 …" /></label>
        <label>WhatsApp
          <input name="whatsapp" value={f.whatsapp} onChange={on} placeholder="+225 …" /></label>
        <label>Site web
          <input name="site" value={f.site} onChange={on} placeholder="monsite.com" /></label>
        <label>Facebook
          <input name="facebook" value={f.facebook} onChange={on} placeholder="facebook.com/…" /></label>
        <label>TikTok
          <input name="tiktok" value={f.tiktok} onChange={on} placeholder="@…" /></label>

        {msg && <div className="full" style={{ color: '#b3261e' }}>{msg}</div>}
        <div className="full" style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button className="btn" type="submit" disabled={saving}>{saving ? 'Enregistrement…' : 'Enregistrer mon profil'}</button>
          {me && <Link className="btn btn-ghost" href={`/profil/${me}`}>Annuler</Link>}
        </div>
        <p className="muted sm full" style={{ margin: 0 }}>
          Photo de profil, centres d’intérêt et e-mail se gèrent dans <Link href="/espace"><strong>Mon espace</strong></Link>.
          La bannière se change directement sur votre profil (📷 Couverture).
        </p>
      </form>
    </div></main>
  );
}
