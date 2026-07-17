import { createClient } from '@supabase/supabase-js';
import { estAdmin } from '@/lib/adminGuard';

export async function POST(req) {
  const token = (req.headers.get('authorization') || '').replace('Bearer ', '');
  const moi = await estAdmin(token);
  if (!moi) return Response.json({ error: 'Accès refusé.' }, { status: 403 });

  const { demande_id, action } = await req.json();
  const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  const { data: d } = await admin.from('demandes_boost').select('*').eq('id', demande_id).maybeSingle();
  if (!d) return Response.json({ error: 'Demande introuvable.' }, { status: 404 });

  if (action === 'refuser') {
    await admin.from('demandes_boost').update({ statut: 'refuse' }).eq('id', demande_id);
    return Response.json({ ok: true });
  }
  const fin = new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString();
  const { error } = await admin.from('besoins').update({ boost_jusqua: fin }).eq('id', d.besoin);
  if (error) return Response.json({ error: error.message }, { status: 500 });
  await admin.from('demandes_boost').update({ statut: 'valide' }).eq('id', demande_id);
  return Response.json({ ok: true, fin });
}
