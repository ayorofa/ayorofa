// Bannière sponsor — remplace le contenu par tes vrais partenaires quand tu en as.
export default function SponsorBanner({ slot = 'home' }) {
  return (
    <div className="sponsor" aria-label="Espace sponsorisé">
      <span className="sponsor-tag">SPONSORISÉ</span>
      <span>Votre entreprise ici ? Devenez partenaire d’Ayôrôfa Connect — contact@ayorofa.com</span>
    </div>
  );
}
