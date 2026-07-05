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

## Contenu
- `data/pros.js`, `data/metiers.js`, `data/villes.js`, `data/guides.js` : données d'exemple à remplacer.
- `data/sponsors.js` : encarts vendus en direct (mets les images dans `public/sponsors/`).

## Étapes suivantes (README d'origine)
- **Base de données** : `prisma/schema.prisma` est prêt → `npm i prisma @prisma/client` puis `npx prisma migrate dev` (PostgreSQL, ex. Neon/Vercel Postgres).
- **Auth** : NextAuth (connexion pros/clients).
- **Paiement** : CinetPay / PayDunya (Mobile Money).
