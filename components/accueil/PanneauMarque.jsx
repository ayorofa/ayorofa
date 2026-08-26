import { Temple } from '@/components/accueil/Icones';

/* Panneau de marque affiché tant qu'aucune photo sous licence n'est
   fournie (voir data/accueil.js). L'emblème de la maison, en creux :
   c'est un décor assumé, pas une image manquante. */
export default function PanneauMarque({ variante = '' }) {
  return (
    <span className={'ay-motif ' + variante} aria-hidden="true">
      <span className="ay-motif-emblem"><Temple taille={72} /></span>
      <span className="ay-motif-mots">Ayôrôfa<em>la maison du savoir</em></span>
    </span>
  );
}
