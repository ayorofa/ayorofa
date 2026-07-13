// Vérifie qu'un utilisateur est bien admin — CÔTÉ SERVEUR.
// À utiliser dans les routes API : le navigateur ne peut pas mentir.
import { createClient } from '@supabase/supabase-js';

export async function estAdmin(token) {
  if (!token) return null;
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  const { data: { user }, error } = await admin.auth.getUser(token);
  if (error || !user) return null;
  const { data } = await admin.from('profiles').select('is_admin').eq('id', user.id).maybeSingle();
  if (!data || !data.is_admin) return null;
  return user;
}
