'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

// Sur la vitrine : les membres connectés vont directement au fil.
export default function RedirectSiConnecte() {
  const router = useRouter();
  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) router.replace('/fil');
    });
  }, [router]);
  return null;
}
