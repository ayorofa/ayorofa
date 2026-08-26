'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from '@/components/Logo';
import UserNav from '@/components/UserNav';
import IconMessages from '@/components/IconMessages';
import BoutonTheme from '@/components/BoutonTheme';
import SonNotif from '@/components/SonNotif';
import Sentinelle from '@/components/Sentinelle';

/* Navigation principale (§01 du cahier des charges).
   Chaque entrée mène à une page qui existe déjà : rien n'est
   promis que l'application ne sache tenir. */
const NAV = [
  { href: '/', label: 'Accueil' },
  { href: '/membres', label: 'Trouver un professionnel' },
  { href: '/besoins', label: 'Opportunités' },
  { href: '/#comment-ca-marche', label: 'Comment ça marche ?' },
  { href: '/a-propos', label: 'À propos' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const close = () => setOpen(false);
  const actif = (href) =>
    href === '/' ? pathname === '/' : href.startsWith('/#') ? false : pathname.startsWith(href);

  return (
    <header className="hdr">
      <div className="wrap hdr-in">
        <Link href="/" className="brand" onClick={close} aria-label="Ayôrôfa Connect — accueil">
          <span className="brand-logo"><Logo size={30} /></span>
          <span className="brand-mots">
            Ayôrôfa <b>Connect</b>
            <em>la maison du savoir</em>
          </span>
        </Link>

        <nav className="nav nav-d" aria-label="Navigation principale">
          {NAV.map((l) => (
            <Link key={l.href} href={l.href} className={actif(l.href) ? 'nav-on' : undefined}
              aria-current={actif(l.href) ? 'page' : undefined}>
              {l.label}
            </Link>
          ))}
          <UserNav />
        </nav>

        <div className="hdr-actions">
          <Sentinelle />
          <SonNotif />
          <BoutonTheme />
          <IconMessages />
          <button className="burger" aria-label="Ouvrir le menu" aria-expanded={open} onClick={() => setOpen(!open)}>
            <span /><span /><span />
          </button>
        </div>
      </div>

      {open && <div className="sheet-bg" onClick={close} />}
      <div className={'sheet' + (open ? ' open' : '')} role="dialog" aria-label="Menu">
        {NAV.map((l) => (
          <Link key={l.href} href={l.href} onClick={close}>{l.label}</Link>
        ))}
        <Link href="/publier" onClick={close}>Publier un besoin</Link>
        <Link href="/annuaire" onClick={close}>Annuaire des pros</Link>
        <Link href="/recherche" onClick={close}>Recherche</Link>
        <Link href="/abonnements" onClick={close}>Nos formules</Link>
        <Link href="/guides" onClick={close}>Guides</Link>
        <Link href="/devis" onClick={close}>Demander un devis</Link>
        <Link href="/notifications" onClick={close}>Notifications</Link>
        <Link href="/espace" onClick={close}>Mon espace</Link>
        <Link href="/confidentialite" onClick={close} className="sheet-sm">Confidentialité</Link>
      </div>
    </header>
  );
}
