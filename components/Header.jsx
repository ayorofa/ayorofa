import Link from 'next/link';
import UserNav from '@/components/UserNav';
export default function Header() {
  return (
    <header className="hdr">
      <div className="wrap hdr-in">
        <Link href="/" className="brand"><span className="brand-mark">▲</span> Ayôrôfa <b>Connect</b></Link>
        <nav className="nav">
          <Link href="/annuaire">Annuaire</Link>
          <Link href="/besoins">Besoins</Link>
          <Link href="/publier">Publier</Link>
          <Link href="/recherche">Recherche</Link>
          <UserNav />
          <Link href="/devis" className="btn btn-sm">Demander un devis</Link>
        </nav>
      </div>
    </header>
  );
}
