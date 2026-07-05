import { METIERS } from '@/data/metiers';
import { VILLES } from '@/data/villes';
// Formulaire GET natif -> /annuaire?metier=&ville= (indexable, sans JS).
export default function SearchBar({ metier = '', ville = '' }) {
  return (
    <form className="search" action="/annuaire" method="get">
      <select name="metier" defaultValue={metier} aria-label="Métier">
        <option value="">Tous les métiers</option>
        {METIERS.map((m) => <option key={m.slug} value={m.slug}>{m.name}</option>)}
      </select>
      <select name="ville" defaultValue={ville} aria-label="Ville">
        <option value="">Toute la ville</option>
        {VILLES.map((v) => <option key={v} value={v}>{v}</option>)}
      </select>
      <button className="btn" type="submit">Rechercher</button>
    </form>
  );
}
