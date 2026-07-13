'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

// Icône Messages (en-tête) avec badge des non-lus — visible sur mobile et desktop.
export default function IconMessages() {
  const pathname = usePathname();
  const [uid, setUid] = useState(null);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!supabase) return;
    let ch;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUid(user ? user.id : null);
      if (user) {
        const { count } = await supabase.from('messages')
          .select('id', { count: 'exact', head: true })
          .eq('destinataire', user.id).eq('lu', false);
        setUnread(count || 0);
        ch = supabase.channel('hdr-msgs')
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

  if (!uid) return null;
  return (
    <Link href="/messages" className="hdr-msg" aria-label="Messages">
      <svg viewBox="0 0 24 24" width="23" height="23" fill="none" stroke="currentColor"
        strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 12a8 8 0 0 1-11.6 7.1L3 21l1.9-6.4A8 8 0 1 1 21 12z" />
      </svg>
      {unread > 0 && <span className="bnav-b">{unread > 9 ? '9+' : unread}</span>}
    </Link>
  );
}
