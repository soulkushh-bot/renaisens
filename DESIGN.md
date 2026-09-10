---
name: RenaiSens
description: Le standard de la catégorie joué droit — crème chaud, une seule couleur d'action, et un phénix qui reprend ses couleurs à la place d'une jauge.
colors:
  prune: "#8c2059"
  magenta: "#b3286e"
  rose: "#e05c92"
  foret: "#17453a"
  creme: "#fdf7f2"
  rose-pale: "#fbedf2"
  blanc: "#ffffff"
  encre: "#23232a"
  encre-douce: "#5c5560"
  coche-repos: "#a07689"
  tuile-rose: "#fceaf0"
  tuile-menthe: "#e9f6ed"
  tuile-peche: "#fdefe2"
  tuile-lavande: "#f2ecfa"
  tuile-ciel: "#e7f0f9"
  icone-rose: "#d1356f"
  icone-vert: "#24824e"
  icone-orange: "#c25f18"
  icone-violet: "#7738ad"
  icone-bleu: "#1c6598"
  bord-champ: "#eadfd8"
  bord-coque: "#efe4dd"
  desactive: "#ece5df"
typography:
  display:
    fontFamily: "Figtree, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.3rem, 7vw, 3.5rem)"
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: "-0.022em"
  headline:
    fontFamily: "Figtree, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2rem"
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: "-0.022em"
  title:
    fontFamily: "Figtree, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: "-0.022em"
  body:
    fontFamily: "Figtree, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  manuscrite:
    fontFamily: "Caveat, cursive"
    fontSize: "1.7rem"
    fontWeight: 500
    lineHeight: 1.35
    letterSpacing: "0"
  meta:
    fontFamily: "Figtree, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9rem"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  bouton: "0.7rem"
  champ: "0.8rem"
  carte: "1.15rem"
  image: "1.4rem"
  pleine: "9999px"
spacing:
  xs: "0.375rem"
  sm: "0.75rem"
  md: "1.25rem"
  lg: "1.75rem"
  xl: "2.25rem"
  section: "5rem"
components:
  bouton-action:
    backgroundColor: "{colors.prune}"
    textColor: "{colors.blanc}"
    rounded: "{rounded.bouton}"
    padding: "0.75rem 1.5rem"
    height: "3rem"
  bouton-contour:
    backgroundColor: "transparent"
    textColor: "{colors.prune}"
    rounded: "{rounded.bouton}"
    padding: "0.75rem 1.5rem"
    height: "3rem"
  bouton-clair:
    backgroundColor: "{colors.blanc}"
    textColor: "{colors.prune}"
    rounded: "{rounded.bouton}"
    padding: "0.75rem 1.5rem"
    height: "3rem"
  bouton-discret:
    backgroundColor: "transparent"
    textColor: "{colors.prune}"
    rounded: "{rounded.bouton}"
    padding: "0.75rem 1.5rem"
    height: "3rem"
  bouton-desactive:
    backgroundColor: "{colors.desactive}"
    textColor: "{colors.encre-douce}"
    rounded: "{rounded.bouton}"
    padding: "0.75rem 1.5rem"
    height: "3rem"
  carte:
    backgroundColor: "{colors.blanc}"
    rounded: "{rounded.carte}"
    padding: "1.25rem"
  carte-douce:
    backgroundColor: "{colors.tuile-menthe}"
    rounded: "{rounded.carte}"
    padding: "1.75rem"
  champ-texte:
    backgroundColor: "{colors.blanc}"
    textColor: "{colors.encre}"
    rounded: "{rounded.champ}"
    padding: "1rem"
  coche-repos:
    backgroundColor: "{colors.blanc}"
    rounded: "{rounded.pleine}"
    size: "3rem"
  coche-faite:
    backgroundColor: "{colors.icone-vert}"
    textColor: "{colors.blanc}"
    rounded: "{rounded.pleine}"
    size: "3rem"
  onglet-actif:
    backgroundColor: "{colors.rose-pale}"
    textColor: "{colors.prune}"
    rounded: "{rounded.bouton}"
    padding: "0.625rem 0.75rem"
    height: "3rem"
---

# Design System: RenaiSens

## Overview

**Creative North Star: « Le phénix qui reprend ses couleurs »**

RenaiSens joue le standard de sa catégorie droit et à fond : fond crème chaud, cartes blanches à
coins doux posées dessus, photographies de femmes ouest-africaines, une seule couleur saturée pour
l'action. Il n'y a ni ironie, ni citation d'un monde précédent, ni matériau décoratif conservé « au
cas où ». Ce que la retenue achète, c'est de la place pour le seul objet d'auteur du produit : le
phénix arc-en-ciel, qui donne la palette entière — prune, magenta, rose, vert forêt, et les cinq
pastels des domaines viennent tous de son plumage.

Ce phénix n'est pas un ornement, c'est le dispositif de progression. Il est présent en entier dès la
première seconde, mais sans couleur ; chaque semaine tenue lui en rend une part. C'est ce qui
remplace la barre de pourcentage, et c'est la raison pour laquelle aucun score, aucune série, aucun
badge n'existe dans l'interface : la progression est déjà racontée, et elle l'est par une image qui
ne juge pas. Une semaine ratée laisse simplement le phénix là où il en était.

Le monde est dense en contenu et calme en signaux. Une seule couleur saturée — le prune — et
seulement là où l'on peut agir ; le vert forêt pour tout ce qui se lit sans se cliquer ; le magenta
pour les liens et la manuscrite. Un seul moment animé dans tout le produit. Deux traitements de
carte, et deux seulement. Chaque fois qu'une teinte signale un état, une matière, une forme ou une
phrase le signale aussi.

**Key Characteristics:**
- Fond crème chaud (`creme`), cartes blanches à ombre très basse, coins à 1,15 rem partout.
- Une seule couleur saturée pour l'action ; le reste de la saturation est réservé à l'identité.
- La couleur ne porte jamais l'information seule : matière, forme ou texte doublent toujours.
- Aucun score, aucune jauge, aucune série, aucun badge, et le non-fait sans rouge.
- Figtree en display et en texte, Caveat pour la voix manuscrite uniquement.
- Un seul moment orchestré : le retour des couleurs au phénix à la clôture du rituel.

## Colors

Une palette chaude tirée entièrement du phénix arc-en-ciel : trois roses saturés qui descendent du
prune au rose clair, un vert forêt qui les contredit, et cinq pastels très pâles qui portent
l'identité des domaines sans jamais rivaliser avec l'action.

### Primary
- **Prune profond** (`prune`) : la seule couleur saturée d'action. Fond des boutons principaux,
  contour et remplissage des pastilles et cases sélectionnées, texte et icône de l'onglet actif,
  bande d'appel à l'action de l'accueil. Rien de prune ne devrait être inerte ; si un élément prune
  ne se clique pas, c'est une erreur d'attribution, pas une nuance.
- **Prune désaturé de repos** (`coche-repos`) : le bord de la case à cocher au repos, à 3,85:1 sur
  blanc. Cette teinte existe pour une raison unique et documentée : un gris à 2:1 faisait de la case
  l'objet le plus pâle de sa ligne, alors que c'est le seul geste dont dépend la métrique de succès
  du produit. Ne pas la remplacer par un gris de bordure générique.

### Secondary
- **Magenta d'accent** (`magenta`) : les liens textuels, la flèche « voir tout », l'écriture
  manuscrite, l'anneau de focus, les pastilles du compte des semaines, le curseur et la barre de
  défilement. C'est la couleur de la voix et du chemin, jamais celle d'un bouton plein.
- **Rose de marque** (`rose`) : la sélection de texte, la piste de la barre de défilement, et les
  plumes hautes du phénix. Réservé aux surfaces du navigateur et au symbole.

### Tertiary
- **Vert forêt** (`foret`) : tous les titres `h1`/`h2`/`h3` par défaut, les faits chiffrés du héros,
  les numéros de jalons, les phrases de tensions et de forces, les libellés de questions. C'est la
  couleur de ce qui se lit et n'agit pas. Le partage de la hiérarchie entre forêt (lecture) et prune
  (action) est ce qui permet au bouton principal d'être évident sans être gros.
- **Les cinq pastels de domaine** (`tuile-rose`, `tuile-lavande`, `tuile-menthe`, `tuile-peche`,
  `tuile-ciel`) : fonds des tuiles de domaine et des cartes douces d'information.
- **Les cinq accents de domaine** (`icone-rose`, `icone-violet`, `icone-vert`, `icone-orange`,
  `icone-bleu`) : le trait des cinq marques dessinées. Le vert sert en outre à la case cochée.

### Neutral
- **Crème chaud** (`creme`) : le fond du document, sur toute sa hauteur.
- **Rose pâle** (`rose-pale`) : le fond du héros, celui de l'en-tête du profil et de la clôture du
  rituel, la pastille de l'onglet actif, et le fond de la carte d'action prioritaire.
- **Blanc** (`blanc`) : cartes surélevées, champs, rail latéral, barre d'onglets, barres d'actions
  flottantes.
- **Encre** (`encre`) et **encre douce** (`encre-douce`) : le texte courant et le texte secondaire.
- **Bord de champ** (`bord-champ`), **bord de coque** (`bord-coque`), **aplat désactivé**
  (`desactive`) : les trois neutres chauds structurels.

### Named Rules

**La règle de l'unique saturé.** Le prune est la seule couleur saturée posée en aplat, et seulement
sur ce qui agit. Test : si un aplat prune n'est ni un bouton, ni un état sélectionné, ni la bande
d'appel à l'action, il est mal placé.

**La règle du forêt qui n'agit pas.** Tout ce qui se lit sans se cliquer — titres, faits du héros,
numéros de jalons, phrases de tensions et de forces — est en vert forêt. Un titre en prune promet un
clic qui n'existe pas.

**La règle de la couleur jamais seule.** Aucun état n'est signalé par la teinte seule. L'onglet actif
a une pastille pleine derrière son icône ; la ligne choisie change de fond et reçoit une pastille
avec sa coche ; la jauge-phénix a des plumes colorées, quatre pastilles pleines ou creuses, et une
phrase écrite. Test : en niveaux de gris, l'état doit rester lisible.

**La règle des cinq domaines.** Cinq domaines, cinq teintes, cinq accents. Aucun partage. Deux
domaines sur une même couleur, c'est un système d'identité qui ment.

**La règle du non-fait sans rouge.** Rien dans le produit n'utilise de rouge d'alerte pour une action
non faite. Une case non cochée d'une semaine passée est un anneau gris clair (`#d8ccc5`) sur fond
transparent, sans compteur et sans mention. Une semaine ratée ne casse rien.

## Typography

**Display Font:** Figtree (avec `ui-sans-serif, system-ui, sans-serif`)
**Body Font:** Figtree — la même famille, appelée via `--police-texte`, qui pointe sur
`--police-display`
**Accent Font:** Caveat (avec `cursive`), pour la voix manuscrite uniquement

**Character:** une humaniste chaude et large, lisible sur un écran bon marché, qui tient les titres
en gras sans devenir criarde. Le contraste du monde ne vient pas d'un appariement de familles mais
d'un écart de poids et de couleur : forêt gras pour les titres, encre douce en régulier pour le
texte. Caveat n'entre que là où le produit parle avec sa voix.

### Hierarchy
- **Display** (700, `clamp(2.3rem, 7vw, 3.5rem)`, 1.12, `-0.022em`) : le titre du héros, en deux
  tons — forêt puis magenta sur la moitié de la phrase.
- **Headline** (700, 1.75–2 rem) : les titres de section de l'accueil, les `h1` des écrans d'usage.
- **Title** (700, 1.15–1.5 rem) : titres de cartes, de jalons, d'encarts.
- **Body** (400, 1,0625 rem, 1.6) : le texte courant, plafonné à 58 caractères de mesure.
- **Manuscrite** (500, 1,5–1,9 rem, 1.35) : citations, horizon à un an, phrases de freins et de
  visions. Magenta la plupart du temps, forêt quand la phrase est une citation d'elle-même relue.
- **Meta** (400, 0,82–0,92 rem, encre douce) : durées, compteurs de caractères, légendes,
  avertissements.
- **Chiffres** (`font-variant-numeric: tabular-nums`) : toute suite de chiffres qui peut changer sous
  les yeux — numéro de semaine, compteur de caractères, minutes d'effort, faits du héros.

### Named Rules

**La règle des 58ch.** Le texte courant est plafonné à `58ch`, pas 70. L'unité `ch` vaut la largeur
du chiffre zéro, sensiblement plus large que la lettre moyenne : à 70ch la ligne rendait près de cent
caractères, soit un tiers de plus que le plancher de lisibilité. Le cap est invisible sur téléphone
et décisif dès que la colonne s'ouvre à 58 rem.

**La règle des polices par variable propre.** Les polices sont exposées via `--police-display`,
`--police-texte` et `--police-manuscrite`, jamais via les variables `--font-*` de Tailwind. Celles-ci
ne sont émises dans la feuille finale que si une utilitaire Tailwind les consomme : sans consommateur
explicite, la variable n'existe pas, la déclaration retombe silencieusement sur la pile système, et
rien ne signale l'erreur. Une police qui disparaît sans message est le pire mode de panne
typographique.

**La règle de la manuscrite qui ne travaille pas.** Caveat ne porte jamais un libellé de bouton, une
étiquette, un nombre, ni une information dont la lecture doit être sûre. Elle porte de la voix. Ce
qui doit être compris du premier coup n'a pas à être joli.

**La règle du titre sans étiquette.** Aucune étiquette en capitales, aucun surtitre, aucun mot-clé
espacé au-dessus d'un titre. Le titre porte son propre poids. Ce qui doit être signalé comme
prioritaire l'est par le fond, la taille et une phrase dans le flux — jamais par une pastille de
texte posée au-dessus.

## Layout

Trois colonnes centrées, choisies selon le registre de la surface, et un seul point de bascule
structurel.

- **`.colonne`** — 34 rem, 44 rem à partir de 768 px, gouttière de 1,25 rem. Les surfaces de tâche
  linéaire : le bilan, les états d'attente.
- **`.colonne-app`** — 34 rem, 44 rem à 768 px, **58 rem à 1024 px** avec une gouttière portée à
  2,25 rem. Les écrans d'usage : aujourd'hui, plan, profil, rituel, réglages. L'ouverture à 1024 px
  est solidaire du rail : c'est elle qui rend au bureau une composition plutôt qu'un téléphone
  agrandi.
- **`.colonne-large`** — 80 rem, gouttière portée à 2,5 rem à 768 px. L'accueil et les sections
  pleine page.

**La bascule à 1024 px.** Sous ce seuil, une barre d'onglets collée en bas (fond blanc, bord haut
`bord-coque`), et les barres d'actions du bilan et du rituel flottent en `fixed inset-x-0 bottom-0`
au-dessus du contenu, qui réserve sa place par un `padding-bottom` généreux. À partir de 1024 px, la
barre d'onglets disparaît au profit d'un rail latéral de 15 rem, collant en haut, pleine hauteur, à
fond blanc et bord droit `bord-coque` ; les barres d'actions redeviennent `static`, perdent leur
fond, leur bord et leur ombre, et se rangent dans le flux. Une barre d'onglets de téléphone posée en
bas d'un écran de bureau n'est pas une adaptation.

**Où la navigation n'est pas.** Le rail et la barre d'onglets n'apparaissent qu'une fois le bilan
fait. Ils sont absents de `/bilan` (une tâche qu'on ne quitte pas par accident) et de `/profil` (le
pic émotionnel du produit). Le rail est en outre absent de l'accueil, qui est une page de conviction
pleine largeur portant son propre en-tête. `/profil` n'a donc jamais de rail, à aucune largeur.

**Rythme vertical.** Les sections de l'accueil sont séparées par 5 rem (`pt-20`), le héros et le
premier bloc par 6 rem. Dans les écrans d'usage, les blocs sont espacés de 3 à 4 rem et les éléments
d'une liste de 0,75 rem. Les grilles de bureau sont asymétriques et assumées :
`[1.05fr_0.95fr]` pour le héros, `[0.85fr_1.15fr]` pour le mode d'emploi.

## Elevation & Depth

Le monde est majoritairement plat et joue la profondeur par superposition tonale : crème dessous,
rose pâle pour les bandes, blanc pour ce qui est posé dessus. Une seule ombre existe dans tout le
système, très basse, réservée à la carte blanche.

### Shadow Vocabulary
- **Élévation de carte** (`box-shadow: 0 1px 2px rgb(35 35 42 / 0.04), 0 10px 26px -14px rgb(35 35 42 / 0.16)`) :
  la seule ombre du produit. Deux couches — un contact net d'un pixel, puis une diffusion large et
  remontée. Elle porte un décalage vertical ET un flou.

### Named Rules

**La règle de l'ombre qui tombe.** Une ombre porte un décalage et un flou. Un halo coloré centré sans
décalage n'est pas de la profondeur, c'est de la décoration ; il n'en existe aucun dans ce produit.

**La règle des deux cartes.** Il y a deux traitements de carte, et deux seulement : `.carte`, blanche
et surélevée, pour ce qu'on peut ouvrir ou manipuler ; `.carte-douce`, pastel et posée sans
élévation, pour ce qui informe. Même rayon, même famille. Un troisième traitement serait du bruit.
(Historique utile : `.carte-douce` a été appelée à quatre endroits avant d'exister, et ces blocs ont
rendu à angles droits sans lever la moindre erreur. Une classe absente n'échoue pas, elle abîme la
page en silence.)

## Shapes

Un seul vocabulaire de coins, doux et régulier, et une seule main de dessin pour toutes les icônes.

- **Cartes et encarts** : 1,15 rem, blanches ou pastel, sans bordure.
- **Boutons** : 0,7 rem, hauteur minimale de 3 rem.
- **Champs, options, cases de l'échelle** : 0,8 rem (0,7 rem pour l'échelle), bordure de 2 px en
  `bord-champ` au repos, prune quand la valeur est retenue.
- **Photographies** : 1,4 rem pour l'image du héros, 1,1 rem pour la bande d'ambiance.
- **Pastilles, coches, numéros de jalons** : cercles pleins.

**Le trait unique des icônes.** Toutes les icônes du produit — les cinq marques de domaine, les
quatre glyphes de navigation, la flèche « voir tout » — sont dessinées à la main dans le même
système : grille de 24, `stroke-width` 1.7, extrémités et jonctions arrondies, `fill: none`, aucun
aplat. Deux vocabulaires d'icônes sur un même écran, ce sont deux mains différentes sur un seul
dessin. Aucune icône ne vient d'une police de glyphes ni d'un jeu importé : elles sont écrites en
chemins SVG dans le dépôt.

**La règle du symbole vectoriel.** Le phénix est un SVG de 240×240 aux chemins nommés, jamais une
image raster : net du favicon de 16 px à l'écran de profil à 168 px, quelques kilo-octets, et chaque
plume peut porter sa couleur indépendamment.

## Components

### Buttons
- **Shape:** coins doux (0,7 rem), hauteur minimale de 3 rem, texte à 1 rem en 600.
- **Variantes:** `action` (aplat prune, texte blanc), `contour` (transparent, texte prune, anneau
  intérieur de 1,5 px), `clair` (blanc, texte prune, pour les fonds saturés), `discret`
  (transparent, texte prune souligné).
- **Hover / Focus:** `filter: brightness(1.08)` sur transition de `filter` et de `background-color`
  uniquement ; le focus visible est l'anneau global.
- **Désactivé:** aplat `desactive` (#ece5df) et texte encre douce.

**La règle des variantes par style en ligne.** La couleur d'un bouton passe toujours par sa variante,
posée en `style` en ligne, jamais par une classe `bg-*` ajoutée par-dessus. À spécificité égale,
c'est l'ordre de la feuille finale qui tranche — autrement dit le hasard du bundle. Le `className`
d'appel sert à la disposition (largeur, marge), pas à la teinte.

**La règle du désactivé en aplat.** L'état désactivé est un aplat neutre, jamais une opacité réduite.
Baisser l'opacité d'un bouton plein donne une teinte pâle sur un fond pâle, et le libellé passe sous
le seuil de contraste sans que personne le voie.

### Cards / Containers
- **Corner Style:** 1,15 rem, identique pour les deux traitements.
- **`.carte`:** blanche, l'ombre d'élévation, padding de 1,25 à 1,5 rem. Pour ce qui s'ouvre ou se
  manipule : une action, un récit, un changement de plan.
- **`.carte-douce`:** un aplat pastel choisi parmi les cinq tuiles, posé en `style`, aucune élévation,
  padding de 1,5 à 2,5 rem. Pour ce qui informe : la vie privée, le levier, l'encart de semaine.
- **Border:** aucune sur les cartes. Les seules bordures du système sont celles des champs, des
  options, et les traits de séparation de la coque.

### Inputs / Fields
- **Style:** fond blanc, bordure de 2 px `bord-champ`, coins à 0,8 rem, texte à 1,05 rem, placeholder
  en encre douce à 60 %.
- **Cible:** jamais moins de 48 px de haut ; les options de choix montent à 3,4 rem. Aucun menu
  déroulant, aucun curseur à faire glisser — le produit est pensé pour un pouce.
- **Sélectionné:** bordure prune, fond rose pâle, **et** une pastille de 32 px pleine avec sa coche
  blanche. Trois signaux, dont deux non colorés.
- **Échelle 1–5:** cinq cases de 3,5 rem en chiffres tabulaires, `role="radiogroup"`, avec les deux
  extrémités nommées en toutes lettres sous la rangée.
- **Compteur:** aligné à droite, chiffres tabulaires, 0,82 rem en encre douce.

### Navigation
- **Rail (≥ 1024 px):** 15 rem, blanc, collant, bord droit `bord-coque`. Le logo en haut, quatre
  entrées à 0,98 rem en 600, et en pied la seule phrase que le produit a intérêt à répéter — le
  calcul reste sur l'appareil. Aucune jauge-phénix dans le rail : la voir deux fois sur le même écran
  se lit comme un défaut de rendu.
- **Barre d'onglets (< 1024 px):** collée en bas, fond blanc, bord haut `bord-coque`, quatre
  colonnes égales de 3,6 rem minimum, icône de 19 px sur libellé de 0,74 rem.
- **Actif:** icône et libellé en prune, **et** une pastille ronde rose pâle derrière l'icône,
  **et** `aria-current="page"`. Inactif : trait d'icône `#9a8f95`, libellé encre douce.
- **Focus:** anneau magenta de 3 px à 3 px de décalage, blanc sur les fonds sombres
  (`.sur-fond-sombre`).

### Le phénix (composant signature)
Le symbole et le dispositif de progression, en un seul composant. `couches` va de 0 à 4 et vaut le
nombre de rituels tenus. À 0, l'oiseau est là **en entier**, mais en gris (`#ddd2cc`) : la forme
existe, la vie pas encore. Chaque semaine tenue colore une strate — le corps et la tête, puis les
ailes hautes, puis les ailes basses, puis la queue et l'œil. Le logo l'affiche toujours complet
(`couches` vaut 4 par défaut).

L'œil n'est jamais absent : avant la quatrième semaine il est simplement clair. Un œil manquant se
lit comme un rendu inachevé, pas comme une attente.

Il est toujours accompagné, jamais seul comme porteur d'information : `CompteSemaines` pose à côté
quatre pastilles pleines ou creuses **et** une phrase écrite qui dit où elle en est.

**La règle de la jauge interdite.** Le phénix remplace la barre de pourcentage. Il n'existe dans ce
produit ni barre de progression, ni anneau de complétion, ni radar, ni note, ni pourcentage. Les
scores existent dans le moteur pour répartir les actions et ne sortent jamais à l'écran.

### La carte d'action (composant signature)
La ligne la plus contrainte du produit.

- **La coche est l'élément premier de sa ligne** : 48 px, ronde, bordure de 2 px, posée **avant** le
  texte. Au repos, bord `coche-repos` sur fond blanc ; faite, aplat `icone-vert` avec une coche
  blanche de 2,6 px. C'est le seul geste dont dépend la métrique de succès du produit ; elle ne peut
  pas être l'objet le plus pâle de sa ligne.
- **En lecture seule** (semaines passées) la coche montre l'état réel — anneau `#d8ccc5` vide si ce
  n'est pas fait, avec l'état doublé en texte pour les lecteurs d'écran. Un titre barré à côté d'un
  anneau vide dit deux choses opposées, et c'est l'anneau qu'on croit.
- **L'action prioritaire** se signale par trois choses, dont aucune n'est une couleur seule : fond
  rose pâle sur la carte, titre en display agrandi (1,24 rem, 700, forêt), et la phrase « À faire en
  premier cette semaine. » dans le flux. Jamais d'étiquette en capitales au-dessus du titre.
- **La ligne de méta** (durée, « Faisable ce soir », « Version allégée ») ne porte aucune couleur
  saturée : rien de cette ligne ne se clique.
- **Aucun rouge, aucune alerte, aucun compteur** sur le « pas fait ». Quand une action est reprise en
  version allégée, c'est la version allégée qui s'affiche — jamais l'originale barrée.

## Do's and Don'ts

### Do:
- **Do** réserver le prune aux surfaces d'action, le magenta aux liens et à la manuscrite, le forêt à
  tout ce qui se lit sans se cliquer.
- **Do** doubler chaque état signalé par une teinte d'une matière, d'une forme ou d'une phrase. Test :
  en niveaux de gris, l'état reste lisible.
- **Do** poser la coche à 48 px, avant le texte, bord `coche-repos` au repos.
- **Do** signaler la priorité par un fond rose pâle, un titre display agrandi et une phrase dans le
  flux.
- **Do** choisir entre `.carte` (blanche, surélevée, ce qui s'ouvre) et `.carte-douce` (pastel,
  posée, ce qui informe), et n'inventer aucun troisième traitement.
- **Do** dessiner toute nouvelle icône dans le système existant : grille de 24, trait de 1,7,
  extrémités arrondies, aucun aplat.
- **Do** plafonner le texte courant à `58ch` et employer les chiffres tabulaires (`.chiffres`) pour
  toute suite de chiffres susceptible de changer.
- **Do** appeler les polices par `--police-display`, `--police-texte` et `--police-manuscrite`.
- **Do** neutraliser la durée **et** le décalage sous `prefers-reduced-motion`.

### Don't:
- **Don't** afficher un score, une note, un pourcentage, une jauge ou un radar. Les scores restent
  dans le moteur.
- **Don't** introduire une série, un badge, un compteur de régularité, ni marquer le non-fait en
  rouge. Une semaine ratée ne casse rien.
- **Don't** poser une étiquette en capitales, un surtitre ou un mot-clé espacé au-dessus d'un titre.
- **Don't** faire porter la couleur seule d'une information.
- **Don't** faire partager une teinte à deux domaines.
- **Don't** colorer un bouton par une classe `bg-*` ajoutée sur l'appel ; passer par la variante.
- **Don't** rendre un bouton désactivé par une opacité : utiliser l'aplat `desactive`.
- **Don't** ajouter un deuxième moment animé. Le retour des couleurs au phénix est le seul, et il se
  fait par superposition d'une jumelle grise — jamais par une transition de `fill` depuis une valeur
  inconnue. Le décalage de chaque plume est posé en ligne, parce que `nth-of-type` compterait aussi
  les jumelles grises.
- **Don't** conditionner la visibilité d'un contenu à une animation : `.revelation` retarde
  l'arrivée, elle ne cache jamais.
- **Don't** afficher un chiffre de traction, un taux de satisfaction, un avis ou un témoignage. Le
  produit n'a pas d'utilisatrices ; la rangée de chiffres de l'accueil porte des faits vérifiables
  sur le produit lui-même (8 min, 3, 0).
- **Don't** attacher une photographie à un récit ni laisser croire qu'une femme photographiée
  témoigne. Les récits sont illustratifs et l'interface le dit ; la bande d'ambiance est en `alt=""`
  avec sa légende explicite.
- **Don't** répéter la jauge-phénix deux fois sur un même écran.
