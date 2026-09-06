# PLAN — RENaiSENS

> Phase 1. Écrit avant toute ligne de code. Les écarts assumés en cours de build sont notés dans `DECISIONS.md`.

## 1. La phrase de contrôle

> Une femme d'Abidjan de 32 ans qui veut quitter son emploi pour lancer son activité passe 8 minutes
> dans l'onboarding, reconnaît sa propre situation dans le profil qu'elle lit, trouve dans son plan
> une première action qu'elle peut faire dès ce soir — et revient la semaine suivante.

Chaque décision ci-dessous est justifiée par rapport à cette phrase.

## 2. Parcours

```
/                landing            → "Faire le point" (ou "Reprendre" si un état existe)
/bilan           onboarding         → écran confidentialité, puis 6 écrans de questions
/profil          révélation         → le seul moment orchestré du produit
/aujourdhui      retour quotidien   → l'action du jour, rien d'autre au-dessus de la ligne
/plan            30j / 90j / 1 an   → le plan vivant, avec l'historique des réécritures
/rituel          3 minutes/semaine  → LA boucle de rétention
/recits          10–12 parcours     → remplace le fil communautaire
/recits/[slug]
/reglages        confidentialité, export JSON, suppression totale
/api/waitlist    stub RenaiSens+ (journalise, prêt pour Resend/Supabase)
```

Navigation : barre basse à 4 entrées (Aujourd'hui · Plan · Récits · Réglages), affichée **uniquement**
après l'onboarding. Avant, l'écran ne propose qu'une seule chose à faire.

## 3. Modèle de données

Tout vit dans `localStorage`, sous une seule clé `renaisens:v1`, derrière `StorageAdapter`.

```ts
type DimensionId = 'soi' | 'carriere' | 'finances' | 'projet' | 'entourage'

type AppState = {
  version: 1
  createdAt: string                       // ISO
  answers: Record<string, AnswerValue>    // number | string | string[]
  scores: Record<DimensionId, number>     // 0–100
  profile: Profile
  plan: Plan
  progress: Progress
}

type Profile = {
  archetypeId: string          // 8 archétypes, choisis par règle sur la forme du score
  titre: string
  resume: string               // 2–3 phrases, gabarit + fragments de ses réponses
  forces: DimensionId[]        // 2
  tensions: DimensionId[]      // 2
  visionReformulee: string     // sa réponse libre, rendue en une phrase tenable
  horizonUnAn: string
}

type Plan = {
  revision: number             // s'incrémente à chaque réécriture par adapt.ts
  generatedAt: string
  semaines: PlanWeek[]         // exactement 4
  jalons90: Milestone[]        // 3, esquissés
  horizon: string              // 1 phrase
  historique: PlanChange[]     // ce qui a changé, révision par révision
}

type PlanWeek = {
  index: 1 | 2 | 3 | 4
  intention: string            // "Cette semaine, tu mets tes chiffres au clair."
  actions: PlannedAction[]     // max 3
}

type PlannedAction = {
  actionId: string
  prioritaire: boolean         // exactement 1 par semaine
  reduite: boolean             // true si adapt.ts a basculé sur versionReduite
}

type Progress = {
  faites: string[]             // actionIds cochés
  semaines: WeekLog[]          // une entrée par rituel complété
  dernierRituel: string | null
}

type WeekLog = {
  semaine: number
  completeLe: string
  faites: string[]
  nonFaites: string[]
  reflexion: { questionId: string; reponse: string }
}
```

**Pourquoi localStorage, et pourquoi le dire dans le produit :** ses réponses sur son argent, son
travail et sa famille ne quittent pas son téléphone. C'est un argument de confiance, pas seulement un
raccourci technique. Dit en clair dans l'écran de confidentialité et dans `/reglages`.

## 4. Moteur de plan (déterministe, TypeScript, zéro appel réseau)

```
src/lib/engine/
  score.ts    réponses → 0–100 par dimension
  profile.ts  scores + textes libres → archétype, forces, tensions, vision reformulée
  plan.ts     profil → 4 semaines × ≤3 actions, 1 prioritaire
  adapt.ts    plan + WeekLog[] → nouveau plan + PlanChange[]
```

### score.ts
Chaque question porte `dimension`, `poids`, et `inverse` (une question du type « à quel point es-tu
bloquée » compte à rebours). Score = moyenne pondérée normalisée sur 0–100. Les champs libres ne scorent pas.

### profile.ts
- `forces` = 2 dimensions les plus hautes, `tensions` = 2 plus basses. Départage déterministe par ordre
  canonique des dimensions, jamais aléatoire.
- `archetypeId` : 8 archétypes sélectionnés par la **forme** du profil (paire tension × force), pas par
  un score global. Nommés en langue ordinaire, jamais ésotérique.
- `visionReformulee` : sa réponse libre nettoyée et rendue en une phrase à la 2e personne. Aucun LLM :
  normalisation + gabarit. Si sa réponse est trop courte, repli honnête plutôt qu'invention.

### plan.ts — les règles
1. **3 actions max par semaine, 1 seule prioritaire.** Une femme en transition n'a pas 12 créneaux.
   Un plan trop lourd est abandonné en semaine 2.
2. Répartition des 12 slots par dimension, proportionnelle au **déficit** (`100 − score`), avec plancher
   et plafond : la dimension la plus faible reçoit au moins 3 slots, chaque force au plus 2.
3. Difficulté croissante : la semaine 1 ne contient que `difficulte ≤ 2` et `effortMinutes ≤ 30`, et doit
   contenir **au moins une action faisable le soir même**. C'est littéralement la phrase de contrôle.
4. `prerequis[]` respectés : une action n'apparaît jamais avant celle dont elle dépend.
5. Tri final déterministe `(difficulte, effortMinutes, id)`. Aucun `Math.random`, aucune `Date.now()` dans
   la sélection → testable, et deux ouvertures du même profil donnent le même plan.
6. La prioritaire de la semaine appartient à la dimension la plus en tension pas encore adressée.

### adapt.ts — le plan vivant (correction de la faille n°1)
- Action non faite **2 semaines de suite** → remplacée par sa `versionReduite`, jamais répétée à
  l'identique. Une 3e fois → retirée et remplacée par une action d'une autre dimension.
- 3/3 deux semaines de suite → la semaine suivante peut monter d'un cran de difficulté. Jamais de 4e action.
- Semaine ratée (aucun rituel) → **rien ne casse** : pas de série remise à zéro, pas de compteur rouge.
  Le plan glisse d'une semaine, c'est tout.
- Chaque réécriture produit un `PlanChange[]` lisible → elle voit *quoi* a changé et *pourquoi*.

### Bibliothèque d'actions
80–120 actions typées :
```ts
{ id, dimension, titre, pourquoi, effortMinutes, difficulte: 1|2|3, prerequis: string[], versionReduite: string }
```
Concrètes et ancrées : « Ouvre un compte Wave et programme un virement de 5 000 F chaque vendredi »,
pas « ouvre un compte épargne ». Tout ce qui est spécifique au marché (devise, montants, services,
villes, exemples) passe par `src/config/market.ts` — un seul fichier à éditer pour changer de pays.

### Tests Vitest
`plan.test.ts` : trois profils contrastés (la cadre qui veut partir / la mère qui reprend /
l'entrepreneuse lancée mais fauchée) → trois plans **différents** et cohérents ; invariants vérifiés
(≤3 actions/semaine, exactement 1 prioritaire, prérequis respectés, semaine 1 douce, déterminisme).
`adapt.test.ts` : la règle des 2 semaines, la non-punition d'une semaine ratée, le plafond de 3.

## 5. Le rituel hebdomadaire — 3 minutes, 3 temps

1. **Ce que tu as fait.** Cases à cocher. Le non-fait n'est pas rouge, n'est pas commenté, n'est pas
   compté contre elle. Le libellé est « Pas cette semaine », jamais « Échoué ».
2. **Une question.** Choisie selon le numéro de semaine × sa dimension la plus faible. Réponse libre courte.
3. **Ce qui change.** `adapt.ts` tourne devant elle et le diff s'affiche en français : « Le rendez-vous
   à la banque devient : appeler pour demander les horaires. Plus petit, mais tu l'auras fait. »

**Semaine 4 = le moment de récompense.** Elle relit mot pour mot ce qu'elle a écrit au jour 1
(« Qu'est-ce qui t'a arrêtée jusqu'ici ? ») à côté de ce qu'elle vient d'écrire. Son avant/après, en ses
propres mots, sans graphique et sans félicitations automatiques. C'est l'écran le plus soigné du MVP.

Hors ligne obligatoire : le rituel ne touche pas le réseau. Zéro fetch.

## 6. Direction visuelle

**Concept : l'indigo, pas la flamme.** La teinture indigo ouest-africaine (adire yoruba, indigo malien
et guinéen) est une transformation littérale — le tissu entre vert dans la cuve et ressort bleu au
contact de l'air. Le phénix est traité en **motif de réserve**, imprimé au tampon : géométrique,
symétrique, à arêtes droites. Pas un oiseau en flammes, pas de dégradé orange.

Palette figée dans `globals.css` (6 valeurs, pas une de plus) :

| token | valeur | rôle |
| --- | --- | --- |
| `--indigo-cuve` | `#131C3D` | base profonde, fonds pleins |
| `--indigo-air` | `#33509B` | le bleu qui apparaît au contact de l'air, accents actifs |
| `--indigo-pale` | `#93A8D6` | états faibles, semaine non teinte |
| `--coton` | `#F2EDE1` | surfaces, écru coton non teint |
| `--laiton` | `#A8813C` | accent unique, mat, réservé à l'action prioritaire |
| `--encre` | `#15161A` | texte |

Interdits explicites : rose pastel, aquarelle, dégradé violet-rose, et le trio crème + serif à fort
contraste + terracotta.

Typographie : **Bricolage Grotesque** (display, variable) + **Inter Tight** (texte). Deux familles, pas
trois. Accents français vérifiés (latin-ext chargé sur les deux).

**Le dispositif de progression : pas de barre de pourcentage.** Chaque semaine tenue fait repasser sa
carte de profil dans la cuve — la teinte fonce d'un cran (`--indigo-pale` → `--indigo-cuve`) et la densité
du motif de réserve augmente. Au jour 30, elle a un objet visuel qui n'existait pas au jour 1.

Mouvement : **un seul moment orchestré**, la révélation du profil (le motif se « teint » en cascade).
Ailleurs, le mouvement ne répond qu'à une action de l'utilisatrice. `prefers-reduced-motion` coupe tout.

Marqueurs d'interface générée à éviter, listés pour pouvoir m'auto-vérifier : pas d'eyebrow en capitales
espacées ; pas de `→` collé aux libellés de boutons ; pas de listes 01/02/03 sur du non-séquentiel ;
pas de rayon + ombre grise identiques partout — ici **aucune ombre**, des bordures d'encre 1px et des
aplats, comme une impression au tampon.

## 7. Écriture

Français, tutoiement, voix active, phrases courtes. Une amie plus avancée qui sait de quoi elle parle —
ni coach américain, ni thérapeute, ni institution. Elle n'est pas malade, elle est en transition.
Les boutons disent ce qui se passe : « Voir mon plan », jamais « Continuer ».
Les récits sont **illustratifs et signalés comme tels**. Aucun faux témoignage présenté comme réel,
aucun chiffre de traction inventé, aucun partenariat imaginaire.

## 8. Performance — budget non négociable

- < 200 Ko de JS par route hors polices. `motion` chargé **uniquement** sur `/profil`, en import dynamique.
- LCP < 2,5 s en 3G lente. Composants serveur par défaut ; le client ne prend que ce qui a besoin d'état.
- Aucune bibliothèque d'icônes : les quelques icônes nécessaires sont des `<svg>` inline.
- PWA : `manifest` + service worker écrit à la main (`public/sw.js`). Cache-first sur `/_next/static`,
  network-first avec repli cache sur les navigations. `/aujourdhui`, `/plan` et `/rituel` marchent en avion.
- `prefers-reduced-motion` respecté partout.
- Images : aucune photo dans le MVP. Le visuel est vectoriel (motifs SVG) → poids quasi nul, net à tout DPI.

## 9. Mesure

`@vercel/analytics` + `@vercel/speed-insights`, derrière `src/lib/analytics.ts` (no-op en dev).
Événements : `onboarding_started`, `onboarding_completed`, `plan_generated`, `first_action_checked`,
`weekly_ritual_completed` (avec `semaine`), `day30_reached`.

**La métrique qui compte : le % qui complète le rituel de la semaine 2.** En tête du README.

## 10. Arborescence

```
src/
  app/
    layout.tsx  page.tsx  globals.css  not-found.tsx
    bilan/page.tsx            profil/page.tsx
    aujourdhui/page.tsx       plan/page.tsx
    rituel/page.tsx           recits/page.tsx  recits/[slug]/page.tsx
    reglages/page.tsx         api/waitlist/route.ts
    manifest.ts
  components/
    ui/            Bouton, Carte, ChampTexte, Echelle, ChoixMultiple
    marque/        PhoenixStamp, MotifAdire, CarteTeinte
    app/           NavBasse, ActionCard, PlanSemaine, DiffPlan, RevelationProfil
  lib/
    engine/        score.ts profile.ts plan.ts adapt.ts index.ts
    storage/       adapter.ts local.ts index.ts   ← un seul fichier à changer pour Supabase
    analytics.ts   etat.tsx (contexte React)
  content/
    questions.ts   actions.ts   stories.ts   archetypes.ts   reflexions.ts
  config/
    market.ts      ← devise, montants, services, villes, exemples
  types.ts
public/  sw.js  icons/
tests/   score.test.ts plan.test.ts adapt.test.ts profile.test.ts
```

## 11. Hors scope, assumé

- **Circle (fil communautaire).** Une communauté vide dessert le produit, et un fil où des femmes exposent
  leurs finances et leur vie familiale demande une modération qu'on n'a pas. Remplacé par les Récits.
  Conditions d'ouverture écrites dans `ROADMAP.md`.
- Comptes, authentification, base de données, paiement, plan 1 an détaillé.
- Aucune variable d'environnement n'est requise pour déployer. Propriété à ne pas casser.

## 12. Ordre de build

1. Scaffold Next 15 + Tailwind v4 + Vitest, palette et polices → build vide qui passe.
2. `types.ts`, `config/market.ts`, `content/questions.ts`.
3. `content/actions.ts` (~90 actions) + `archetypes.ts` + `reflexions.ts` + `stories.ts`.
4. Moteur : `score` → `profile` → `plan` → `adapt`, avec les tests au fur et à mesure.
5. Storage + contexte d'état.
6. Écrans : bilan → profil → plan → aujourd'hui → rituel.
7. Récits, réglages, waitlist, PWA, analytics.
8. Vérification : build, tests, parcours complet, budget JS.
9. Git → GitHub → Vercel.

---

## 13. Auto-critique (phase 2)

Question posée au plan : *est-ce que ce design ressemble à ce que je produirais pour n'importe quelle
app de développement personnel ?* Sur sept points, oui. Corrections appliquées au plan avant le build.

**a. Les scores 0–100 sur 5 dimensions, c'est la Roue de la Vie.**
C'est le motif le plus générique du secteur, et pire : afficher « Finances : 23/100 » à une femme qui
vient d'écrire qu'elle a peur de manquer, c'est un mauvais moment produit. Elle n'a pas besoin d'une note.
→ **Correction : les scores restent dans le moteur (ils servent à répartir les slots) et ne sont jamais
affichés en chiffres, ni en jauge, ni en radar.** Le profil les rend en langue : « L'argent est ce qui te
retient le plus en ce moment. » Aucun composant de visualisation de score dans l'app.

**b. « Archétype » glissait vers l'horoscope.**
Huit archétypes nommés, c'est le quiz BuzzFeed. Un nom de personnalité flatte ; il n'est pas vérifiable.
→ **Correction : les archétypes décrivent une *situation*, pas une personne.** Pas « La Bâtisseuse » mais
« Tu sais où tu vas, tu ne sais pas avec quel argent ». Une situation, elle peut la reconnaître ou la
rejeter — c'est exactement ce que demande la phrase de contrôle.

**c. La landing n'était pas spécifiée — donc elle serait sortie en hero + 3 cartes + témoignages.**
→ **Correction : la landing est un seul écran, sans grille de features.** La promesse, puis **la première
question du bilan posée directement sur la landing**. Elle répond avant d'avoir décidé de commencer.
La seule preuve sociale, ce sont les récits, en bas, explicitement signalés comme illustratifs.

**d. « 3 minutes » était une affirmation, pas un mécanisme.**
→ **Correction : le rituel est plafonné par construction** — au plus 3 cases, 1 question courte
(280 caractères max), 1 diff à lire. Pas de champ de journal libre. Je mesure le parcours réel en
vérification, je ne me contente pas de l'écrire.

**e. Les blocs 90 jours et 1 an partaient pour être du remplissage.**
Trois jalons vagues, c'est ce que produit n'importe quel générateur.
→ **Correction : les jalons 90 jours sont dérivés de la même bibliothèque d'actions** — ils nomment les
actions qui se débloqueront à J30/J60/J90, avec leurs prérequis. Et **l'horizon 1 an est sa propre phrase**,
celle qu'elle a écrite au jour 1, rendue telle quelle. On ne lui invente pas un futur.

**f. La couleur portait seule la progression.**
Une carte « qui fonce » sur un écran bon marché en plein jour, ce n'est pas lisible.
→ **Correction : la teinte ne porte jamais l'information seule.** Chaque semaine tenue ajoute aussi de la
*matière* — la densité du motif de réserve augmente, le nombre de tampons visibles change. Différence
structurelle, pas seulement chromatique. C'est aussi la règle d'accessibilité.

**g. Il manquait une contrainte que les apps de ce genre ignorent toujours : son temps réel.**
Un plan calibré sur une femme qui aurait 5 heures libres est un plan abandonné.
→ **Correction : une question de l'onboarding demande combien de temps elle a vraiment par semaine, et sa
réponse plafonne le budget d'effort hebdomadaire dans `plan.ts`.** Un champ de l'onboarding qui change
mécaniquement le plan, pas seulement le ton. Et une troisième question libre s'ajoute (3 au lieu de 2)
pour nourrir la relecture de la semaine 4.

**Conséquence sur l'écran « Aujourd'hui » :** quand tout est fait pour la semaine, l'écran ne propose rien.
Il dit ce qui vient la semaine prochaine, et c'est tout. Ne rien avoir à faire est un état légitime, pas
un vide à remplir. Pas de série, pas de badge, pas de notification.
