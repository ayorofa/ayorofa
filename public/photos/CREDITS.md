# Crédits photographiques — page d'accueil

Toutes les photographies proviennent de **Pexels**, dont la licence autorise
l'usage commercial sans attribution obligatoire. La provenance est tout de
même consignée ici : si la question se pose un jour, la traçabilité protège
Ayôrôfa.

Les identifiants ci-dessous permettent de retrouver chaque photo à l'adresse
`https://www.pexels.com/photo/<identifiant>/`.

## En service

| Fichier | Emplacement | Source | Photographe | Identifiant |
|---|---|---|---|---|
| `hero-abidjan.webp` | Hero | Pexels | silveremeya | 7381782 |
| `projet.webp` | « Vous avez un projet ? » | Pexels | god-picture | 14470155 |
| `professionnel.webp` | « Vous êtes professionnel ? » | Pexels | bigshowlamar | 18651249 |

Traitements appliqués :

- `hero-abidjan.webp` — redimensionnée à 1500 px de large, très légèrement
  adoucie (le voile sombre du hero masque le détail fin), WebP qualité 70
  → 212 Ko. Originale : 4000 × 3000 px.
- `projet.webp` — recadrée en 4:3 sur la cliente (l'originale est en format
  portrait), 1000 px de large, WebP qualité 76 → 102 Ko.
  Originale : 1944 × 2750 px.
- `professionnel.webp` — recadrée en 4:3 sur l'artisan, 1000 px de large,
  WebP qualité 76 → 98 Ko. Originale : 4000 × 5600 px.

Note sur le recadrage de `professionnel.webp` : la source est en portrait,
et un cadre 4:3 ne peut couvrir que 53 % de sa hauteur. Il fallait choisir
entre le visage de l'artisan et la meuleuse avec ses étincelles ; le bloc
s'adressant aux professionnels eux-mêmes, c'est la personne qui a été
retenue.

## Disponible, non utilisée

| Fichier | Source | Photographe | Identifiant |
|---|---|---|---|
| `hero-chantier.webp` | Pexels | thisvikto | 10202856 |

Deux ferrailleurs sur un chantier. C'est l'alternative au hero actuel : elle
met en avant les personnes plutôt que la ville. Pour l'utiliser, remplacez
le chemin dans `data/accueil.js` par `/photos/hero-chantier.webp` et adaptez
le texte alternatif. Aucune autre modification n'est nécessaire.

## À vérifier

La localisation de `hero-abidjan.webp` n'a pas pu être confirmée depuis
l'environnement de développement : la page Pexels d'origine n'y est pas
joignable. La lagune, la trame urbaine et la ligne d'immeubles au loin
correspondent à Abidjan, mais **cela reste à confirmer sur la page du
photographe**. Si la photo vient d'une autre ville, il faut basculer sur
`hero-chantier.webp`, qui ne revendique aucune géographie.

## Non retenues

Proposées pour le hero, écartées pour cause de format portrait :
`pexels-kindelmedia-8488005`, `pexels-kgstudios-36520424`,
`pexels-sinalmultimedia-30188152`.

`pexels-tima-miroshnichenko-5717198` (salle de réunion, femme au
smartphone) a été écartée pour une autre raison : le §15 du cahier des
charges demande explicitement d'éviter l'esthétique « banque d'images
corporate ». Sa palette froide gris-bleu s'oppose à la charte encre / or /
ivoire, et le décor de bureau international ne dit rien de l'économie réelle
que la plateforme sert.
