import { createClient } from '@supabase/supabase-js';
import { estAdmin } from '@/lib/adminGuard';

// Donner (ou retirer) le badge « Vérifié » à un membre — réservé à l'admin.
// La vérification se fait côté SERVEUR : impossible à contourner.
export async function POST(req) {
  const token = (req.headers.get('authorization') || '').replace('Bearer ', '');
  const moi = await estAdmin(token);
  if (!moi) return Response.json({ error: 'Accès refusé.' }, { status: 403 });

  const { userId, verifie } = await req.json();
  if (!userId) return Response.json({ error: 'Utilisateur manquant.' }, { status: 400 });

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  const { error } = await admin.from('profiles')
    .update({ verifie: !!verifie })
    .eq('id', userId);

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ ok: true });
}
