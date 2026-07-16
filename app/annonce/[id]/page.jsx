import { createClient } from '@supabase/supabase-js';
import AnnonceClient from './AnnonceClient';

// Métadonnées côté serveur : chaque annonce partagée a son titre et sa description
// (aperçus riches sur WhatsApp/Facebook + indexation Google).
export async function generateMetadata({ params }) {
  try {
    const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    const { data: b } = await sb.from('besoins')
      .select('titre,description,media,media_type').eq('id', params.id).maybeSingle();
    if (!b) return { title: 'Annonce — Ayôrôfa Connect' };
    const desc = (b.description || b.titre || '').slice(0, 155);
    return {
      title: `${b.titre} — Ayôrôfa Connect`,
      description: desc,
      openGraph: {
        title: b.titre,
        description: desc,
        ...(b.media && b.media_type === 'image' ? { images: [b.media] } : {}),
      },
      twitter: { card: b.media && b.media_type === 'image' ? 'summary_large_image' : 'summary' },
    };
  } catch (e) {
    return { title: 'Annonce — Ayôrôfa Connect' };
  }
}

export default function Page({ params }) {
  return <AnnonceClient id={params.id} />;
}
