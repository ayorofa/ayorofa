import Link from 'next/link';
import { metierBySlug } from '../data/metiers';
import { PROS } from '../data/pros';
import { RedirectSiConnecte, HeroRecherche, StatsDirect, Appariement } from './VitrineClient';

export const metadata = {
  title: 'Ayôrôfa Connect — Le réseau professionnel de la Côte d’Ivoire',
  description:
    'Trouvez un professionnel vérifié, publiez votre besoin, recevez plusieurs devis. Le réseau des artisans, entreprises et chercheurs d’emploi de Côte d’Ivoire. Gratuit, en français, paiement Mobile Money.',
  alternates: { canonical: '/' },
  verification: { google: '3Ho8g71uDp7GAgjZtXgYh7SGuuYdnZlA0DPTbs4Yp2I' },
  openGraph: {
    title: 'Ayôrôfa Connect — Le réseau professionnel de la Côte d’Ivoire',
    description: 'Un besoin d’un côté. Un talent de l’autre. La mise en relation, à l’ivoirienne.',
    url: 'https://connect.ayorofa.com',
    type: 'website',
  },
};

const CATEGORIES = ['maconnerie', 'electricite', 'plomberie', 'couture', 'coiffure', 'mecanique', 'restauration', 'informatique'];

const ETAPES = [
  ['Vous décrivez', 'Votre besoin en deux lignes, avec une photo si ça aide. Ou vous cherchez directement dans l’annuaire, par métier et par ville.'],
  ['Les pros répondent', 'Les professionnels concernés reçoivent votre demande et vous envoient leur prix et leur délai. Vous comparez les devis côte à côte.'],
  ['Vous choisissez', 'Vous discutez par message, vous concluez, vous payez en Mobile Money. Puis vous laissez un avis — c’est ce qui fait tenir la confiance.'],
];

const COMPARAISON = [
  ['Trouver quelqu’un', 'Demander dans le groupe et attendre qu’on vous réponde', 'Annuaire par métier et par ville — résultat immédiat'],
  ['Savoir à qui on parle', 'Un nom, une photo, aucune preuve', 'Badge Vérifié contrôlé par notre équipe et avis de vrais clients'],
  ['Comparer les prix', 'Presque impossible', 'Plusieurs devis chiffrés, affichés côte à côte'],
  ['Retrouver une info', 'Noyée sous 200 messages', 'Chaque annonce a sa page, sa recherche et son historique'],
  ['Être trouvé', 'Il faut être en ligne au bon moment', 'Votre profil travaille pendant que vous êtes sur le chantier'],
];

const FAQ = [
  ['Est-ce vraiment gratuit ?', 'Oui. S’inscrire, publier des besoins, contacter des professionnels et bâtir son réseau ne coûte rien. Les professionnels qui veulent plus de visibilité peuvent prendre le badge Vérifié ou un plan Pro, à partir de 2 000 F par mois.'],
  ['Que vaut le badge « Vérifié » ?', 'Il n’est pas automatique. Notre équipe contrôle l’identité, l’activité réelle et les références avant de l’attribuer. C’est ce qui vous distingue d’un profil créé en trois minutes ailleurs.'],
  ['Je n’ai pas d’entreprise déclarée, puis-je m’inscrire ?', 'Oui. Ayôrôfa Connect est fait pour l’économie réelle : artisans, indépendants, ateliers, PME. Ce qui compte, c’est votre savoir-faire et ce que vos clients disent de vous.'],
  ['Comment se passe le paiement ?', 'Par Mobile Money — Wave, Orange, MTN, Moov — depuis votre téléphone, en quelques secondes. Ni carte bancaire, ni compte en banque exigé.'],
  ['Mes données sont-elles protégées ?', 'Connexions chiffrées, messages privés visibles des seuls participants, et conformité à la loi ivoirienne n° 2013-450 sur la protection des données personnelles.'],
  ['Ça marche avec peu de connexion ?', 'L’application s’installe sur votre écran d’accueil, se charge vite et reste utilisable quand le réseau faiblit. Elle est pensée pour les téléphones d’ici.'],
];

const JSONLD = {
  '@context': 'https://schema.org', '@type': 'WebSite',
  name: 'Ayôrôfa Connect', url: 'https://connect.ayorofa.com',
  description: 'Le réseau professionnel de la Côte d’Ivoire : mise en relation entre professionnels, clients et chercheurs d’emploi.',
  publisher: {
    '@type': 'Organization', name: 'Ayôrôfa', slogan: 'La maison du savoir',
    email: 'contact@ayorofa.com',
    address: { '@type': 'PostalAddress', addressLocality: 'Abidjan', addressCountry: 'CI' },
  },
};

const JSONLD_FAQ = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: FAQ.map(([q, r]) => ({
    '@type': 'Question', name: q,
    acceptedAnswer: { '@type': 'Answer', text: r },
  })),
};

/* Le temple d'Ayôrôfa — la marque, dessinée et non collée. */
function Temple({ h = 34 }) {
  return (
    <svg className="ay-temple" width={h * 1.45} height={h} viewBox="0 0 58 40" fill="none" aria-hidden="true">
      <path d="M29 2 L54 14 H4 Z" fill="currentColor" />
      <rect x="4" y="17" width="50" height="3" rx="1" fill="currentColor" />
      <rect x="10" y="22" width="4.5" height="12" rx="1" fill="currentColor" />
      <rect x="21.5" y="22" width="4.5" height="12" rx="1" fill="currentColor" />
      <rect x="32" y="22" width="4.5" height="12" rx="1" fill="currentColor" />
      <rect x="43.5" y="22" width="4.5" height="12" rx="1" fill="currentColor" />
      <rect x="2" y="36" width="54" height="3.4" rx="1.2" fill="currentColor" />
    </svg>
  );
}

export default function Vitrine() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <main className="ay">
        <RedirectSiConnecte />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD_FAQ) }} />

        {/* ═══ HERO ═══ */}
        <section className="ay-hero">
          <div className="ay-wrap">
            <p className="ay-eyebrow"><Temple h={18} /> La maison du savoir · Abidjan 🇨🇮</p>
            <h1 className="ay-h1">
              Un besoin d’un côté.<br />
              <span className="ay-h1-or">Un talent de l’autre.</span>
            </h1>
            <p className="ay-lead">
              Le réseau professionnel de la Côte d’Ivoire. Décrivez ce qu’il vous faut,
              recevez les devis des artisans et entreprises vérifiés près de chez vous.
            </p>

            <Appariement />

            <HeroRecherche />
            <div className="ay-cta-row">
              <Link href="/inscription" className="ay-btn ay-btn-or ay-btn-lg">Créer mon compte — gratuit</Link>
              <Link href="/membres" className="ay-btn ay-btn-vide ay-btn-lg">Voir les professionnels</Link>
            </div>
            <p className="ay-note">Sans carte bancaire · Paiement Mobile Money · En français</p>
          </div>
        </section>

        {/* ═══ CHIFFRES ═══ */}
        <section className="ay-band">
          <div className="ay-wrap"><StatsDirect /></div>
        </section>

        {/* ═══ POURQUOI ═══ */}
        <section className="ay-sec">
          <div className="ay-wrap ay-etroit">
            <p className="ay-kicker">Pourquoi nous existons</p>
            <h2 className="ay-h2">En Côte d’Ivoire, le travail se trouve encore de bouche à oreille.</h2>
            <p className="ay-para">
              Un bon carreleur peut rester sans chantier pendant qu’à deux quartiers de là,
              quelqu’un cherche un carreleur depuis une semaine. Les talents sont là. Les besoins
              aussi. Ce qui manque, c’est le fil entre les deux — et la confiance pour le suivre.
            </p>
            <p className="ay-para">
              <strong>Ayôrôfa Connect tend ce fil.</strong> On donne à chaque professionnel une vitrine
              que personne ne peut lui retirer, à chaque client un moyen de vérifier avant de payer,
              et à chacun une réputation qui s’écrit noir sur blanc, avis après avis.
            </p>
          </div>
        </section>

        {/* ═══ COMPARAISON ═══ */}
        <section className="ay-sec ay-sombre">
          <div className="ay-wrap">
            <p className="ay-kicker ay-kicker-clair">La vraie question</p>
            <h2 className="ay-h2 ay-h2-clair">« Pourquoi pas simplement WhatsApp ou Facebook ? »</h2>
            <p className="ay-para ay-para-clair ay-etroit-p">
              Parce qu’un groupe n’est pas un outil de travail. Voici ce que ça change, concrètement.
            </p>

            <div className="ay-tab">
              <div className="ay-tab-tete">
                <span />
                <span className="ay-tab-h">Groupes WhatsApp / Facebook</span>
                <span className="ay-tab-h ay-tab-h-or"><Temple h={14} /> Ayôrôfa Connect</span>
              </div>
              {COMPARAISON.map(([quoi, avant, apres]) => (
                <div className="ay-tab-l" key={quoi}>
                  <span className="ay-tab-q">{quoi}</span>
                  <span className="ay-tab-a">{avant}</span>
                  <span className="ay-tab-b">{apres}</span>
                </div>
              ))}
            </div>

            <p className="ay-ps">
              Et LinkedIn ? Il est bâti pour les bureaux et les CV en anglais. Ici, on parle
              chantiers, ateliers et boutiques — en français, avec le Mobile Money et les 82 localités du pays.
            </p>
          </div>
        </section>

        {/* ═══ MÉTIERS ═══ */}
        <section className="ay-sec">
          <div className="ay-wrap">
            <p className="ay-kicker">52 corps de métiers</p>
            <h2 className="ay-h2">Le savoir-faire d’ici, au complet.</h2>
            <div className="ay-metiers">
              {CATEGORIES.map((slug) => {
                const m = metierBySlug(slug);
                return m ? (
                  <Link key={slug} href={`/membres?metier=${slug}`} className="ay-metier">{m.name}</Link>
                ) : null;
              })}
              <Link href="/membres" className="ay-metier ay-metier-plus">Tous les métiers →</Link>
            </div>
          </div>
        </section>

        {/* ═══ COMMENT ÇA MARCHE ═══ */}
        <section className="ay-sec ay-creme">
          <div className="ay-wrap">
            <p className="ay-kicker">Comment ça marche</p>
            <h2 className="ay-h2">Trois temps, et c’est réglé.</h2>
            <ol className="ay-etapes">
              {ETAPES.map(([t, d], k) => (
                <li key={t} className="ay-etape">
                  <span className="ay-etape-n">{k + 1}</span>
                  <h3 className="ay-etape-t">{t}</h3>
                  <p className="ay-etape-d">{d}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ═══ PREUVE ═══ */}
        <section className="ay-sec">
          <div className="ay-wrap ay-etroit">
            <p className="ay-kicker">Ils construisent avec nous</p>
            <blockquote className="ay-cite">
              <p>
                Sur les chantiers, tout repose sur la confiance et le bon contact au bon moment.
                C’est exactement ce qu’Ayôrôfa Connect apporte : les besoins d’un côté,
                les talents de l’autre, et la réputation au milieu.
              </p>
              <footer>
                <strong>SafEchaf</strong> — échafaudage métallique, Koumassi
                <span>Références : Cargill · SIR · Ivoire Ingénierie</span>
              </footer>
            </blockquote>
            <div className="ay-pros">
              {PROS.map((pro) => (
                <Link key={pro.slug} href={`/pro/${pro.slug}`} className="ay-pro">
                  <span className="ay-pro-n">{pro.nom} {pro.verifie && <em className="ay-verif">✔</em>}</span>
                  <span className="ay-pro-m">{metierBySlug(pro.metier)?.name} · {pro.ville}</span>
                </Link>
              ))}
              <Link href="/inscription" className="ay-pro ay-pro-vide">
                <span className="ay-pro-n">Votre entreprise ici</span>
                <span className="ay-pro-m">Vitrine gratuite · badge Vérifié</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ═══ FAQ ═══ */}
        <section className="ay-sec ay-creme">
          <div className="ay-wrap ay-etroit">
            <p className="ay-kicker">Questions fréquentes</p>
            <h2 className="ay-h2">Ce qu’on nous demande le plus.</h2>
            <div className="ay-faq">
              {FAQ.map(([q, r]) => (
                <details key={q} className="ay-q">
                  <summary>{q}</summary>
                  <p>{r}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ CTA FINAL ═══ */}
        <section className="ay-final">
          <div className="ay-wrap">
            <Temple h={40} />
            <h2 className="ay-h2 ay-h2-clair">Votre réseau commence aujourd’hui.</h2>
            <p className="ay-para ay-para-clair">Deux minutes pour créer votre profil. On est ensemble 🙏</p>
            <Link href="/inscription" className="ay-btn ay-btn-or ay-btn-lg">Créer mon compte — gratuit</Link>
          </div>
        </section>
      </main>
    </>
  );
}

/* ══════════════════════════════════════════════════════════
   IDENTITÉ VISUELLE — encre, or, ivoire.
   Display : Bricolage Grotesque · Texte : Figtree
   Namespace « ay- » : n'affecte aucune autre page du site.
   ══════════════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@600;800&family=Figtree:wght@400;500;700&display=swap');
.ay{
  --encre:#12100B; --nuit:#1E1A12; --or:#C9A24B; --or-l:#E7C879; --or-d:#8F701F;
  --ivoire:#F5F0E4; --creme:#FAF7EF; --blanc:#fff; --gris:#6F6858;
  --disp:'Bricolage Grotesque',Georgia,serif;
  --texte:'Figtree',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;
  font-family:var(--texte); color:#211D18; overflow-x:hidden;
}
.ay *{box-sizing:border-box}
.ay-wrap{width:100%;max-width:1080px;margin:0 auto;padding:0 20px}
.ay-etroit{max-width:720px}
.ay-etroit-p{max-width:640px}
.ay-temple{display:inline-block;vertical-align:middle;color:var(--or)}

.ay-h1{font-family:var(--disp);font-weight:800;font-size:clamp(2.2rem,8.2vw,4.6rem);
  line-height:.98;letter-spacing:-.03em;margin:14px 0 0;color:var(--ivoire)}
.ay-h1-or{color:var(--or-l)}
.ay-h2{font-family:var(--disp);font-weight:800;font-size:clamp(1.55rem,4.6vw,2.5rem);
  line-height:1.1;letter-spacing:-.022em;margin:8px 0 0;color:var(--encre);max-width:20ch}
.ay-h2-clair{color:var(--ivoire);max-width:22ch}
.ay-kicker{font-family:var(--disp);font-weight:600;font-size:.72rem;letter-spacing:.2em;
  text-transform:uppercase;color:var(--or-d);margin:0}
.ay-kicker-clair{color:var(--or-l)}
.ay-eyebrow{display:inline-flex;align-items:center;gap:9px;font-family:var(--disp);font-weight:600;
  font-size:.74rem;letter-spacing:.16em;text-transform:uppercase;color:#B9AD97;margin:0;
  border:1px solid rgba(201,162,75,.32);border-radius:99px;padding:7px 15px 7px 11px}
.ay-lead{font-size:clamp(1.02rem,2.6vw,1.2rem);line-height:1.55;color:#D6CDB9;
  max-width:34ch;margin:13px 0 0}
.ay-para{font-size:1.04rem;line-height:1.68;color:#3A342B;margin:14px 0 0}
.ay-para-clair{color:#CFC6B2}
.ay-note{font-size:.82rem;color:#9A8F79;margin:14px 0 0}

.ay-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;
  font-family:var(--disp);font-weight:600;font-size:.95rem;letter-spacing:-.01em;
  border-radius:13px;padding:13px 22px;min-height:50px;border:1.5px solid transparent;
  cursor:pointer;transition:transform .18s ease,box-shadow .18s ease,background .18s ease}
.ay-btn-or{background:var(--or);color:var(--encre);box-shadow:0 8px 22px rgba(201,162,75,.28)}
.ay-btn-or:hover{background:var(--or-l);transform:translateY(-2px);box-shadow:0 12px 30px rgba(201,162,75,.4)}
.ay-btn-vide{background:transparent;color:var(--or-l);border-color:rgba(231,200,121,.42)}
.ay-btn-vide:hover{border-color:var(--or);background:rgba(201,162,75,.1)}
.ay-btn-lg{font-size:1rem;padding:15px 26px;min-height:54px}

.ay-hero{background:var(--encre);padding:34px 0 48px;position:relative;isolation:isolate}
.ay-hero:before{content:"";position:absolute;inset:0;z-index:-1;opacity:.5;
  background:
    radial-gradient(ellipse 70% 50% at 78% 8%,rgba(201,162,75,.3),transparent 62%),
    repeating-linear-gradient(90deg,rgba(201,162,75,.07) 0 1px,transparent 1px 46px)}
.ay-cta-row{display:flex;gap:10px;flex-wrap:wrap;margin-top:14px}

.ay-search{display:flex;gap:7px;background:var(--blanc);border-radius:15px;padding:7px;
  margin-top:20px;max-width:520px;box-shadow:0 16px 40px rgba(0,0,0,.34)}
.ay-search input{flex:1;min-width:0;border:none;outline:none;background:none;
  padding:12px 14px;font-size:16px;font-family:var(--texte);color:#211D18}
.ay-search input::placeholder{color:#9A8F79}
.ay-search .ay-btn{padding:12px 18px;min-height:46px}

.ay-match{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:10px;
  margin-top:22px;max-width:620px}
.ay-match-col{min-width:0}
.ay-tag{display:inline-block;font-family:var(--disp);font-weight:600;font-size:.62rem;
  letter-spacing:.18em;text-transform:uppercase;margin-bottom:8px}
.ay-tag-besoin{color:#B9AD97}
.ay-tag-talent{color:var(--or-l)}
.ay-fiche{background:var(--nuit);border:1px solid #342D20;border-radius:14px;padding:13px 14px;
  min-height:88px;display:flex;flex-direction:column;justify-content:center}
.ay-fiche-talent{border-color:rgba(201,162,75,.5);background:linear-gradient(160deg,#241F16,#1A1610)}
.ay-fiche-t{font-family:var(--disp);font-weight:600;font-size:.95rem;line-height:1.22;
  color:var(--ivoire);margin:0}
.ay-fiche-m{font-size:.76rem;color:#9A8F79;margin:6px 0 0;line-height:1.35}
.ay-fiche-note{font-size:.76rem;color:var(--or-l);margin:5px 0 0;font-weight:700}
.ay-verif{color:var(--or);font-style:normal}
.ay-anim{animation:ayEntre .55s cubic-bezier(.2,.7,.3,1) both}
@keyframes ayEntre{from{opacity:0;transform:translateY(7px) scale(.985)}to{opacity:1;transform:none}}
.ay-lien{position:relative;width:44px;height:44px;display:grid;place-items:center;flex:0 0 auto}
.ay-lien-trait{position:absolute;left:0;right:0;top:50%;height:1.5px;
  background:linear-gradient(90deg,transparent,var(--or),transparent);transform-origin:left}
.ay-lien-trait.ay-anim{animation:ayTrait 3.6s ease-in-out infinite}
@keyframes ayTrait{0%{transform:scaleX(0);opacity:0}18%{transform:scaleX(1);opacity:1}
  84%{transform:scaleX(1);opacity:1}100%{transform:scaleX(1);opacity:0}}
.ay-lien-pt{position:relative;color:var(--or);font-size:.85rem;
  background:var(--encre);padding:0 4px;line-height:1}

.ay-band{background:var(--nuit);border-top:1px solid rgba(201,162,75,.24);
  border-bottom:1px solid rgba(201,162,75,.24);padding:20px 0}
.ay-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;text-align:center}
.ay-stat-n{display:block;font-family:var(--disp);font-weight:800;
  font-size:clamp(1.3rem,4.6vw,2rem);color:var(--or-l);line-height:1;letter-spacing:-.02em}
.ay-stat-l{display:block;font-size:.7rem;color:#8D8371;margin-top:5px;
  text-transform:uppercase;letter-spacing:.11em}

.ay-sec{padding:52px 0}
.ay-creme{background:var(--creme)}
.ay-sombre{background:var(--encre)}

.ay-tab{margin-top:26px;border:1px solid #342D20;border-radius:16px;overflow:hidden}
.ay-tab-tete,.ay-tab-l{display:grid;grid-template-columns:1fr 1.25fr 1.4fr;gap:12px;
  padding:13px 16px;align-items:start}
.ay-tab-tete{background:#191510;border-bottom:1px solid #342D20}
.ay-tab-h{font-family:var(--disp);font-weight:600;font-size:.76rem;letter-spacing:.05em;color:#9A8F79}
.ay-tab-h-or{color:var(--or-l);display:inline-flex;align-items:center;gap:7px}
.ay-tab-l+.ay-tab-l{border-top:1px solid #241F17}
.ay-tab-q{font-family:var(--disp);font-weight:600;font-size:.86rem;color:var(--ivoire)}
.ay-tab-a{font-size:.84rem;color:#8A8071;line-height:1.42}
.ay-tab-b{font-size:.84rem;color:#E4DCC8;line-height:1.42;font-weight:500}
.ay-ps{margin:22px 0 0;font-size:.92rem;color:#9A8F79;line-height:1.6;max-width:62ch}

.ay-metiers{display:flex;flex-wrap:wrap;gap:9px;margin-top:22px}
.ay-metier{font-family:var(--disp);font-weight:600;font-size:.9rem;color:#2A251D;
  background:var(--blanc);border:1.5px solid #E6DDC8;border-radius:99px;padding:11px 19px;
  min-height:46px;display:inline-flex;align-items:center;
  transition:border-color .16s ease,transform .16s ease,color .16s ease}
.ay-metier:hover{border-color:var(--or);color:var(--or-d);transform:translateY(-2px)}
.ay-metier-plus{background:var(--encre);color:var(--or-l);border-color:var(--encre)}
.ay-metier-plus:hover{color:var(--or-l);background:var(--nuit)}

.ay-etapes{list-style:none;padding:0;margin:26px 0 0;display:grid;gap:14px;
  grid-template-columns:repeat(auto-fit,minmax(240px,1fr))}
.ay-etape{background:var(--blanc);border:1px solid #EBE3D1;border-radius:16px;padding:22px}
.ay-etape-n{display:inline-grid;place-items:center;width:38px;height:38px;border-radius:11px;
  background:var(--encre);color:var(--or-l);font-family:var(--disp);font-weight:800;font-size:1.05rem}
.ay-etape-t{font-family:var(--disp);font-weight:600;font-size:1.12rem;margin:13px 0 6px;color:var(--encre)}
.ay-etape-d{font-size:.92rem;line-height:1.6;color:#4A4438;margin:0}

.ay-cite{margin:20px 0 0;padding:0 0 0 20px;border-left:3px solid var(--or)}
.ay-cite p{font-family:var(--disp);font-weight:600;font-size:clamp(1.08rem,3vw,1.35rem);
  line-height:1.42;color:var(--encre);margin:0;letter-spacing:-.015em}
.ay-cite footer{margin-top:14px;font-size:.88rem;color:var(--gris)}
.ay-cite footer span{display:block;font-size:.8rem;margin-top:3px;color:#8D8371}
.ay-pros{display:grid;gap:10px;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));margin-top:26px}
.ay-pro{background:var(--blanc);border:1px solid #EBE3D1;border-radius:14px;padding:15px 17px;
  display:flex;flex-direction:column;gap:4px;transition:border-color .16s ease,transform .16s ease}
.ay-pro:hover{border-color:var(--or);transform:translateY(-2px)}
.ay-pro-n{font-family:var(--disp);font-weight:600;font-size:1rem;color:var(--encre)}
.ay-pro-m{font-size:.84rem;color:var(--gris)}
.ay-pro-vide{border-style:dashed;border-color:var(--or);background:#FFFCF3}

.ay-faq{margin-top:22px;display:grid;gap:9px}
.ay-q{background:var(--blanc);border:1px solid #EBE3D1;border-radius:14px;padding:0 17px}
.ay-q summary{list-style:none;cursor:pointer;padding:16px 30px 16px 0;position:relative;
  font-family:var(--disp);font-weight:600;font-size:.98rem;color:var(--encre)}
.ay-q summary::-webkit-details-marker{display:none}
.ay-q summary:after{content:"+";position:absolute;right:0;top:50%;transform:translateY(-50%);
  font-size:1.4rem;color:var(--or-d);line-height:1}
.ay-q[open] summary:after{content:"–"}
.ay-q p{margin:0 0 16px;font-size:.93rem;line-height:1.62;color:#4A4438}

.ay-final{background:var(--encre);text-align:center;padding:60px 0;position:relative;isolation:isolate}
.ay-final:before{content:"";position:absolute;inset:0;z-index:-1;opacity:.45;
  background:radial-gradient(ellipse 60% 60% at 50% 0%,rgba(201,162,75,.32),transparent 65%)}
.ay-final .ay-h2,.ay-final .ay-para{margin-left:auto;margin-right:auto}
.ay-final .ay-btn{margin-top:22px}

.ay a:focus-visible,.ay button:focus-visible,.ay summary:focus-visible,.ay input:focus-visible{
  outline:3px solid var(--or);outline-offset:3px;border-radius:6px}
@media (max-width:640px){
  .ay-match{grid-template-columns:1fr;gap:0;max-width:420px}
  .ay-lien{width:100%;height:34px}
  .ay-lien-trait{left:50%;right:auto;top:0;bottom:0;width:1.5px;height:100%;
    background:linear-gradient(180deg,transparent,var(--or),transparent);transform-origin:top}
  .ay-lien-trait.ay-anim{animation-name:ayTraitV}
  @keyframes ayTraitV{0%{transform:scaleY(0);opacity:0}18%{transform:scaleY(1);opacity:1}
    84%{transform:scaleY(1);opacity:1}100%{transform:scaleY(1);opacity:0}}
  .ay-tab-tete{display:none}
  .ay-tab-l{grid-template-columns:1fr;gap:6px;padding:15px 16px}
  .ay-tab-a:before{content:"Ailleurs : ";color:#5F5749;font-weight:600}
  .ay-tab-b:before{content:"Ici : ";color:var(--or);font-weight:700}
  .ay-stats{grid-template-columns:repeat(2,1fr);gap:16px 10px}
  .ay-btn-lg{width:100%}
}
@media (prefers-reduced-motion:reduce){
  .ay *{animation:none!important;transition:none!important}
  .ay-lien-trait{transform:none!important;opacity:1!important}
}
`;
