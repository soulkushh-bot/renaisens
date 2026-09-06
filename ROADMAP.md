# ROADMAP

Ce qui vient après le MVP, et à quelles conditions. Rien ici n'est daté : les seuils sont des seuils,
pas des promesses.

---

## Le seul indicateur qui décide de la suite

**Le pourcentage de femmes qui complètent le rituel de la semaine 2.**

Tant que ce chiffre n'est pas connu, rien de ce qui suit ne doit être construit. Un fil communautaire
ou un abonnement greffés sur un produit que personne ne reprend en semaine 2 ne feront que masquer le
problème pendant six mois.

Repères de lecture, pour éviter de se raconter des histoires :

| rituel de la semaine 2 | lecture | ce qu'on fait |
| --- | --- | --- |
| < 15 % | le produit s'arrête encore après le diagnostic | on retravaille le plan et le rituel, rien d'autre |
| 15 – 30 % | ça tient, mais ça fuit | on cherche où, avec des entretiens, pas avec des features |
| > 30 % | la boucle fonctionne | on peut ouvrir la suite |

---

## Circle — le fil communautaire

Retiré du MVP volontairement. Deux raisons, toujours valables :

1. **Une communauté vide dessert le produit.** Un fil sans messages dit à la première visiteuse que
   personne n'est venu avant elle.
2. **Le sujet exige de la modération.** Des femmes qui parlent de leurs finances, de leur couple et
   de leur famille dans un fil ouvert, ça se modère — et une modération qu'on n'a pas est une
   modération qui n'existe pas.

**Conditions d'ouverture, toutes nécessaires :**

- au moins **300 femmes** ayant complété le rituel de la semaine 2 (assez pour qu'un fil ne soit
  jamais vide un lundi matin) ;
- **une personne responsable de la modération**, nommée, avec du temps dédié — pas « l'équipe » ;
- des **règles écrites avant l'ouverture** : ce qui se publie, ce qui se signale, ce qui se supprime,
  et sous quel délai ;
- un **signalement en un appui** et un blocage effectif, livrés le premier jour, pas « bientôt » ;
- une décision explicite sur le **pseudonymat** : sur ces sujets, le vrai nom est un risque, pas un
  gage de sérieux.

**Comment il s'ouvrirait, en trois temps :**

1. **Fils fermés par cohorte.** Les femmes qui ont démarré le même mois, ensemble, sans découverte
   publique. Une cohorte a un contexte partagé ; un fil global n'en a aucun.
2. **Réponses aux Récits.** Les onze récits illustratifs deviennent des points d'entrée : on répond
   à une histoire, pas à une page blanche. Le taux de premier message est le signal à observer.
3. **Fil ouvert par thème**, seulement si les deux premiers temps tiennent, et jamais avant.

Ce qui ne sera pas fait : ni fil chronologique global, ni compteurs publics d'abonnées, ni classement
de participation. On ne transforme pas une transition de vie en concours.

---

## Paiement — v2

Le rail de paiement sera **mobile money : Wave, Orange Money, MTN MoMo**. Pas Stripe seul.

C'est une contrainte de marché, pas une préférence : sur le segment pilote (Abidjan, Dakar), la carte
bancaire internationale est minoritaire, et un tunnel de paiement qui exige une carte exclut la
majorité des utilisatrices avant même la question du prix. Stripe restera utile pour la diaspora ; il
ne peut pas être le seul chemin.

Les montants de référence sont déjà centralisés dans `src/config/market.ts`
(`paiement.railV2`), donc le choix est documenté dans le code, pas seulement ici.

**Ce qui pourrait être payant, et ce qui ne le sera pas.** Le bilan, le profil, le plan de trente
jours et le rituel restent gratuits — ce sont eux qui produisent la valeur, et les rendre payants
reviendrait à vendre le diagnostic, exactement le travers que ce produit corrige. RenaiSens+ porterait
sur ce qui coûte réellement : de l'accompagnement humain, et des plans plus longs.

---

## Technique

**Synchronisation multi-appareils.** Aujourd'hui tout est dans `localStorage` : changer de téléphone
fait tout perdre, et c'est dit honnêtement dans les réglages. Brancher Supabase demande une deuxième
implémentation de `StorageAdapter` et une ligne dans `src/lib/storage/index.ts`. À ne faire que si
les utilisatrices le demandent — la promesse « ça ne quitte pas ton téléphone » vaut plus cher que la
commodité, et l'export JSON couvre déjà le cas du changement d'appareil.

**Liste d'attente réelle.** `src/app/api/waitlist/route.ts` journalise. Il y a un seul endroit à
changer (la fonction `enregistrer`) pour brancher Resend ou une table Supabase. Cela introduira la
première variable d'environnement du projet — jusque-là, le déploiement reste sans configuration.

**Icônes PWA en PNG.** Le manifeste déclare une icône SVG ; le support `maskable` est inégal selon
les navigateurs Android. Générer des PNG 192/512 depuis `public/icons/phoenix.svg` améliorerait
l'installation sur l'écran d'accueil. Le mode hors ligne, lui, ne dépend pas de ça.

**Vérifier le service worker sur un appareil réel — à faire en premier.** Le rituel ne fait aucun
appel réseau, c'est mesuré. Mais l'enregistrement du service worker n'a pas pu être vérifié de bout
en bout pendant le build : le navigateur d'aperçu utilisé bloque les service workers. Le script est
valide et correctement servi ; il reste à confirmer, sur un Android réel en mode avion, que
`/aujourdhui`, `/plan` et `/rituel` s'ouvrent bien après fermeture de l'app. Tant que ce n'est pas
confirmé, le produit ne doit pas promettre « fonctionne hors ligne » sans nuance — la page d'accueil
dit aujourd'hui « calculés sur ton téléphone », ce qui est exact.

**Vérification réseau réelle.** Le budget (< 200 Ko de JS par route, LCP < 2,5 s en 3G lente) est
tenu au build ; il n'a pas encore été mesuré sur un vrai appareil d'entrée de gamme sur un vrai
réseau.

**Plusieurs marchés.** `src/config/market.ts` isole devise, montants, services de paiement, villes et
guichets. Ouvrir un deuxième pays, c'est un deuxième fichier de configuration et une relecture
éditoriale des 92 actions — pas une refonte.

---

## Ce qui ne sera pas fait

- **Les séries et les badges.** Une série remise à zéro punit exactement la femme qu'on veut faire
  revenir. C'est la règle la plus importante du produit ; elle n'est pas négociable.
- **Les notifications d'engagement.** Un rappel hebdomadaire, si elle le demande, éventuellement.
  Rien qui cherche à la ramener plus souvent qu'une fois par semaine.
- **Le classement social.** Aucune comparaison entre utilisatrices, sur aucun indicateur.
- **La génération du plan par LLM.** Le moteur déterministe est instantané, gratuit, testable, il
  fonctionne hors ligne et il ne peut pas inventer une action qui n'existe pas. Aucun de ces quatre
  points n'est un compromis acceptable sur ce produit.
