# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Femmes francophones de 25 à 40 ans, Afrique de l'Ouest urbaine (Abidjan, Dakar) et diaspora
francophone, dans un moment de bascule : reconversion, sortie du salariat, lancement d'une activité,
reprise après maternité, reconstruction après une rupture.

Elle utilise le produit dans des moments volés — un taxi, après le coucher des enfants, entre deux
tâches au bureau. Souvent sur un Android d'entrée de gamme, sur un réseau instable. Elle est dans une
transition qu'elle n'a peut-être dite à personne.

Son travail : faire le point honnêtement, décider ce qu'elle veut vraiment, et tenir un plan assez
petit pour survivre à une mauvaise semaine.

## Product Purpose

Quatre temps : elle découvre où elle en est (bilan de 22 questions sur 5 dimensions), elle définit qui
elle veut devenir (profil de renaissance), elle reçoit un plan de 30 jours, et elle le tient semaine
après semaine par un rituel hebdomadaire de trois minutes.

Le quatrième temps est le produit. Les trois premiers ne valent que s'il a lieu.

**Le succès se mesure à un seul chiffre : le pourcentage de femmes qui complètent le rituel de la
semaine 2.** Pas les inscriptions, pas les bilans terminés, pas le temps passé.

## Positioning

Le plan est vivant : il se réécrit à partir de ce qu'elle a réellement fait ou pas fait. Une action
non faite deux semaines de suite n'est jamais répétée à l'identique — elle est proposée à la baisse.
Une troisième fois, elle sort du plan.

Ce qu'un produit voisin ne pourrait pas copier honnêtement :

- **Le temps qu'elle déclare plafonne mécaniquement la taille du plan.** « Des miettes, moins d'une
  heure » produit deux actions par semaine, pas trois.
- **Les actions sont ancrées sur son marché**, pas génériques : « Ouvre un compte Wave et programme un
  virement de 5 000 F chaque vendredi », pas « ouvre un compte épargne ».
- **Le moteur est déterministe et local** — aucun appel LLM, aucune clé d'API, aucun réseau. Deux
  ouvertures du même profil donnent le même plan.
- **Une semaine ratée ne casse rien.** La semaine en cours se calcule sur ses rituels, jamais sur le
  calendrier.

## Operating Context

Réseau instable, appareils modestes, sessions courtes et interrompues. Le rituel hebdomadaire ne fait
aucun appel réseau : tout est calculé sur l'appareil.

Le contexte financier local est une donnée de travail, pas un décor : franc CFA, Wave et Orange Money
comme rails de paiement, CEPICI et APIX comme guichets d'entreprise, tontines. Tout ce qui est
spécifique au marché est centralisé dans `src/config/market.ts` — changer de pays est une seule
édition.

## Capabilities and Constraints

- 22 questions d'onboarding sur 5 dimensions (soi, carrière, finances, projet, entourage), dont trois
  champs libres qu'elle relit en semaine 4.
- Bibliothèque de 92 actions typées, avec prérequis et version réduite pour chacune.
- Moteur en quatre modules purs (score, profil, plan, adaptation), couvert par 70 tests.
- 11 récits éditorialisés.
- **Aucun compte, aucune authentification, aucune base de données, aucune variable d'environnement.**
  L'état vit dans `localStorage` derrière une interface `StorageAdapter` : brancher une base plus tard
  est un seul fichier à changer.
- Rien n'est payant. Le seul point de monétisation testé est une adresse e-mail pour « RenaiSens+ »,
  qui n'existe pas encore et ne promet aucune date.
- Le rail de paiement d'une v2 serait le mobile money (Wave, Orange Money, MTN MoMo), pas Stripe seul.
- **Décision utilisateur en cours :** le budget de performance d'origine (< 200 Ko de JS par route,
  ouverture en moins de 2,5 s en 3G lente) a été levé au profit du résultat visuel. Le coût réel doit
  être mesuré et rapporté en secondes à chaque étape. Les écrans quotidiens restent les plus légers.

## Brand Commitments

- **Le nom.** « RenaiSens ». La graphie peut être normalisée ainsi ; la capitalisation interne de la
  version d'origine n'est pas contraignante.
- **Le phénix reste le symbole du produit**, y compris redessiné dans un tout autre langage visuel.
- **Le produit reste gratuit et sans compte.** Aucune fonctionnalité réservée à un abonnement.
- **La signature culturelle est un artisanat féminin ouest-africain, nommé et crédité précisément** —
  jamais un vague « motif africain ». Quel artisanat exactement n'est pas encore décidé.
- **La voix.** Français, tutoiement, voix active, phrases courtes. Une amie plus avancée qui sait de
  quoi elle parle : ni coach américain, ni thérapeute, ni institution. Elle n'est pas malade, elle est
  en transition. Les boutons disent ce qui se passe (« Voir mon plan »), jamais « Continuer ».
- La phrase de promesse actuelle (« Devenir une nouvelle version de soi ») **n'est pas figée** et peut
  être réécrite.

## Evidence on Hand

- **Les 11 récits sont illustratifs et l'app le dit.** Ce ne sont pas de vraies personnes. Ils ne
  doivent jamais être présentés comme des témoignages, et aucun portrait réel ne doit leur être
  attaché.
- **Aucune utilisatrice réelle à ce jour, aucun chiffre de traction, aucun partenariat.** Rien de tout
  cela ne doit être fabriqué pour les besoins d'une page.
- Produit déployé : `renaisens.vercel.app`, dépôt `github.com/soulkushh-bot/renaisens`.
- Photos : aucune à ce jour. À sourcer sous licence libre vérifiée, avec provenance enregistrée.

## Product Principles

1. **Le produit ne s'arrête pas au diagnostic.** Un questionnaire qui rend un document est un moment
   fort suivi de rien.
2. **Trois actions par semaine au maximum, une seule prioritaire.** Une femme en transition n'a pas
   douze créneaux ; un plan trop lourd est abandonné en semaine 2.
3. **Une semaine ratée ne casse rien.** Pas de série remise à zéro, pas de compteur rouge, pas de
   rattrapage. Le produit doit être plus indulgent qu'une app de fitness.
4. **Aucun score n'est montré** — ni chiffre, ni jauge, ni radar. Les scores existent dans le moteur
   pour répartir les actions et n'en sortent jamais.
5. **La confiance est le produit.** Rien d'inventé n'est présenté comme réel, et ce qui est
   illustratif est signalé comme tel.

## Accessibility & Inclusion

- Produit entièrement en français.
- **La couleur ne porte jamais l'information seule** : tout état signalé par une teinte l'est aussi
  par de la matière, une forme ou du texte.
- `prefers-reduced-motion` respecté partout ; aucun contenu ne dépend d'une animation pour être lisible.
- Contraste WCAG AA sur chaque paire texte/fond, y compris en plein jour sur un écran bon marché.
- Cibles tactiles d'au moins 48 px : le produit se tient à une main.
