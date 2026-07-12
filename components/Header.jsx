'use client';
import { useState } from 'react';
import Link from 'next/link';
import UserNav from '@/components/UserNav';

export default function Header() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <header className="hdr">
      <div className="wrap hdr-in">
        <Link href="/" className="brand" onClick={close}>
          <span className="brand-mark" aria-hidden="true">▲</span> Ayôrôfa <b>Connect</b>
        </Link>

        {/* Desktop */}
        <nav className="nav nav-d">
          <Link href="/annuaire">Annuaire</Link>
          <Link href="/besoins">Besoins</Link>
          <Link href="/recherche">Recherche</Link>
          <Link href="/publier">Publier</Link>
          <UserNav />
          <Link href="/devis" className="btn btn-sm">Demander un devis</Link>
        </nav>

        {/* Mobile : bouton menu */}
        <button className="burger" aria-label="Ouvrir le menu" aria-expanded={open} onClick={() => setOpen(!open)}>
          <span /><span /><span />
        </button>
      </div>

      {open && <div className="sheet-bg" onClick={close} />}
      <div className={'sheet' + (open ? ' open' : '')} role="dialog" aria-label="Menu">
        <Link href="/annuaire" onClick={close}>Annuaire des pros</Link>
        <Link href="/recherche" onClick={close}>Recherche</Link>
        <Link href="/guides" onClick={close}>Guides</Link>
        <Link href="/devis" onClick={close}>Demander un devis</Link>
        <Link href="/espace" onClick={close}>Mon espace</Link>
        <Link href="/confidentialite" onClick={close} className="sheet-sm">Confidentialité</Link>
      </div>
    </header>
  );
}
