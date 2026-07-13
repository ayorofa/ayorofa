import { createClient } from '@supabase/supabase-js';

// CinetPay appelle cette route après le paiement.
// On VÉRIFIE le paiement auprès de CinetPay, puis on active le plan + le badge.
export async function POST(req) {
  try {
    const form = await req.formData().catch(() => null);
    const body = form ? Object.fromEntries(form) : await req.json().catch(() => ({}));
    const transaction_id = body.cpm_trans_id || body.transaction_id;
    if (!transaction_id) return new Response('missing id', { status: 400 });

    const API_KEY = process.env.CINETPAY_API_KEY;
    const SITE_ID = process.env.CINETPAY_SITE_ID;

    // 1) On demande à CinetPay le vrai statut (on ne fait jamais confiance au navigateur)
    const check = await fetch('https://api-checkout.cinetpay.com/v2/payment/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apikey: API_KEY, site_id: SITE_ID, transaction_id }),
    });
    const res = await check.json();
    const paye = res?.code === '00' && res?.data?.status === 'ACCEPTED';

    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data: tx } = await admin.from('paiements')
      .select('*').eq('transaction_id', transaction_id).maybeSingle();
    if (!tx) return new Response('unknown', { status: 404 });
    if (tx.statut === 'paye') return new Response('ok', { status: 200 }); // déjà traité

    if (!paye) {
      await admin.from('paiements').update({ statut: 'echoue' }).eq('transaction_id', transaction_id);
      return new Response('ok', { status: 200 });
    }

    // 2) Paiement confirmé -> on active le plan
    const expire = new Date();
    expire.setMonth(expire.getMonth() + 1);
    const maj = { plan: tx.plan, plan_expire: expire.toISOString() };
    if (tx.plan === 'verifie') maj.verifie = true;   // ← BADGE ACTIVÉ AUTOMATIQUEMENT

    await admin.from('profiles').update(maj).eq('id', tx.utilisateur);
    await admin.from('paiements').update({
      statut: 'paye',
      paye_at: new Date().toISOString(),
      operateur: res?.data?.payment_method || null,
    }).eq('transaction_id', transaction_id);

    return new Response('ok', { status: 200 });
  } catch (e) {
    return new Response('error', { status: 500 });
  }
}

export async function GET() { return new Response('ok'); }
