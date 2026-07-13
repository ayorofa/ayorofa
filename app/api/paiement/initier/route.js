import { createClient } from '@supabase/supabase-js';

// Crée la transaction et renvoie l'URL de paiement CinetPay.
export async function POST(req) {
  try {
    const { plan, montant, userId, nom, telephone } = await req.json();

    const API_KEY = process.env.CINETPAY_API_KEY;
    const SITE_ID = process.env.CINETPAY_SITE_ID;
    const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://connect.ayorofa.com';

    if (!API_KEY || !SITE_ID) {
      return Response.json({ error: 'Paiement automatique non configuré.' }, { status: 503 });
    }
    if (!userId || !plan || !montant) {
      return Response.json({ error: 'Requête incomplète.' }, { status: 400 });
    }

    // Référence unique de la transaction
    const transaction_id = `AYO-${plan}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    // On enregistre la transaction (serveur, clé secrète)
    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    const { error: dbErr } = await admin.from('paiements').insert({
      transaction_id, utilisateur: userId, plan, montant, statut: 'en_attente',
    });
    if (dbErr) return Response.json({ error: dbErr.message }, { status: 500 });

    // Demande de paiement à CinetPay
    const res = await fetch('https://api-checkout.cinetpay.com/v2/payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apikey: API_KEY,
        site_id: SITE_ID,
        transaction_id,
        amount: montant,
        currency: 'XOF',
        description: `Ayôrôfa Connect — plan ${plan}`,
        channels: 'MOBILE_MONEY',
        customer_name: nom || 'Membre',
        customer_phone_number: telephone || '',
        return_url: `${SITE}/abonnements/retour?transaction_id=${transaction_id}`,
        notify_url: `${SITE}/api/paiement/notifier`,
      }),
    });
    const data = await res.json();

    if (data?.code === '201' && data?.data?.payment_url) {
      return Response.json({ payment_url: data.data.payment_url, transaction_id });
    }
    return Response.json({ error: data?.description || 'Paiement indisponible.' }, { status: 502 });
  } catch (e) {
    return Response.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}
