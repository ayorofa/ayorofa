'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { uploadMedia } from '@/lib/media';

export default function Portfolio({ proprietaire, me }) {
  const [items, setItems] = useState([]);
  const [envoi, setEnvoi] = useState(false);

  const charger = async () => {
    const { data } = await supabase.from('portfolio').select('*')
      .eq('proprietaire', proprietaire).order('created_at', { ascending: false });
    setItems(data || []);
  };
  useEffect(() => { if (supabase && proprietaire) charger(); }, [proprietaire]);

  const ajouter = async (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!file) return;
    setEnvoi(true);
    try {
      const up = await uploadMedia(supabase, file, me);
      const { error } = await supabase.from('portfolio')
        .insert({ proprietaire: me, media: up.url, media_type: up.type });
      if (error) throw new Error(error.message);
      await charger();
    } catch (err) { alert(err.message); }
    setEnvoi(false);
  };
  const supprimer = async (it) => {
    if (!window.confirm('Retirer cet élément du portfolio ?')) return;
    await supabase.from('portfolio').delete().eq('id', it.id);
    await charger();
  };

  const estMoi = me === proprietaire;
  if (!items.length && !estMoi) return null;

  return (
    <div className="card" style={{ marginTop: 14 }}>
      <h2 className="profil-h2">Portfolio</h2>
      <div className="pf-grid">
        {items.map((it) => (
          <div key={it.id} className="pf-item">
            {it.media_type === 'video'
              ? <video src={it.media} controls playsInline preload="metadata" />
              : <a href={it.media} target="_blank" rel="noopener"><img src={it.media} alt="Réalisation" loading="lazy" /></a>}
            {estMoi && <button className="pf-x" aria-label="Retirer" onClick={() => supprimer(it)}>✕</button>}
          </div>
        ))}
        {estMoi && items.length < 12 && (
          <label className="pf-add" aria-label="Ajouter une réalisation">
            {envoi ? '…' : '＋'}
            <input type="file" accept="image/*,video/*" onChange={ajouter} style={{ display: 'none' }} />
          </label>
        )}
      </div>
      {estMoi && items.length === 0 && (
        <p className="muted sm" style={{ marginTop: 10 }}>
          Ajoutez des photos et vidéos de vos réalisations : c’est ce que les clients regardent en premier. (12 max)
        </p>
      )}
    </div>
  );
}
