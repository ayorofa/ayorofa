import { metierBySlug } from '../data/metiers';
import { PROS } from '../data/pros';
import BadgeVerifie from '../components/BadgeVerifie';
import { RedirectSiConnecte, HeroRecherche, StatsDirect } from './VitrineClient';

export const metadata = {
  title: 'Ayôrôfa Connect — Le réseau professionnel de la Côte d’Ivoire',
  description:
    'Trouvez un professionnel de confiance, publiez vos besoins et développez votre réseau en Côte d’Ivoire. Artisans, entreprises et chercheurs d’emploi — gratuit, vérifié, à l’ivoirienne.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Ayôrôfa Connect — Le réseau professionnel de la Côte d’Ivoire',
    description: 'Un besoin d’un côté. Un talent de l’autre. La mise en relation, à l’ivoirienne.',
    url: 'https://connect.ayorofa.com',
    type: 'website',
  },
};

const CATEGORIES = ['maconnerie', 'electricite', 'plomberie', 'couture', 'coiffure', 'mecanique', 'restauration', 'informatique'];

const ETAPES = [
  ['1', 'Créez votre compte gratuit', 'Deux minutes suffisent : nom, métier ou besoin, ville. Ajoutez votre photo pour inspirer confiance.'],
  ['2', 'Publiez ou trouvez', 'Publiez votre besoin (avec photos) ou trouvez le bon professionnel dans l’annuaire — filtré par métier et par ville.'],
  ['3', 'Échangez et concluez', 'Messagerie instantanée, avis vérifiés, badge de confiance : vous traitez en connaissance de cause.'],
];

const FAQ = [
  ['Est-ce vraiment gratuit ?', 'Oui. Créer un compte, publier des besoins, contacter des professionnels et bâtir son réseau est gratuit. Des options payantes existent pour les professionnels qui veulent plus de visibilité (badge Vérifié, plan Pro).'],
  ['Que signifie le badge « Vérifié » ?', 'Le badge doré ✔ indique un professionnel dont l’activité a été contrôlée par l’équipe Ayôrôfa (identité, activité réelle, références le cas échéant). C’est notre marque de confiance.'],
  ['Comment publier un besoin ?', 'Après inscription, touchez le bouton ⊕ Publier : décrivez votre besoin, ajoutez des photos si utile, choisissez le métier et la ville. Les professionnels concernés vous répondent directement.'],
  ['Comment payer un abonnement ?', 'Par Mobile Money (Wave, Orange, MTN, Moov) — le paiement se fait en quelques secondes depuis votre téléphone.'],
  ['Mes données sont-elles protégées ?', 'Oui : connexions chiffrées, messages privés visibles des seuls participants, et conformité à la loi ivoirienne n° 2013-450 sur la protection des données. Consultez notre politique de confidentialité.'],
  ['Je suis professionnel : pourquoi m’inscrire ?', 'Une vitrine gratuite, des demandes de clients en temps réel, des avis qui bâtissent votre réputation, et un réseau qui travaille pour vous — même pendant que vous êtes sur un chantier.'],
];

const JSONLD_FAQ = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map(([q, r]) => ({
    '@type': 'Question', name: q,
    acceptedAnswer: { '@type': 'Answer', text: r },
  })),
};

const JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Ayôrôfa Connect',
  url: 'https://connect.ayorofa.com',
  description: 'Le réseau professionnel de la Côte d’Ivoire : mise en relation entre professionnels, clients et chercheurs d’emploi.',
  publisher: {
    '@type': 'Organization',
    name: 'Ayôrôfa',
    slogan: 'La maison du savoir',
    email: 'contact@ayorofa.com',
    address: { '@type': 'PostalAddress', addressLocality: 'Abidjan', addressCountry: 'CI' },
  },
};

export default function Vitrine() {
  return (
    <main className="vitrine">
      <RedirectSiConnecte />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD_FAQ) }} />

      {/* ── HERO ── */}
      <section className="v-hero">
        <div className="wrap">
          <p className="v-kicker">LE RÉSEAU PROFESSIONNEL DE LA CÔTE D’IVOIRE 🇨🇮</p>
          <h1>Un besoin d’un côté.<br />Un talent de l’autre.</h1>
          <p className="v-sub">
            Trouvez un professionnel de confiance, publiez vos besoins, développez votre réseau —
            artisans, entreprises et chercheurs d’emploi, réunis au même endroit.
          </p>
          <HeroRecherche />
          <div className="v-hero-cta">
            <Link href="/inscription" className="btn v-btn-gold">Créer mon compte gratuit</Link>
            <Link href="/membres" className="btn v-btn-ghost">Parcourir l’annuaire</Link>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="v-band">
        <div className="wrap"><StatsDirect /></div>
      </section>

      {/* ── CATÉGORIES POPULAIRES ── */}
      <section className="sec">
        <div className="wrap">
          <p className="eyebrow">Catégories populaires</p>
          <h2>Tous les métiers de Côte d’Ivoire</h2>
          <div className="v-cats">
            {CATEGORIES.map((slug) => {
              const m = metierBySlug(slug);
              return m ? (
                <Link key={slug} href={`/membres?metier=${slug}`} className="v-cat">
                  {m.name}
                </Link>
              ) : null;
            })}
            <Link href="/membres" className="v-cat v-cat-plus">+ 44 autres métiers</Link>
          </div>
        </div>
      </section>

      {/* ── COMMENT ÇA MARCHE ── */}
      <section className="sec v-alt">
        <div className="wrap">
          <p className="eyebrow">Comment ça marche</p>
          <h2>Trois étapes, c’est tout</h2>
          <div className="v-etapes">
            {ETAPES.map(([n, t, d]) => (
              <div key={n} className="v-etape card">
                <span className="v-num">{n}</span>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROS RECOMMANDÉS ── */}
      <section className="sec">
        <div className="wrap">
          <p className="eyebrow">Professionnels vérifiés</p>
          <h2>Ils ouvrent la voie</h2>
          <div className="v-pros">
            {PROS.map((pro) => (
              <div key={pro.slug} className="card v-pro">
                <div className="post-n">
                  <strong style={{ fontSize: '1.1rem' }}>{pro.nom}</strong>
                  {pro.verifie && <BadgeVerifie size="sm" />}
                </div>
                <p className="muted sm" style={{ margin: '2px 0 8px' }}>
                  {metierBySlug(pro.metier)?.name} · {pro.ville}
                </p>
                <p style={{ fontSize: '.92rem' }}>{pro.desc}</p>
                <Link className="btn btn-sm" href={`/pro/${pro.slug}`} style={{ marginTop: 10 }}>Voir le profil</Link>
              </div>
            ))}
            <div className="card v-pro v-pro-cta">
              <h3 style={{ margin: 0 }}>Votre entreprise ici ?</h3>
              <p style={{ fontSize: '.92rem' }}>
                Rejoignez les professionnels vérifiés d’Ayôrôfa Connect : vitrine, avis clients,
                demandes en temps réel et le badge doré qui inspire confiance.
              </p>
              <Link className="btn btn-sm" href="/inscription" style={{ marginTop: 6 }}>Devenir membre</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── TÉMOIGNAGE / PARTENAIRE ── */}
      <section className="sec v-alt">
        <div className="wrap">
          <p className="eyebrow">Ils construisent avec nous</p>
          <div className="v-temoin card">
            <p className="v-quote">
              « Sur les chantiers, tout repose sur la confiance et le bon contact au bon moment.
              C’est exactement ce qu’Ayôrôfa Connect apporte : les besoins d’un côté, les talents
              de l’autre, et la réputation au milieu. »
            </p>
            <p className="v-auteur">
              <strong>SafEchaf</strong> — échafaudage métallique, Koumassi · Références : Cargill, SIR
            </p>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="sec">
        <div className="wrap" style={{ maxWidth: 780 }}>
          <p className="eyebrow">Questions fréquentes</p>
          <h2>Tout ce qu’il faut savoir</h2>
          <div className="v-faq">
            {FAQ.map(([q, r]) => (
              <details key={q} className="v-q">
                <summary>{q}</summary>
                <p>{r}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="v-final">
        <div className="wrap">
          <h2>Votre réseau commence aujourd’hui.</h2>
          <p>Gratuit, en français, à l’ivoirienne. On est ensemble 🙏</p>
          <Link href="/inscription" className="btn v-btn-gold" style={{ fontSize: '1.05rem' }}>
            Créer mon compte gratuit
          </Link>
        </div>
      </section>
    </main>
  );
}
