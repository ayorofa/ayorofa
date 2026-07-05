import DevisForm from '@/components/DevisForm';
import { proBySlug } from '@/data/pros';
export const metadata = { title: 'Demander un devis gratuit' };
export default function DevisPage({ searchParams }) {
  const pro = proBySlug(searchParams?.pro || '');
  return (
    <main className="sec">
      <div className="wrap" style={{ maxWidth: 720 }}>
        <p className="eyebrow">Devis gratuit</p>
        <h1>Décrivez votre chantier</h1>
        <p className="muted" style={{ marginBottom: 22 }}>C’est gratuit et sans engagement. Un professionnel vous recontacte rapidement.</p>
        <DevisForm presetMetier={searchParams?.metier || ''} presetPro={pro ? pro.nom : ''} />
      </div>
    </main>
  );
}
