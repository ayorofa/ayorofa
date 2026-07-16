'use client';
import { useState } from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';
import UserNav from '@/components/UserNav';
import IconMessages from '@/components/IconMessages';
import BoutonTheme from '@/components/BoutonTheme';

export default function Header() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <header className="hdr">
      <div className="wrap hdr-in">
        <Link href="/" className="brand" onClick={close}>
          <span className="brand-logo"><Logo size={28} /></span>
          Ayôrôfa <b>Connect</b>
        </Link>

        <nav className="nav nav-d">
          <Link href="/membres">Membres</Link>
          <Link href="/besoins">Besoins</Link>
          <Link href="/recherche">Recherche</Link>
          <Link href="/abonnements">Formules</Link>
          <UserNav />
          <Link href="/publier" className="btn btn-sm">Publier</Link>
        </nav>

        <div className="hdr-actions">
          <BoutonTheme />
          <IconMessages />
          <button className="burger" aria-label="Ouvrir le menu" aria-expanded={open} onClick={() => setOpen(!open)}>
          <span /><span /><span />
          </button>
        </div>
      </div>

      {open && <div className="sheet-bg" onClick={close} />}
      <div className={'sheet' + (open ? ' open' : '')} role="dialog" aria-label="Menu">
        <Link href="/membres" onClick={close}>Membres de la communauté</Link>
        <Link href="/annuaire" onClick={close}>Annuaire des pros</Link>
        <Link href="/recherche" onClick={close}>Recherche</Link>
        <Link href="/a-propos" onClick={close}>À propos</Link>
        <Link href="/abonnements" onClick={close}>Nos formules</Link>
        <Link href="/guides" onClick={close}>Guides</Link>
        <Link href="/devis" onClick={close}>Demander un devis</Link>
        <Link href="/espace" onClick={close}>Mon espace</Link>
        <Link href="/confidentialite" onClick={close} className="sheet-sm">Confidentialité</Link>
      </div>
    </header>
  );
}
