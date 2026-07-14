export const metadata = {
  title: 'Politique de confidentialité',
  description: 'Comment Ayôrôfa Connect collecte, utilise et protège vos données personnelles.',
};

const S = ({ t, children }) => (
  <div className="card" style={{ marginTop: 14 }}>
    <h2 style={{ fontSize: '1.05rem', margin: 0 }}>{t}</h2>
    <div style={{ marginTop: 8 }}>{children}</div>
  </div>
);

export default function Confidentialite() {
  return (
    <main className="sec"><div className="wrap" style={{ maxWidth: 720 }}>
      <p className="eyebrow">Juridique</p>
      <h1>Politique de confidentialité</h1>
      <p className="muted sm">Dernière mise à jour : juillet 2026 — conforme à la loi ivoirienne n° 2013-450 relative
      à la protection des données à caractère personnel.</p>

      <S t="1. Qui est responsable de vos données ?">
        <p>Ayôrôfa, Abidjan, Côte d’Ivoire — contact@ayorofa.com. Ayôrôfa Connect s’engage à traiter vos données de
        manière loyale, transparente et sécurisée.</p>
      </S>

      <S t="2. Quelles données collectons-nous ?">
        <p><strong>Données de compte</strong> : nom, adresse e-mail, mot de passe (chiffré, jamais lisible), type de
        profil, ville, centres d’intérêt, biographie, photos de profil et de couverture.<br />
        <strong>Contenus</strong> : annonces, publications, commentaires, réactions, photos et vidéos que vous publiez,
        messages privés (accessibles uniquement à vous et à votre destinataire).<br />
        <strong>Données d’usage</strong> : date de dernière activité (statut « en ligne »), signalements, et mesures
        d’audience anonymisées (Google Analytics) si vous acceptez les cookies.<br />
        <strong>Paiements</strong> : référence et montant des transactions d’abonnement. Aucune donnée bancaire n’est
        stockée par Ayôrôfa : les paiements Mobile Money sont traités par les opérateurs et, à terme, par CinetPay.</p>
      </S>

      <S t="3. Pourquoi ?">
        <p>Fournir le service (profils, mise en relation, messagerie, notifications), assurer la sécurité et la
        modération, gérer les abonnements, mesurer l’audience et améliorer la plateforme, répondre aux obligations
        légales. Nous ne vendons jamais vos données. Aucune donnée n’est transmise à des tiers à des fins
        commerciales sans votre accord.</p>
      </S>

      <S t="4. Qui voit quoi ?">
        <p>Votre profil (nom, photo, ville, centres d’intérêt, statistiques publiques) et vos publications sont
        visibles des autres utilisateurs. Vos messages privés ne sont visibles que de vos interlocuteurs. Votre e-mail
        et votre téléphone ne sont jamais affichés publiquement, sauf si vous les indiquez vous-même dans un contenu.</p>
      </S>

      <S t="5. Où et combien de temps ?">
        <p>Les données sont hébergées sur des infrastructures sécurisées (Supabase / Vercel) et protégées par
        chiffrement des connexions (HTTPS) et règles d’accès strictes. Elles sont conservées tant que votre compte est
        actif, puis supprimées ou anonymisées dans un délai raisonnable après la suppression du compte, hors
        obligations légales de conservation.</p>
      </S>

      <S t="6. Cookies">
        <p>La plateforme utilise des cookies techniques nécessaires au fonctionnement (session de connexion) et, avec
        votre consentement, des cookies de mesure d’audience (Google Analytics). Vous pouvez refuser ces derniers via
        le bandeau de consentement.</p>
      </S>

      <S t="7. Vos droits">
        <p>Conformément à la loi n° 2013-450, vous disposez d’un droit d’accès, de rectification, de suppression et
        d’opposition sur vos données. Vous pouvez exercer ces droits en écrivant à
        <strong> contact@ayorofa.com</strong> (réponse sous 30 jours au plus). Vous pouvez modifier vous-même la
        plupart de vos informations depuis votre profil. En cas de difficulté, vous pouvez saisir l’ARTCI, autorité
        ivoirienne de protection des données personnelles.</p>
      </S>

      <S t="8. Mineurs">
        <p>La plateforme est réservée aux personnes d’au moins 16 ans.</p>
      </S>

      <S t="9. Évolution">
        <p>Cette politique peut évoluer avec la plateforme ; la date de mise à jour figure en haut de page et toute
        modification substantielle sera signalée sur la plateforme.</p>
      </S>
    </div></main>
  );
}
