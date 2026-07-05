'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function ModifierProfil() {
  const router = useRouter();
  const [me, setMe] = useState(null);
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/connexion'); return; }
      setMe(user.id);
      const { data } = await supabase.from('profiles').select('bio,avatar_url').eq('id', user.id).maybeSingle();
      setBio(data?.bio || ''); setAvatar(data?.avatar_url || ''); setLoading(false);
    })();
  }, [router]);

  const upload = async (e) => {
    const file = e.target.files?.[0]; if (!file || !me) return;
    setBusy(true); setMsg('');
    const path = `${me}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '')}`;
    const { error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true });
    if (error) { setMsg(error.message); setBusy(false); return; }
    const { data } = supabase.storage.from('avatars').getPublicUrl(path);
    setAvatar(data.publicUrl); setBusy(false);
  };
  const save = async () => {
    setBusy(true); setMsg('');
    const { error } = await supabase.from('profiles').update({ bio, avatar_url: avatar }).eq('id', me);
    setBusy(false);
    if (error) { setMsg(error.message); return; }
    router.push(`/profil/${me}`);
  };

  if (!supabase) return <main className="sec"><div className="wrap"><div className="card">Configuration Supabase manquante.</div></div></main>;
  if (loading) return <main className="sec"><div className="wrap"><p className="muted">Chargement…</p></div></main>;
  return (
    <main className="sec"><div className="wrap" style={{ maxWidth: 560 }}>
      <p className="eyebrow">Mon profil</p><h1>Modifier mon profil</h1>
      <div className="card">
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          {avatar ? <img src={avatar} alt="" style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover' }} />
            : <div className="pro-avatar" style={{ width: 72, height: 72 }}>?</div>}
          <label className="btn btn-sm" style={{ cursor: 'pointer' }}>
            {busy ? '…' : 'Changer la photo'}
            <input type="file" accept="image/*" onChange={upload} style={{ display: 'none' }} />
          </label>
        </div>
        <label style={{ display: 'block', marginTop: 16, fontWeight: 600, fontSize: '.9rem' }}>Bio / présentation
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} placeholder="Présentez votre activité, votre expérience…" style={{ width: '100%', marginTop: 6, padding: 10, border: '1px solid var(--line)', borderRadius: 9, fontFamily: 'inherit' }} />
        </label>
        {msg && <div style={{ color: '#b3261e', marginTop: 8 }}>{msg}</div>}
        <button className="btn" onClick={save} disabled={busy} style={{ marginTop: 14 }}>{busy ? '…' : 'Enregistrer'}</button>
      </div>
    </div></main>
  );
}
