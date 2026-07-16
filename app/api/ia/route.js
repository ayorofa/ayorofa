import { createClient } from '@supabase/supabase-js';

// Assistant Ayôrôfa — clé côté serveur, quota journalier, et intelligence "maison"
// (recommandations + estimation sur devis réels) qui fonctionne MÊME SANS clé IA.
const LIMITE_JOUR = 15;

const CONSIGNES = {
  publication: `Tu es l'assistant d'Ayôrôfa Connect, réseau professionnel de la Côte d'Ivoire.
Rédige une publication engageante en français à partir des indications fournies : 4-8 lignes,
ton chaleureux et professionnel, 1-2 emojis pertinents, 1-2 hashtags à la fin.
Réponds UNIQUEMENT avec le texte de la publication.`,
  correction: `Corrige l'orthographe, la grammaire et la ponctuation du texte, en français,
sans changer le ton ni le sens. Réponds UNIQUEMENT avec le texte corrigé.`,
  devis: `Aide un professionnel ivoirien à rédiger un devis clair à partir de sa description :
objet, détail des prestations avec montants en FCFA (ses chiffres, sinon [MONTANT]), total,
délai, conditions (acompte, validité 30 jours). Réponds UNIQUEMENT avec le devis.`,
  cv: `Rédige un CV professionnel en français adapté au marché ivoirien à partir des informations
fournies : titre, profil (3 lignes), expériences, compétences, formation, langues, contact.
Mets [À COMPLÉTER] si une information manque. Réponds UNIQUEMENT avec le CV.`,
  lettre: `Rédige la lettre professionnelle demandée (motivation, demande…), structurée et polie,
en français, contexte ivoirien, avec formule de politesse. Réponds UNIQUEMENT avec la lettre.`,
  profil: `Améliore cette présentation de profil pour Ayôrôfa Connect : vendeuse, confiante,
concrète, 3-5 lignes maximum, français naturel. Réponds UNIQUEMENT avec la nouvelle présentation.`,
  reponse: `Propose UNE réponse courte, polie et utile (1-3 phrases, français) au message reçu
dans une conversation professionnelle. Réponds UNIQUEMENT avec la réponse.`,
  estimation: `Donne une estimation de prix INDICATIVE en FCFA pour la prestation décrite, marché
ivoirien : fourchette basse-haute, facteurs de variation, et rappelle que seul un devis de
professionnel fait foi. 6-10 lignes maximum.`,
};

async function appelIA(action, contexte) {
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5',
      max_tokens: 1200,
      system: CONSIGNES[action],
      messages: [{ role: 'user', content: String(contexte) }],
    }),
  });
  if (!r.ok) return null;
  const data = await r.json();
  return (data.content || []).filter((c) => c.type === 'text').map((c) => c.text).join('\n').trim();
}

export async function POST(req) {
  const token = (req.headers.get('authorization') || '').replace('Bearer ', '');
  if (!token) return Response.json({ error: 'Connectez-vous pour utiliser l’assistant.' }, { status: 401 });

  const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  const { data: { user }, error: eU } = await admin.auth.getUser(token);
  if (eU || !user) return Response.json({ error: 'Session invalide.' }, { status: 401 });

  const { action, contexte, metier, ville } = await req.json();

  // ── Recommandations : sur les vraies données, sans clé IA ──
  if (action === 'reco_pros' || action === 'reco_candidats') {
    let q = admin.from('profiles')
      .select('id,nom,avatar_url,verifie,badges,metier_principal,ville,type')
      .limit(6);
    if (action === 'reco_pros') {
      q = q.neq('type', 'chercheur').order('verifie', { ascending: false });
      if (metier) q = q.eq('metier_principal', metier);
    } else {
      q = q.eq('type', 'chercheur');
      if (metier) q = q.contains('interets', [metier]);
    }
    if (ville) q = q.eq('ville', ville);
    const { data } = await q;
    return Response.json({ liste: data || [] });
  }

  // ── Estimation : d'abord les devis RÉELS de la plateforme ──
  if (action === 'estimation' && metier) {
    const { data: dvs } = await admin.from('devis')
      .select('montant, demandes_devis!inner(metier)')
      .eq('demandes_devis.metier', metier)
      .limit(300);
    const montants = (dvs || []).map((x) => x.montant).filter((n) => n > 0).sort((a, b) => a - b);
    if (montants.length >= 3) {
      const F = (n) => n.toLocaleString('fr-FR');
      const bas = montants[Math.floor(montants.length * 0.2)];
      const haut = montants[Math.floor(montants.length * 0.8)];
      const median = montants[Math.floor(montants.length / 2)];
      const texte = `💰 Estimation pour ce métier, basée sur les devis réels échangés sur Ayôrôfa Connect :\n\n` +
        `• Fourchette courante : ${F(bas)} – ${F(haut)} FCFA\n` +
        `• Montant médian : ${F(median)} FCFA\n` +
        `• Nombre de devis analysés : ${montants.length}\n\n` +
        `Le prix final dépend des quantités, des matériaux, de l’accès au site et du délai. ` +
        `Seul le devis d’un professionnel fait foi — demandez-en plusieurs via la page Devis !`;
      return Response.json({ texte, source: `Basé sur ${montants.length} devis réels de la plateforme` });
    }
    // pas assez de données → l'IA prend le relais (si activée)
  }

  // ── Tâches de rédaction : IA requise ──
  if (!CONSIGNES[action]) return Response.json({ error: 'Demande invalide.' }, { status: 400 });
  if (!process.env.ANTHROPIC_API_KEY) return Response.json({ error: 'inactif' }, { status: 503 });
  if (!contexte || String(contexte).length > 4000) {
    return Response.json({ error: 'Décrivez votre demande (4000 caractères max).' }, { status: 400 });
  }

  // quota journalier
  const jour = new Date().toISOString().slice(0, 10);
  const { data: qta } = await admin.from('ia_usage').select('n').eq('membre', user.id).eq('jour', jour).maybeSingle();
  if ((qta?.n || 0) >= LIMITE_JOUR) {
    return Response.json({ error: `Limite atteinte (${LIMITE_JOUR}/jour). Revenez demain !` }, { status: 429 });
  }

  const prompt = action === 'estimation' && metier
    ? `Métier : ${metier}${ville ? ` · Lieu : ${ville}` : ''}\n${contexte || ''}`
    : contexte;
  const texte = await appelIA(action, prompt);
  if (!texte) return Response.json({ error: 'Assistant momentanément indisponible.' }, { status: 502 });

  await admin.from('ia_usage').upsert({ membre: user.id, jour, n: (qta?.n || 0) + 1 }, { onConflict: 'membre,jour' });
  return Response.json({ texte });
}
