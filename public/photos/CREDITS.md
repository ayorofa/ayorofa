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

Traitement appliqué : redimensionnée à 1500 px de large, très légèrement
adoucie (le voile sombre du hero masque le détail fin), encodée en WebP
qualité 70 → 212 Ko. L'originale fait 4000 × 3000 px.

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

Trois autres photos avaient été proposées pour le hero :

- `pexels-kindelmedia-8488005` — format portrait ;
- `pexels-kgstudios-36520424` — format portrait ;
- `pexels-sinalmultimedia-30188152` — format portrait.

Les deux dernières conviendraient bien au bloc « Vous êtes professionnel ? »,
qui attend un format 4:3.
