import Link from 'next/link';
import Logo from '@/components/Logo';

export default function Footer() {
  return (
    <footer className="ftr">
      <div className="wrap ftr-in">
        <div>
          <div className="brand">
            <span className="brand-logo"><Logo size={26} /></span>
            Ayôrôfa <b>Connect</b>
          </div>
          <p className="muted">La mise en relation professionnelle en Côte d’Ivoire — par Ayôrôfa.</p>
        </div>
        <nav className="ftr-nav">
          <Link href="/annuaire">Annuaire</Link>
          <Link href="/besoins">Besoins</Link>
          <Link href="/abonnements">Nos formules</Link>
          <Link href="/guides">Guides</Link>
          <Link href="/confidentialite">Confidentialité</Link>
        </nav>
      </div>
      <div className="wrap ftr-copy">© {new Date().getFullYear()} Ayôrôfa Connect — Abidjan, Côte d’Ivoire</div>
    </footer>
  );
}
