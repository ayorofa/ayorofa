import Link from 'next/link';
export default function Header() {
  return (
    <header className="hdr">
      <div className="wrap hdr-in">
        <Link href="/" className="brand"><span className="brand-mark">▲</span> Ayôrôfa <b>BTP</b></Link>
        <nav className="nav">
          <Link href="/annuaire">Annuaire</Link>
          <Link href="/guides">Guides</Link>
          <Link href="/besoins">Besoins</Link>
          <Link href="/publier">Publier</Link>
          <Link href="/espace">Mon espace</Link>
          <Link href="/devis" className="btn btn-sm">Demander un devis</Link>
        </nav>
      </div>
    </header>
  );
}
