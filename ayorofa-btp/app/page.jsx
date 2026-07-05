import Link from 'next/link';
import SearchBar from '@/components/SearchBar';
import ProCard from '@/components/ProCard';
import SponsorBanner from '@/components/SponsorBanner';
import { METIERS } from '@/data/metiers';
import { PROS } from '@/data/pros';

export default function Home() {
  const vedettes = PROS.filter((p) => p.verifie).slice(0, 6);
  return (
    <>
      <section className="hero">
        <div className="wrap">
          <h1>Trouvez un pro du BTP & de l’échafaudage en Côte d’Ivoire</h1>
          <p>Décrivez votre besoin, comparez des professionnels vérifiés près de chez vous et recevez des devis — gratuitement.</p>
          <SearchBar />
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <p className="eyebrow">Nos métiers</p>
          <h2>Que recherchez-vous ?</h2>
          <div className="grid g4" style={{ marginTop: 22 }}>
            {METIERS.map((m) => (
              <Link key={m.slug} href={`/annuaire?metier=${m.slug}`} className="card metier-card">
                <h3>{m.name}</h3>
                <p className="muted sm">{m.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap"><SponsorBanner slot="home" /></div>
      </section>

      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <p className="eyebrow">Pros vérifiés</p>
          <h2>Professionnels en vedette</h2>
          <div className="grid g3" style={{ marginTop: 22 }}>
            {vedettes.map((p) => <ProCard key={p.slug} pro={p} />)}
          </div>
        </div>
      </section>

      <section className="sec" style={{ background: '#fff', borderTop: '1px solid var(--line)' }}>
        <div className="wrap">
          <p className="eyebrow">Comment ça marche</p>
          <h2>Simple, rapide, gratuit</h2>
          <div className="grid g3 steps" style={{ marginTop: 30 }}>
            <div className="step"><h3>Décrivez</h3><p className="muted">Indiquez votre métier, votre ville et votre besoin.</p></div>
            <div className="step"><h3>Comparez</h3><p className="muted">Recevez des devis de pros vérifiés près de chez vous.</p></div>
            <div className="step"><h3>Choisissez</h3><p className="muted">Sélectionnez le bon pro et lancez votre chantier.</p></div>
          </div>
          <div style={{ marginTop: 32 }}><Link href="/devis" className="btn">Demander un devis gratuit</Link></div>
        </div>
      </section>
    </>
  );
}
