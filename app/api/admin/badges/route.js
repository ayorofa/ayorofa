import { createClient } from '@supabase/supabase-js';
import { estAdmin } from '@/lib/adminGuard';

// Attribuer les badges pro (🏆⭐💎👑) — réservé à l'admin, côté serveur.
const VALIDES = ['expert', 'top', 'premium', 'partenaire'];

export async function POST(req) {
  const token = (req.headers.get('authorization') || '').replace('Bearer ', '');
  const moi = await estAdmin(token);
  if (!moi) return Response.json({ error: 'Accès refusé.' }, { status: 403 });

  const { email, badges } = await req.json();
  if (!email) return Response.json({ error: 'Email manquant.' }, { status: 400 });
  const propres = (badges || []).filter((b) => VALIDES.includes(b));

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  const { data: users, error: e1 } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (e1) return Response.json({ error: e1.message }, { status: 500 });
  const cible = (users?.users || []).find((u) => (u.email || '').toLowerCase() === email.toLowerCase());
  if (!cible) return Response.json({ error: 'Aucun membre avec cet email.' }, { status: 404 });

  const { error } = await admin.from('profiles').update({ badges: propres }).eq('id', cible.id);
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ ok: true, badges: propres });
}
