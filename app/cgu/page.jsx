import Link from 'next/link';

export const metadata = {
  title: "Conditions générales d'utilisation",
  description: "Les règles d'utilisation de la plateforme Ayôrôfa Connect.",
};

const S = ({ t, children }) => (
  <div className="card" style={{ marginTop: 14 }}>
    <h2 style={{ fontSize: '1.05rem', margin: 0 }}>{t}</h2>
    <div style={{ marginTop: 8 }}>{children}</div>
  </div>
);

export default function CGU() {
  return (
    <main className="sec"><div className="wrap" style={{ maxWidth: 720 }}>
      <p className="eyebrow">Juridique</p>
      <h1>Conditions générales d’utilisation</h1>
      <p className="muted sm">Dernière mise à jour : juillet 2026</p>

      <S t="1. Objet">
        <p>Ayôrôfa Connect (« la Plateforme »), accessible sur connect.ayorofa.com, est un service de mise en relation
        professionnelle édité par Ayôrôfa (Abidjan, Côte d’Ivoire). Elle permet aux entreprises, particuliers et
        chercheurs d’emploi de publier des annonces, d’échanger et de constituer un réseau professionnel.
        En créant un compte ou en utilisant la Plateforme, vous acceptez les présentes conditions.</p>
      </S>

      <S t="2. Inscription et compte">
        <p>L’inscription est gratuite et réservée aux personnes âgées d’au moins 16 ans. Vous vous engagez à fournir
        des informations exactes (identité, activité, coordonnées) et à les maintenir à jour. Vous êtes responsable
        de la confidentialité de votre mot de passe et de toute activité réalisée depuis votre compte.
        Un seul compte par personne ou entreprise.</p>
      </S>

      <S t="3. Contenu publié par les membres">
        <p>Chaque membre est <strong>seul responsable</strong> des contenus qu’il publie (annonces, publications,
        commentaires, messages, photos, vidéos). En publiant, vous garantissez détenir les droits nécessaires sur ces
        contenus et vous accordez à Ayôrôfa Connect une licence non exclusive et gratuite de les héberger, afficher et
        diffuser sur la Plateforme, dans le seul but de fournir le service.</p>
        <p>Sont interdits notamment : les contenus faux ou trompeurs, les arnaques, les contenus contrefaisants
        (photos, textes ou marques appartenant à autrui), les contenus haineux, diffamatoires, violents ou à caractère
        sexuel, le spam et le démarchage abusif, l’usurpation d’identité.</p>
      </S>

      <S t="4. Modération">
        <p>Ayôrôfa Connect met à disposition un bouton de signalement sur les contenus. La Plateforme peut, sans
        préavis, retirer tout contenu contraire aux présentes conditions et suspendre ou supprimer le compte d’un
        membre en cas de manquement, notamment en cas de fraude, d’arnaque ou de récidive. Des limites anti-spam
        (nombre de publications par jour) peuvent s’appliquer.</p>
      </S>

      <S t="5. Rôle de la Plateforme">
        <p>Ayôrôfa Connect est un <strong>outil de mise en relation</strong>. La Plateforme n’est pas partie aux
        échanges, devis, contrats, prestations ou paiements conclus entre membres, et ne garantit ni la qualité des
        prestations, ni la solvabilité, ni l’exactitude des profils. Le badge « Vérifié » atteste de vérifications
        effectuées par nos soins à la date de délivrance, sans constituer une garantie. Il appartient à chaque membre
        de faire preuve de vigilance avant de s’engager.</p>
      </S>

      <S t="6. Services payants">
        <p>Certaines options sont payantes (plans Pro et Vérifié, mises en avant, espaces sponsorisés). Les prix sont
        indiqués en francs CFA sur la page Formules. Les abonnements sont valables pour la durée indiquée et ne sont
        pas remboursables une fois le service activé, sauf disposition légale contraire. Ayôrôfa peut faire évoluer
        ses offres et tarifs pour l’avenir.</p>
      </S>

      <S t="7. Propriété intellectuelle">
        <p>La Plateforme, son nom, son logo, sa charte graphique, ses textes et son code sont la propriété d’Ayôrôfa.
        Toute reproduction, extraction ou réutilisation non autorisée est interdite. Les contenus publiés par les
        membres restent leur propriété, sous réserve de la licence prévue à l’article 3.</p>
      </S>

      <S t="8. Données personnelles">
        <p>Le traitement de vos données est décrit dans la <Link href="/confidentialite">Politique de
        confidentialité</Link>, conformément à la loi ivoirienne n° 2013-450 relative à la protection des données à
        caractère personnel.</p>
      </S>

      <S t="9. Responsabilité et disponibilité">
        <p>La Plateforme est fournie « en l’état ». Ayôrôfa s’efforce d’assurer un service continu et sécurisé, sans
        pouvoir garantir l’absence d’interruptions, d’erreurs ou de pertes de données. Dans les limites permises par
        la loi, la responsabilité d’Ayôrôfa ne saurait être engagée pour les dommages indirects résultant de
        l’utilisation de la Plateforme ou des relations entre membres.</p>
      </S>

      <S t="10. Résiliation">
        <p>Vous pouvez supprimer votre compte à tout moment en nous contactant. Ayôrôfa peut suspendre ou clôturer un
        compte en cas de violation des présentes conditions. Les articles 3, 5, 7 et 9 survivent à la clôture.</p>
      </S>

      <S t="11. Droit applicable">
        <p>Les présentes conditions sont régies par le droit ivoirien. Tout litige sera soumis, à défaut d’accord
        amiable, aux juridictions compétentes d’Abidjan.</p>
        <p className="muted sm">Contact : contact@ayorofa.com — Ayôrôfa, Abidjan, Côte d’Ivoire.</p>
      </S>
    </div></main>
  );
}
