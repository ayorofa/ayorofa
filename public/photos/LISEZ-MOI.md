# Photographies de la page d'accueil

La provenance et la licence de chaque photo sont consignées dans
`CREDITS.md`, à côté de ce fichier. N'ajoutez ici que des images dont la
licence autorise l'usage commercial, et renseignez-les dans `CREDITS.md`.

## État actuel

| Emplacement | Fichier | Statut |
|---|---|---|
| Hero | `hero-abidjan.webp` | en service |
| « Vous avez un projet ? » | — | décor dessiné |
| « Vous êtes professionnel ? » | — | décor dessiné |

Tant qu'un emplacement reste à `null` dans `data/accueil.js`, la section
affiche son panneau de marque dessiné. La page est complète et rapide en
l'état — il n'y a ni image cassée ni emplacement vide.

## Ajouter vos visuels

1. Déposez vos fichiers ici, par exemple :
   - `hero-abidjan.webp`
   - `projet.webp`
   - `professionnel.webp`
2. Renseignez leur chemin dans `data/accueil.js` :

```js
export const PHOTOS = {
  hero: { src: '/photos/hero-abidjan.webp', alt: 'Un électricien sur un chantier à Abidjan' },
  projet: { src: '/photos/projet.webp', alt: 'Une cliente décrit son besoin depuis son téléphone' },
  professionnel: { src: '/photos/professionnel.webp', alt: 'Un menuisier dans son atelier' },
};
```

Le texte `alt` est obligatoire : il sert aux lecteurs d'écran et au
référencement. Décrivez la scène, pas la marque.

## Sources autorisées

- photographies originales commandées par Ayôrôfa ;
- photographies sous licence couvrant l'usage commercial ;
- images produites pour Ayôrôfa.

## Ce qu'il faut éviter

- une image trouvée sur un moteur de recherche ;
- une photo appartenant à une entreprise ou à un photographe sans licence ;
- l'esthétique « banque d'images corporate » : privilégiez des scènes
  réelles — atelier, chantier, boutique, bureau, rue d'Abidjan.

## Format

WebP ou AVIF. Largeur ≤ 1600 px pour le hero, ≤ 800 px pour les blocs,
poids ≤ 250 Ko. Les images des blocs sont chargées en différé
(`loading="lazy"`) ; celle du hero est prioritaire.
