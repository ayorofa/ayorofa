import { ETAPES } from '@/data/accueil';
import { IcRechercher, IcComparer, IcContacter, IcChoisir } from '@/components/accueil/Icones';

const ICONES = [IcRechercher, IcComparer, IcContacter, IcChoisir];

/* §10 — Comment ça marche ? */
export default function CommentCaMarche() {
  return (
    <section className="ay-sec" id="comment-ca-marche" aria-labelledby="ay-etapes-t">
      <div className="ay-cadre">
        <div className="ay-sec-tete ay-sec-tete-centre">
          <div>
            <p className="ay-oeil">Le parcours</p>
            <h2 id="ay-etapes-t" className="ay-h2">Comment ça marche ?</h2>
          </div>
        </div>

        <ol className="ay-etapes">
          {ETAPES.map(([n, titre, texte], k) => {
            const Icone = ICONES[k];
            return (
              <li key={n} className="ay-etape">
                <span className="ay-etape-ic"><Icone taille={24} /></span>
                <span className="ay-etape-n">{n}</span>
                <h3 className="ay-etape-t">{titre}</h3>
                <p className="ay-etape-d">{texte}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
