'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import Avatar from '@/components/Avatar';

export default function UserNav() {
  const pathname = usePathname();
  const [uid, setUid] = useState(null);
  const [profil, setProfil] = useState(null);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!supabase) return;
    let ch;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUid(user ? user.id : null);
      if (user) {
        const { data } = await supabase.from('profiles').select('nom,avatar_url').eq('id', user.id).maybeSingle();
        setProfil(data || null);
        const { count } = await supabase.from('messages')
          .select('id', { count: 'exact', head: true })
          .eq('destinataire', user.id).eq('lu', false);
        setUnread(count || 0);
        ch = supabase.channel('nav-msgs')
          .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `destinataire=eq.${user.id}` },
            () => setUnread((c) => c + 1))
          .subscribe();
      }
    })();
    return () => { if (ch) supabase.removeChannel(ch); };
  }, []);

  useEffect(() => {
    if (!supabase || !uid) return;
    supabase.from('messages').select('id', { count: 'exact', head: true })
      .eq('destinataire', uid).eq('lu', false).then(({ count }) => setUnread(count || 0));
  }, [pathname, uid]);

  if (!supabase) return <Link href="/espace">Mon espace</Link>;
  if (!uid) return <Link href="/connexion">Connexion</Link>;

  return (
    <>
      <Link href="/messages" style={{ position: 'relative' }}>
        Messages{unread > 0 && <span className="dot">{unread}</span>}
      </Link>
      <Link href="/espace" className="nav-me" aria-label="Mon espace">
        <Avatar url={profil && profil.avatar_url} nom={profil && profil.nom} size={30} />
      </Link>
    </>
  );
}
