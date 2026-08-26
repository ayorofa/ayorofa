# Ayôrôfa Connect — Plateforme de mise en relation (Next.js)

Site de mise en relation BTP & échafaudage (Côte d'Ivoire). App Router, données d'exemple,
monétisation intégrée (sponsors + AdSense + Analytics), SEO (sitemap/robots/metadata).

## Démarrer
```
npm install
npm run dev        # http://localhost:3000
```

## Configurer
Copie `.env.example` en `.env.local` et renseigne :
```
NEXT_PUBLIC_SITE_URL=https://btp.ayorofa.com
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX          # Google Analytics (optionnel)
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-...   # AdSense (optionnel)
```
Sans ces clés, le site tourne : les pubs affichent un espace réservé.

## Déployer (Vercel)
1. Pousse le dossier sur GitHub.
2. Sur vercel.com → New Project → importe le repo → Deploy.
3. Ajoute tes variables d'env dans Vercel.

## Page d'accueil

La page d'accueil (`app/page.jsx`) suit le cahier des charges de refonte.
Elle est composée de briques réutilisables dans `components/accueil/` :

| Section | Composant | Source des données |
|---|---|---|
| Hero + recherche | `Hero`, `BoiteRecherche` | catalogues `data/metiers.js`, `data/villes.js` |
| Indicateurs de confiance | `Confiance` | statique |
| Statistiques | `Statistiques` | catalogues + comptes Supabase |
| Métiers populaires | `Metiers` | `profiles.metier_principal` |
| Professionnels proches | `ProsProches` | `profiles` + `avis` |
| Publier un besoin | `PublierBesoin` | prépare le formulaire `/publier` |
| Espace professionnel | `EspacePro` | statique |
| Comment ça marche | `CommentCaMarche` | statique |
| Opportunités | `Opportunites` | `besoins` |
| Pourquoi Ayôrôfa | `Pourquoi` | statique |
| Témoignages | `Temoignages` | `avis` rédigés |
| Questions fréquentes | `Questions` | `data/accueil.js` |
| CTA final | `CtaFinal` | statique |

Points à connaître :

- **Aucune donnée inventée.** Les sections alimentées par la base
  (professionnels, opportunités, témoignages) se masquent d'elles-mêmes
  tant qu'il n'y a rien de réel à montrer. Un seul appel groupé sert
  toute la page (`components/accueil/DonneesAccueil.jsx`).
- **Aucune section « partenaires ».** Elle n'apparaîtra que lorsque des
  partenaires auront donné leur autorisation écrite.
- **Photographies** : voir `public/photos/LISEZ-MOI.md`. Tant qu'aucune
  photo sous licence n'est fournie, la page affiche son décor dessiné.
- **Charte** : les couleurs officielles sont des tokens CSS
  (`--ayorofa-ink`, `--ayorofa-gold`, …) déclarés en tête de
  `app/globals.css`. Les styles de la page vivent dans `app/accueil.css`,
  tous préfixés `ay-` : ils ne peuvent pas déborder sur les autres pages.
- **Typographie** : Bricolage Grotesque (titres) et Figtree (texte),
  servies par `next/font` — auto-hébergées, sans requête vers un tiers.

## Contenu
- `data/pros.js`, `data/metiers.js`, `data/villes.js`, `data/guides.js` : données d'exemple à remplacer.
- `data/sponsors.js` : encarts vendus en direct (mets les images dans `public/sponsors/`).

## Étapes suivantes (README d'origine)
- **Base de données** : `prisma/schema.prisma` est prêt → `npm i prisma @prisma/client` puis `npx prisma migrate dev` (PostgreSQL, ex. Neon/Vercel Postgres).
- **Auth** : NextAuth (connexion pros/clients).
- **Paiement** : CinetPay / PayDunya (Mobile Money).
