import SearchBar from '@/components/SearchBar';
import ProCard from '@/components/ProCard';
import SponsorBanner from '@/components/SponsorBanner';
import { AdSlot } from '@/components/AdSense';
import { PROS } from '@/data/pros';
import { metierBySlug } from '@/data/metiers';

export function generateMetadata({ searchParams }) {
  const m = metierBySlug(searchParams?.metier);
  const ville = searchParams?.ville;
  const label = [m ? m.name : 'BTP & échafaudage', ville ? `à ${ville}` : 'en Côte d’Ivoire'].join(' ');
  return { title: `${label} — Annuaire des pros`, description: `Trouvez un professionnel ${label}. Devis rapides, pros vérifiés.` };
}

export default function Annuaire({ searchParams }) {
  const metier = searchParams?.metier || '';
  const ville = searchParams?.ville || '';
  const results = PROS.filter((p) => (!metier || p.metier === metier) && (!ville || p.ville === ville));
  const m = metierBySlug(metier);
  const titre = m ? m.name : 'Tous les métiers';
  return (
    <main className="sec">
      <div className="wrap">
        <p className="eyebrow">Annuaire</p>
        <h1>{titre}{ville ? ` à ${ville}` : ''}</h1>
        <p className="muted">{results.length} professionnel(s) trouvé(s).</p>
        <div style={{ margin: '22px 0 10px' }}><SearchBar metier={metier} ville={ville} /></div>
        <div style={{ margin: '18px 0' }}><SponsorBanner slot="listing" /></div>
        {results.length ? (
          <div className="grid g3">{results.map((p) => <ProCard key={p.slug} pro={p} />)}</div>
        ) : (
          <div className="card">Aucun pro pour ces critères. <a href="/annuaire">Voir tous les pros</a>.</div>
        )}
        <div style={{ marginTop: 26 }}><AdSlot slot="0000000000" /></div>
      </div>
    </main>
  );
}
