# RENaiSENS

**Devenir une nouvelle version de soi.**

Une web-app mobile-first pour des femmes en transition de vie : faire le point, décider qui l'on veut
devenir, et repartir avec un plan de trente jours qui se réécrit selon ce qu'on fait vraiment.

---

## La métrique qui compte

> **Le pourcentage de femmes qui complètent le rituel de la semaine 2.**

Pas les inscriptions, pas les bilans terminés, pas le temps passé. Un questionnaire qui rend un
document est un moment fort suivi de rien ; la seule preuve que ce produit vaut quelque chose, c'est
qu'elle revienne une deuxième semaine. Tout le reste de ce dépôt existe pour ce chiffre.

L'événement à suivre : `weekly_ritual_completed` avec `semaine = 2`, rapporté à `plan_generated`.

## Le parcours

```
/                Une promesse, et la première question du bilan posée tout de suite
/bilan           Confidentialité, puis 6 écrans · 22 questions · ~8 minutes
/profil          Le Profil de Renaissance — le seul moment animé du produit
/aujourdhui      Le retour quotidien : une seule chose au-dessus de la ligne
/plan            30 jours détaillés · 90 jours esquissés · 1 an en une phrase
/rituel          3 minutes par semaine — la boucle de rétention
/recits          11 parcours illustratifs, signalés comme tels
/reglages        Confidentialité, export, suppression totale
```

## Lancer en local

Node 20 ou plus.

```bash
npm install
npm run dev
```

| commande | ce qu'elle fait |
| --- | --- |
| `npm run dev` | serveur de développement sur http://localhost:3000 |
| `npm run build` | build de production |
| `npm run start` | sert le build de production |
| `npm test` | 70 tests Vitest sur le moteur et le contenu |
| `npm run typecheck` | TypeScript strict, sans émission |

**Aucune variable d'environnement n'est nécessaire**, ni en local ni en production. C'est une
propriété du projet, pas un oubli : elle rend le déploiement reproductible et garantit qu'aucune
donnée personnelle ne peut partir vers un service tiers.

## Le moteur de plan

Un moteur de règles déterministe en TypeScript. Pas d'appel LLM : c'est instantané, gratuit,
testable, ça marche hors ligne et ça ne dépend d'aucune clé d'API.

```
src/lib/engine/
  score.ts    réponses  → 0–100 par dimension   (jamais affiché : ni chiffre, ni jauge, ni radar)
  profile.ts  scores    → archétype de situation, forces, tensions, sa phrase à un an
  plan.ts     profil    → 4 semaines × ≤3 actions, 1 seule prioritaire
  adapt.ts    progrès   → plan réécrit + la liste lisible de ce qui a changé
```

**Les règles qui font le produit**

1. **Trois actions par semaine au maximum, une seule prioritaire.** Une femme en transition n'a pas
   douze créneaux. Un plan trop lourd est abandonné en semaine 2 — et un plan abandonné en semaine 2
   est un produit qui a échoué, quelle que soit la qualité de son diagnostic.
2. **La taille du plan dépend du temps qu'elle a déclaré.** Une réponse « des miettes, moins d'une
   heure » produit un plan de deux actions par semaine, pas trois. Cette question de l'onboarding
   change mécaniquement le plan, pas seulement le ton.
3. **On entre dans chaque dimension à la hauteur de son score.** On ne demande pas à quelqu'un qui
   suit déjà ses dépenses au franc près d'aller « lire son relevé ». Sans cette règle, toute
   sélection est un préfixe de la même liste et deux femmes différentes reçoivent le même plan.
4. **La semaine 1 est douce, et contient au moins une action faisable le soir même.**
5. **Une action non faite deux semaines de suite n'est jamais répétée à l'identique** : elle est
   proposée dans sa version réduite. Une troisième fois, elle sort du plan.
6. **Une semaine ratée ne casse rien.** Pas de série remise à zéro, pas de compteur rouge, pas de
   rattrapage. La semaine en cours est calculée sur ses rituels, pas sur le calendrier : si elle
   disparaît trois semaines, elle revient à la semaine 2, pas à la semaine 5.
7. **Déterminisme total.** Aucun `Math.random`, aucune horloge dans la sélection. Deux ouvertures du
   même profil donnent le même plan — c'est ce qui rend le moteur testable.

Les 92 actions vivent dans `src/content/actions.ts`. Tout ce qui est local — devise, montants,
services de paiement, villes, guichets — passe par `src/config/market.ts` : **changer de marché,
c'est éditer un seul fichier.**

## Données et vie privée

Tout est dans `localStorage`, derrière l'interface `StorageAdapter` (`src/lib/storage/`). Ses
réponses sur son argent, son travail et sa famille ne quittent pas son téléphone. Pas de compte, pas
de base de données, pas de serveur.

C'est un argument produit autant qu'une décision technique, et il est dit en clair dans l'onboarding
et dans les réglages. Brancher Supabase plus tard demande une deuxième implémentation de
`StorageAdapter` et une ligne changée dans `src/lib/storage/index.ts` — aucun écran ne connaît le
mode de stockage.

## Performance

Budget tenu, mesuré sur le build de production :

| contrainte | cible | mesuré |
| --- | --- | --- |
| JS par route (hors polices) | < 200 Ko | **129 Ko** au maximum (`/rituel`) |
| JS partagé | — | 103 Ko |
| bibliothèque d'icônes | aucune | aucune, les icônes sont des `<svg>` inline |
| images | aucune photo | aucune, tout le visuel est vectoriel |

`motion` n'est chargé que sur `/profil`, en import dynamique. `prefers-reduced-motion` coupe toute
animation.

**Hors ligne — vérifié en production.** Deux mesures, pas une intention :

1. Le rituel a été joué de bout en bout avec `fetch`, `XMLHttpRequest` et `sendBeacon` instrumentés :
   **zéro appel réseau**, y compris pour réécrire le plan. Tout est calculé sur l'appareil, et l'état
   vit dans `localStorage`.
2. Sur `renaisens.vercel.app`, le service worker (`public/sw.js`, écrit à la main) **s'enregistre,
   s'active sur la portée `/`, et met en cache les six routes de la coquille** — `/`, `/aujourdhui`,
   `/plan`, `/rituel`, `/recits`, `/reglages`. Vérifié : `/rituel` revient du cache en 200
   `text/html`.

Stratégie : réseau d'abord avec repli sur le cache pour les navigations, cache d'abord pour
`/_next/static` (noms hachés, donc immuables).

## Mesure

`@vercel/analytics` et `@vercel/speed-insights`, derrière `src/lib/analytics.ts` (silencieux en
développement). Six événements : `onboarding_started`, `onboarding_completed`, `plan_generated`,
`first_action_checked`, `weekly_ritual_completed` (avec le numéro de semaine), `day30_reached`.

## Volontairement hors scope

- **Circle, le fil communautaire ouvert.** Une communauté vide dessert le produit, et un fil où des
  femmes exposent leurs finances et leur vie familiale demande une modération qu'on n'a pas au
  premier jour. Remplacé par les **Récits** : onze parcours éditorialisés, avec ce qui a coincé et ce
  qui n'est toujours pas réglé. Les conditions d'ouverture de Circle sont dans [ROADMAP.md](ROADMAP.md).
- **Comptes, authentification, base de données, paiement.** Rien n'est payant en v1 ; le produit
  complet est gratuit. Le seul point testé est un bloc « RenaiSens+ » qui capte une adresse e-mail
  (`src/app/api/waitlist/route.ts`, prêt pour Resend ou Supabase, journalise pour l'instant).
- **Le plan à un an détaillé.** L'horizon à un an est sa propre phrase, rendue mot pour mot. On ne
  lui invente pas un futur.

## Intégrité du contenu

Les onze récits sont **illustratifs**, et l'app le dit sur la liste et sur chaque récit. Aucun
témoignage inventé n'est présenté comme réel, aucun chiffre de traction n'est fabriqué, aucun
partenariat n'est évoqué. Sur ce produit, la confiance est le produit.

## Documents

- [PLAN.md](PLAN.md) — le plan de conception, et son auto-critique (§13)
- [DECISIONS.md](DECISIONS.md) — les arbitrages pris pendant le build
- [ROADMAP.md](ROADMAP.md) — la suite, dont l'ouverture de Circle et le rail de paiement v2
