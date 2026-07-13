import Link from 'next/link';

export const metadata = {
  title: 'À propos',
  description: 'Ayôrôfa Connect — la plateforme qui met en relation entreprises, particuliers et chercheurs d’emploi en Côte d’Ivoire.',
};

const POURQUOI = [
  ['100 % ivoirien', 'Pensé pour la Côte d’Ivoire et ses réalités.'],
  ['Gratuit', 'Publier, être mis en relation et discuter ne coûte rien.'],
  ['Temps réel', 'Les annonces et les messages arrivent instantanément.'],
  ['Messagerie intégrée', 'Discutez sans quitter la plateforme.'],
  ['Avis & confiance', 'Chaque membre bâtit sa réputation.'],
  ['Mobile', 'Fait pour le téléphone — installable comme une app.'],
];

const PUBLICS = [
  ['Entreprises & pros', ['Recevez des demandes de clients près de chez vous.', 'Un profil professionnel gratuit et visible.', 'Bâtissez votre réputation grâce aux avis.']],
  ['Clients & particuliers', ['Décrivez votre besoin, recevez des propositions.', 'Comparez les profils et les avis.', 'Contactez le pro directement, en confiance.']],
  ['Chercheurs d’emploi', ['Créez votre vitrine et soyez visible.', 'Consultez les offres en temps réel.', 'Soyez repéré et contacté par les entreprises.']],
];

export default function APropos() {
  return (
    <main className="sec">
      <div className="wrap" style={{ maxWidth: 760 }}>
        <p className="eyebrow">À propos</p>
        <h1>Un besoin d’un côté. Un talent de l’autre.</h1>
        <p className="lead">
          Ayôrôfa Connect est la plateforme ivoirienne qui met en relation, en temps réel,
          ceux qui ont un besoin et ceux qui peuvent y répondre.
        </p>

        <div className="card" style={{ marginTop: 20 }}>
          <h2>Le constat</h2>
          <ul className="liste">
            <li>Les bons professionnels restent invisibles, faute de visibilité.</li>
            <li>Les clients galèrent : bouche-à-oreille, numéros perdus, mauvaises surprises.</li>
            <li>Les chercheurs d’emploi n’ont aucune vitrine pour se faire repérer.</li>
          </ul>
        </div>

        <h2 style={{ marginTop: 30 }}>Comment ça marche</h2>
        <div className="grid g3 steps" style={{ marginTop: 16 }}>
          <div className="step"><h3>Publiez</h3><p className="muted">Un besoin, une offre ou votre recherche — en 2 minutes.</p></div>
          <div className="step"><h3>Recevez</h3><p className="muted">Des propositions et des contacts, en temps réel.</p></div>
          <div className="step"><h3>Choisissez</h3><p className="muted">Discutez par messagerie et concluez en confiance.</p></div>
        </div>

        <h2 style={{ marginTop: 34 }}>Pour qui ?</h2>
        {PUBLICS.map(([titre, points]) => (
          <div key={titre} className="card" style={{ marginTop: 14 }}>
            <h3 style={{ color: 'var(--gold-d)' }}>{titre}</h3>
            <ul className="liste">
              {points.map((p) => <li key={p}>{p}</li>)}
            </ul>
          </div>
        ))}

        <h2 style={{ marginTop: 34 }}>Pourquoi Ayôrôfa Connect</h2>
        <div className="grid g3" style={{ marginTop: 16 }}>
          {POURQUOI.map(([t, d]) => (
            <div key={t} className="card">
              <h3 style={{ fontSize: '1.05rem' }}>{t}</h3>
              <p className="muted sm" style={{ margin: 0 }}>{d}</p>
            </div>
          ))}
        </div>

        <div className="joinbox" style={{ marginTop: 34 }}>
          <h3>Rejoignez la communauté</h3>
          <p>C’est gratuit et ça prend 2 minutes.</p>
          <Link href="/inscription" className="btn">Créer mon compte</Link>
        </div>

        <p className="muted sm" style={{ marginTop: 26, textAlign: 'center' }}>
          Ayôrôfa Connect est une plateforme du <strong>Groupe Ayôrôfa</strong> — la maison du savoir.<br />
          Abidjan, Côte d’Ivoire · contact@ayorofa.com
        </p>
      </div>
    </main>
  );
}
