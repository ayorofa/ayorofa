import Link from 'next/link';
export default function Footer() {
  return (
    <footer className="ftr">
      <div className="wrap ftr-in">
        <div>
          <div className="brand"><span className="brand-mark">▲</span> Ayôrôfa <b>BTP</b></div>
          <p className="muted">La mise en relation BTP & échafaudage en Côte d’Ivoire.</p>
        </div>
        <nav className="ftr-nav">
          <Link href="/annuaire">Annuaire</Link>
          <Link href="/guides">Guides</Link>
          <Link href="/devis">Demander un devis</Link>
          <Link href="/confidentialite">Confidentialité</Link>
        </nav>
      </div>
      <div className="wrap ftr-copy">© {new Date().getFullYear()} Ayôrôfa BTP — Abidjan, Côte d’Ivoire</div>
    </footer>
  );
}
