'use client';
import { useId, useState } from 'react';
import { useRouter } from 'next/navigation';
import { METIERS } from '@/data/metiers';
import { VILLES } from '@/data/villes';
import { PHOTOS } from '@/data/accueil';
import { poserBrouillon } from '@/lib/brouillonBesoin';
import { IcPhoto, IcFleche } from '@/components/accueil/Icones';
import PanneauMarque from '@/components/accueil/PanneauMarque';

/* §08 — Publier un besoin.
   Ce bloc ne crée aucune logique nouvelle : il prépare le
   formulaire de publication déjà en place et l'ouvre rempli. */
export default function PublierBesoin() {
  const router = useRouter();
  const [f, setF] = useState({ metier: '', ville: '', description: '' });
  const [fichier, setFichier] = useState(null);
  const idM = useId(); const idV = useId(); const idD = useId(); const idP = useId();
  const photo = PHOTOS.projet;

  const on = (e) => setF({ ...f, [e.target.name]: e.target.value });

  const envoyer = (e) => {
    e.preventDefault();
    poserBrouillon({ type: 'demande', metier: f.metier, ville: f.ville, description: f.description.trim() }, fichier);
    router.push('/publier');
  };

  return (
    <section className="ay-projet" aria-labelledby="ay-projet-t">
      <div className="ay-cadre ay-projet-in">
        <div className="ay-projet-texte">
          <p className="ay-oeil ay-oeil-clair">Publier un besoin</p>
          <h2 id="ay-projet-t" className="ay-h2 ay-h2-clair">Vous avez un projet ?</h2>
          <p className="ay-sous ay-sous-clair">
            Décrivez votre besoin et recevez des propositions de professionnels qualifiés.
          </p>

          <form className="ay-form" onSubmit={envoyer}>
            <div className="ay-form-duo">
              <label htmlFor={idM}>De quoi avez-vous besoin ?
                <select id={idM} name="metier" value={f.metier} onChange={on} required>
                  <option value="">Choisissez un métier…</option>
                  {METIERS.map((m) => <option key={m.slug} value={m.slug}>{m.name}</option>)}
                </select>
              </label>
              <label htmlFor={idV}>Où ?
                <select id={idV} name="ville" value={f.ville} onChange={on}>
                  <option value="">Toute la Côte d’Ivoire</option>
                  {VILLES.filter((v) => v !== 'Autre localité').map((v) => <option key={v} value={v}>{v}</option>)}
                </select>
              </label>
            </div>

            <label htmlFor={idD}>Décrivez votre besoin
              <textarea id={idD} name="description" value={f.description} onChange={on} rows={3}
                placeholder="Ex. : Je cherche un plombier pour réparer une fuite sous l’évier, à Cocody." />
            </label>

            <div className="ay-form-photo">
              <label htmlFor={idP} className="ay-btn ay-btn-fichier">
                <IcPhoto taille={18} /> {fichier ? 'Photo choisie' : 'Ajouter une photo (facultatif)'}
              </label>
              <input id={idP} type="file" accept="image/*" className="ay-visuellement-cache"
                onChange={(e) => setFichier((e.target.files && e.target.files[0]) || null)} />
              <span className="ay-form-photo-nom">
                {fichier ? fichier.name : 'Aucun fichier choisi'}
              </span>
              {fichier && (
                <button type="button" className="ay-form-photo-x" onClick={() => setFichier(null)}
                  aria-label="Retirer la photo">✕</button>
              )}
            </div>

            <button type="submit" className="ay-btn ay-btn-or ay-btn-plein">
              Recevoir des propositions <IcFleche taille={18} />
            </button>
            <p className="ay-form-note">
              Vous serez invité à vous connecter avant l’envoi. La publication d’un besoin est gratuite.
            </p>
          </form>
        </div>

        <div className="ay-projet-visuel" aria-hidden={!(photo && photo.src)}>
          {photo && photo.src
            ? <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" />
            : <PanneauMarque />}
        </div>
      </div>
    </section>
  );
}
