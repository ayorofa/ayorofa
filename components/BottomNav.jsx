'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

const Icon = ({ d, filled }) => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill={filled ? 'currentColor' : 'none'}
       stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);
const P = {
  home: 'M3 10.5 12 3l9 7.5M5.5 9.5V20h13V9.5',
  feed: 'M17 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8',
  plus: 'M12 5v14M5 12h14',
  chat: 'M21 12a8 8 0 0 1-11.6 7.1L3 21l1.9-6.4A8 8 0 1 1 21 12z',
  user: 'M20 21a8 8 0 1 0-16 0M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
};

export default function BottomNav() {
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
        ch = supabase.channel('bn-msgs')
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
      .eq('destinataire', uid).eq('lu', false)
      .then(({ count }) => setUnread(count || 0));
  }, [pathname, uid]);

  const on = (href) => pathname === href || (href !== '/' && pathname.startsWith(href));
  const items = [
    { href: '/', label: 'Accueil', d: P.home },
    { href: '/membres', label: 'Membres', d: P.feed },
    { href: '/publier', label: 'Publier', d: P.plus, cta: true },
    { href: '/messages', label: 'Messages', d: P.chat, badge: unread },
    { href: uid ? '/espace' : '/connexion', label: uid ? 'Espace' : 'Connexion', d: P.user },
  ];

  return (
    <nav className="bnav" aria-label="Navigation principale">
      {items.map((it) => (
        <Link key={it.href} href={it.href} className={'bnav-i' + (on(it.href) ? ' on' : '') + (it.cta ? ' cta' : '')}>
          <span className="bnav-ic">
            <Icon d={it.d} filled={on(it.href) && !it.cta} />
            {it.badge > 0 && <span className="bnav-b">{it.badge > 9 ? '9+' : it.badge}</span>}
          </span>
          <span className="bnav-l">{it.label}</span>
        </Link>
      ))}
    </nav>
  );
}
