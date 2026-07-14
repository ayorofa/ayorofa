export const metadata = {
  title: 'Mentions légales',
  description: 'Mentions légales de la plateforme Ayôrôfa Connect.',
};

const S = ({ t, children }) => (
  <div className="card" style={{ marginTop: 14 }}>
    <h2 style={{ fontSize: '1.05rem', margin: 0 }}>{t}</h2>
    <div style={{ marginTop: 8 }}>{children}</div>
  </div>
);

export default function Mentions() {
  return (
    <main className="sec"><div className="wrap" style={{ maxWidth: 720 }}>
      <p className="eyebrow">Juridique</p>
      <h1>Mentions légales</h1>

      <S t="Éditeur de la plateforme">
        <p><strong>Ayôrôfa</strong> — Abidjan, Côte d’Ivoire.<br />
        Directeur de la publication : Aselme Yapi, fondateur.<br />
        Contact : contact@ayorofa.com · WhatsApp +225 07 49 07 40 82.<br />
        Immatriculation (RCCM) : en cours d’enregistrement au Guichet Unique du CEPICI — le numéro sera affiché ici
        dès sa délivrance.</p>
      </S>

      <S t="Hébergement">
        <p>Application hébergée par <strong>Vercel Inc.</strong> (440 N Barranca Ave #4133, Covina, CA 91723,
        États-Unis — vercel.com).<br />
        Données hébergées par <strong>Supabase Inc.</strong> (supabase.com).</p>
      </S>

      <S t="Propriété intellectuelle">
        <p>Le nom « Ayôrôfa », le logo (temple et lien dorés), la charte graphique, les textes, la structure et le code
        de la plateforme sont la propriété exclusive d’Ayôrôfa. Toute reproduction, imitation ou réutilisation, totale
        ou partielle, sans autorisation écrite est interdite et pourra donner lieu à des poursuites. Les contenus
        publiés par les membres restent la propriété de leurs auteurs.</p>
      </S>

      <S t="Signalement d’un contenu">
        <p>Pour signaler un contenu illicite ou une atteinte à vos droits : utilisez le bouton « Signaler » présent sur
        chaque annonce, ou écrivez à contact@ayorofa.com en précisant l’adresse du contenu et le motif. Les demandes
        sont traitées dans les meilleurs délais.</p>
      </S>

      <S t="Crédits">
        <p>Conception et développement : Ayôrôfa — Abidjan. © Ayôrôfa, tous droits réservés.</p>
      </S>
    </div></main>
  );
}
