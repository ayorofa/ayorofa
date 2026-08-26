# Photographies de la page d'accueil

Ce dossier est **volontairement vide**. Le cahier des charges interdit
d'utiliser une image récupérée au hasard ou appartenant à un tiers sans
licence : aucune photo n'est donc livrée avec le code.

Tant qu'aucune photo n'est fournie, la page d'accueil affiche son décor
dessiné (silhouette urbaine dans le hero, panneau de marque dans les deux
grands blocs). La page est complète et rapide en l'état — il n'y a pas
d'image cassée ni d'emplacement vide.

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
