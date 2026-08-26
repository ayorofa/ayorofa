import { FAQ } from '@/data/accueil';

/* Questions fréquentes — reprises de l'ancienne page d'accueil.
   Elles sont conservées telles quelles : elles alimentent la
   donnée structurée FAQPage déjà indexée (§22 : aucune
   régression SEO). */
export default function Questions() {
  return (
    <section className="ay-sec" id="faq" aria-labelledby="ay-faq-t">
      <div className="ay-cadre ay-cadre-etroit">
        <div className="ay-sec-tete ay-sec-tete-centre">
          <div>
            <p className="ay-oeil">Questions fréquentes</p>
            <h2 id="ay-faq-t" className="ay-h2">Ce qu’on nous demande le plus</h2>
          </div>
        </div>

        <div className="ay-faq">
          {FAQ.map(([q, r]) => (
            <details key={q} className="ay-q">
              <summary>{q}</summary>
              <p>{r}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
