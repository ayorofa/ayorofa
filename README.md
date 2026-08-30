# Ayôrôfa Connect — Plateforme de mise en relation (Next.js)

Site de mise en relation BTP & échafaudage (Côte d'Ivoire). App Router, données d'exemple,
monétisation intégrée (sponsors + AdSense + Analytics), SEO (sitemap/robots/metadata).

## Démarrer
```
npm install
npm run dev        # http://localhost:3000
```

## Configurer
Copie `.env.example` en `.env.local` et renseigne les variables. Le fichier
d'exemple documente chacune d'elles et précise lesquelles restent côté serveur.

Sans clé, le site tourne : les publicités affichent un espace réservé, l'assistant
IA se désactive, et le paiement bascule en mode manuel.

## Activer les paiements Mobile Money

Le paiement automatique par CinetPay (Wave, Orange, MTN, Moov) est déjà codé —
`app/api/paiement/initier` et `app/api/paiement/notifier`. La confirmation est
revérifiée auprès de CinetPay côté serveur : le navigateur n'est jamais cru sur
parole, et le traitement est idempotent.

Trois étapes pour l'ouvrir :

1. **Créer la table.** Exécuter `supabase/paiements.sql` dans Supabase →
   SQL Editor. Sans elle, la toute première transaction échoue à l'insertion,
   après que le client a payé.
2. **Poser les clés dans Vercel** : `CINETPAY_API_KEY`, `CINETPAY_SITE_ID` et
   `SUPABASE_SERVICE_ROLE_KEY`. Tant qu'elles manquent, `/api/paiement/initier`
   répond 503 et l'application propose le paiement manuel, validé depuis
   `/admin-plans`.
3. **Faire un vrai paiement test** de petit montant sur son propre numéro. C'est
   le seul moyen de vérifier la chaîne complète : redirection, notification,
   activation du plan et du badge.

Le plan Pro se vend sur le droit de publier, mais `PUBLICATION_GRATUITE` vaut
`true` dans `data/plans.js` : publier reste gratuit. Ce plan n'a donc rien à
vendre tant que ce booléen n'a pas basculé — c'est l'interrupteur du lancement.

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
