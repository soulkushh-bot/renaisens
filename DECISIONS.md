# DECISIONS

Les arbitrages pris pendant le build, avec leur raison. Les corrections apportées au plan **avant**
de coder sont dans [PLAN.md §13](PLAN.md).

---

## Produit

**Les scores ne sont jamais affichés.**
Cinq dimensions notées de 0 à 100, c'est la Roue de la Vie — le motif le plus générique du secteur.
Et afficher « Finances : 23/100 » à quelqu'un qui vient d'écrire qu'elle a peur de manquer est un
mauvais moment produit. Les scores restent dans le moteur, où ils servent à répartir les actions.
Le profil les rend en langue : « Ce qui te retient le plus en ce moment : l'argent et ton travail. »
Aucun composant de visualisation de score n'existe dans le dépôt.

**Les archétypes décrivent une situation, pas une personne.**
Pas « La Bâtisseuse » mais « Tu sais où tu vas. Tu ne sais pas avec quel argent. » Un nom de
personnalité flatte et ne se vérifie pas ; une situation, elle peut la reconnaître ou la rejeter.
C'est exactement ce que demande la phrase de contrôle du projet.

**La première question du bilan est posée sur la page d'accueil.**
Elle répond avant d'avoir décidé de commencer. Sa phrase est reprise telle quelle au dernier écran du
bilan — elle voit ce qu'elle a écrit en arrivant, et peut le corriger. Aucun chemin ne la perd, aucun
chemin ne la fait saisir deux fois.

**Le temps déclaré plafonne la taille du plan.**
« Des miettes, moins d'une heure » donne deux actions par semaine au lieu de trois, et un budget
d'effort de 45 minutes. C'est la contrainte que les apps de développement personnel ignorent
systématiquement, et c'est la première cause d'abandon en semaine 2.

**On entre dans chaque dimension à la hauteur du score.**
Découvert en testant : sans cette règle, la sélection est toujours un préfixe de la liste
« du plus doux au plus exigeant », et le plan de la mère qui reprend était **entièrement inclus**
dans celui de la cadre qui part — 67 % de recouvrement. Un test le vérifie désormais
(`plan.test.ts` → « ne rend pas des plans interchangeables », seuil à 60 %).

**Ce qui n'a pas été fait passe devant ce qui était prévu.**
Une action reportée est ce qu'elle a déjà en tête. La repousser derrière une action neuve reviendrait
à lui demander de recommencer une semaine plus tard avec une chose de plus sur la liste.

**Le décalage du plan est raconté en une phrase, pas en dix.**
Quand rien n'est coché, le plafond de trois actions fait déborder chaque semaine sur la suivante en
cascade. La première version émettait un message par saut : dix lignes répétitives après une mauvaise
semaine, c'est-à-dire exactement au moment où il ne faut pas assommer quelqu'un. Désormais les
actions manquées sont nommées une par une (c'est l'information) et le décalage du reste tient en une
ligne (ce n'en est que la conséquence).

**La teinte de la carte compte les rituels, pas les actions.**
Assumé, et dit dans l'interface : « Un passage en cuve. Tu es revenue une fois. » Revenir est la
seule chose que le produit lui demande, et une semaine sans action mais avec un rituel vaut mieux
qu'une disparition. La légende est explicite pour que la carte ne se lise pas comme un compliment
qu'elle n'a pas mérité — un faux compliment coûte plus cher que pas de compliment du tout.

**La semaine en cours se calcule sur ses rituels, pas sur le calendrier.**
Si elle disparaît trois semaines, elle revient à la semaine 2, pas à la semaine 5 avec trois semaines
« ratées ». Aucun code de rattrapage n'existe, et c'est volontaire.

**Les jalons à 90 jours ne prennent que des actions plus exigeantes que le plan à 30 jours.**
La première version tirait les actions restantes de chaque dimension, qui se trouvaient être les plus
faciles — un jalon « Jour 90 : liste tes abonnements » décrédibilisait tout le plan. Deux tests
verrouillent maintenant l'escalade et le plancher de difficulté.

**Le bloc RenaiSens+ ne promet rien de daté.**
Il dit « ça n'existe pas encore ». Aucune fonctionnalité annoncée, aucune date, aucun chiffre de
traction. Sur ce produit, la confiance est le produit.

---

## Technique

**Le moteur est déterministe, sans horloge ni hasard.**
`genererPlan(profil, { maintenant })` prend la date en paramètre pour que les tests soient stables.
Aucun `Math.random` nulle part. C'est ce qui rend les 70 tests possibles, et c'est ce qui garantit
que deux ouvertures du même profil donnent le même plan — un plan qui change tout seul n'inspire pas
confiance.

**Forme fonctionnelle obligatoire sur tous les `setState` dérivés.**
Trouvé en pilotant le vrai parcours dans un navigateur : deux réponses enregistrées dans le même tick
React partagent la même fermeture, et la première était écrasée. Ça n'arrive pas à un rythme humain
sur une machine rapide — ça arrive sur un Android d'entrée de gamme dont le thread principal traîne,
c'est-à-dire exactement l'appareil du segment pilote.

**Les variantes de bouton sur fond sombre sont des variantes, pas des surcharges.**
Écraser `bg-cuve` par `bg-coton` via `className` ne marche pas : l'ordre gagnant est celui de la
feuille de style finale, pas celui de la chaîne de classes. Le bouton principal de la page d'accueil
était indigo sur indigo, donc invisible. D'où `clair` et `contourClair` dans `ui/base.tsx`.

**La conversion à la deuxième personne traite aussi les possessifs, et cite en cas de doute.**
« Je veux quitter mon poste » donnait « tu veux quitter **mon** poste ». Les possessifs sont
convertis avec des limites de mot ; et s'il reste une marque de première personne après conversion
(un second verbe conjugué qu'on ne sait pas accorder), on cite ses mots entre guillemets plutôt que
de lui rendre une phrase bancale. Ne jamais lui rendre une phrase qu'elle n'a pas dite.

**`motion` n'est chargé que sur `/profil`.**
Import dynamique. Le paquet ne pèse sur aucune autre route, et `useReducedMotion` coupe l'animation.

**Aucune bibliothèque d'icônes.**
Les six icônes du produit sont des `<svg>` inline, dans la même langue graphique que le tampon
(arêtes droites, aucune courbe). Une bibliothèque d'icônes, c'est des dizaines de kilo-octets pour
six glyphes.

**Icônes PWA en SVG.**
Le manifeste déclare une icône SVG. Le support des icônes SVG de manifeste est correct sur Chrome
Android mais inégal pour le mode `maskable` ; générer des PNG 192/512 demanderait une chaîne de
rastérisation qui n'apporte rien au MVP. Le mode hors ligne ne dépend pas de l'installabilité : il
vient du service worker, dont la vérification reste ouverte (voir ci-dessous). À reprendre — noté
dans `ROADMAP.md`.

**Le hors ligne est revendiqué à hauteur de ce qui a été mesuré.**
Le rituel a été joué en entier avec `fetch`, `XMLHttpRequest` et `sendBeacon` instrumentés : aucun
appel réseau. En revanche, l'enregistrement du service worker n'a pas pu être vérifié — le navigateur
d'aperçu disponible ici le bloque, et le Chrome de l'utilisateur n'était pas joignable. Plutôt que
d'écrire « fonctionne hors ligne » sur la page d'accueil sans l'avoir constaté, la formulation retenue
est « calculés sur ton téléphone, sans connexion », qui est exacte. Le point est ouvert en tête de la
section technique de `ROADMAP.md`.

**Node.js a été installé sur la machine de build.**
Il n'était pas présent. Installé via `winget install OpenJS.NodeJS.LTS` (24.19.0), après accord.

---

## Écarts par rapport au plan initial

| plan | livré | raison |
| --- | --- | --- |
| 10–12 récits | 11 | assez pour couvrir les cinq dimensions et cinq situations de bascule |
| 80–120 actions | 92 | suffisant pour que trois profils contrastés diffèrent nettement |
| dimension `Milestone` sans actions | `actionIds` ajouté | un jalon doit nommer des actions réelles, pas de la prose |
| `PhoenixStamp` v1 | redessiné | la première version se lisait « avion » : ailes qui descendaient, queue trop fine |
