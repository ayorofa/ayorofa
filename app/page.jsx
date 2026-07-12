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
          <p className="eyebrow" style={{ color: 'var(--gold-l)' }}>La plateforme de mise en relation</p>
          <h1>Un besoin d’un côté. Un talent de l’autre.<br />Ayôrôfa Connect les réunit.</h1>
          <p>
            Entreprises, particuliers, chercheurs d’emploi : publiez, échangez et trouvez la bonne
            personne — en direct, partout en Côte d’Ivoire.
          </p>
          <SearchBar />
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 16 }}>
            <Link href="/inscription" className="btn">Créer mon compte — gratuit</Link>
            <Link href="/besoins" className="btn" style={{ background: 'transparent', border: '1.5px solid rgba(242,236,221,.35)', color: 'var(--ivoire)' }}>
              Voir le fil en direct
            </Link>
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <p className="eyebrow">Nos métiers</p>
          <h2>Que recherchez-vous ?</h2>
          <div className="grid g4" style={{ marginTop: 18 }}>
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
          <div className="grid g3" style={{ marginTop: 18 }}>
            {vedettes.map((p) => <ProCard key={p.slug} pro={p} />)}
          </div>
        </div>
      </section>

      <section className="sec" style={{ background: '#fff', borderTop: '1px solid var(--line)' }}>
        <div className="wrap">
          <p className="eyebrow">Comment ça marche</p>
          <h2>Simple, rapide, gratuit</h2>
          <div className="grid g3 steps" style={{ marginTop: 26 }}>
            <div className="step"><h3>Publiez</h3><p className="muted">Un besoin, une offre ou votre recherche — en 2 minutes.</p></div>
            <div className="step"><h3>Recevez</h3><p className="muted">Des propositions et des contacts, en temps réel.</p></div>
            <div className="step"><h3>Choisissez</h3><p className="muted">Discutez par messagerie et concluez en confiance.</p></div>
          </div>
          <div style={{ marginTop: 28, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link href="/inscription" className="btn">Rejoindre la communauté</Link>
            <Link href="/abonnements" className="btn" style={{ background: 'transparent', border: '1.5px solid var(--line)', color: 'var(--text)' }}>Voir les formules</Link>
          </div>
        </div>
      </section>
    </>
  );
}
