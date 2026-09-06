import type { DimensionId } from '@/types'

/**
 * Les Récits remplacent le fil communautaire ouvert.
 *
 * Une communauté vide dessert le produit, et un fil où des femmes exposent leurs finances et leur
 * vie familiale demande une modération qu'on n'a pas au premier jour. Les Récits donnent la même
 * chose — se reconnaître dans quelqu'un — sans exposer personne.
 *
 * INTÉGRITÉ : ces parcours sont ILLUSTRATIFS. Ce ne sont pas de vraies personnes, et l'app le dit
 * en clair sur la liste et sur chaque récit. On ne présente jamais un témoignage inventé comme réel.
 * Aucun chiffre de traction, aucun partenariat, aucune promesse de résultat.
 */

export const AVERTISSEMENT_RECITS =
  'Ces parcours sont illustratifs. Ils ont été écrits pour montrer à quoi ressemble une transition réelle — ce ne sont pas de vraies personnes, et aucun résultat n’est promis.'

export type Recit = {
  slug: string
  prenom: string
  age: number
  ville: string
  accroche: string
  dimension: DimensionId
  duree: string
  avant: string
  bascule: string
  apres: string
  /** Ce qu'elle a fait en premier — un id de la bibliothèque d'actions. */
  premiereAction: string
  /** Ce qui n'est pas réglé. Un récit sans reste est un récit qu'on ne croit pas. */
  reste: string
}

export const RECITS: Recit[] = [
  {
    slug: 'awa-comptable-patisserie',
    prenom: 'Awa',
    age: 32,
    ville: 'Abidjan',
    accroche: 'Comptable dans une PME, elle voulait partir depuis trois ans.',
    dimension: 'finances',
    duree: 'sept mois',
    avant:
      'Awa gagnait bien sa vie et détestait ses lundis. Elle faisait des gâteaux le week-end, on lui en commandait, elle ne comptait rien. Chaque fois qu’elle parlait de partir, on lui répondait la même chose : « avec un salaire pareil ? »',
    bascule:
      'Elle a arrêté de discuter et a fait un calcul. Ce qu’elle dépensait vraiment par mois, ce qu’il lui restait, combien de temps elle tiendrait sans salaire. La réponse était : cinq semaines. Ça l’a refroidie, puis ça lui a donné un chiffre à viser au lieu d’une dispute à gagner.',
    apres:
      'Elle est toujours salariée. Mais elle a huit mois de charges de côté, elle facture ses gâteaux au vrai prix depuis avril, et elle a une date : mars prochain. La différence, ce n’est pas le courage — c’est qu’elle sait combien.',
    premiereAction: 'fin-revenu-reel',
    reste:
      'Elle n’a toujours pas dit à son directeur qu’elle partirait. Elle dit qu’elle le fera « quand le chiffre sera atteint ». On verra.',
  },
  {
    slug: 'fatou-reprise-apres-maternite',
    prenom: 'Fatou',
    age: 34,
    ville: 'Dakar',
    accroche: 'Deux ans d’arrêt après son deuxième enfant. Le retour a été plus dur que le départ.',
    dimension: 'carriere',
    duree: 'cinq mois',
    avant:
      'Fatou était chargée de communication. Après son deuxième, elle a arrêté « six mois ». Ça a duré deux ans. Quand elle a recommencé à postuler, elle ne savait plus quoi dire du trou dans son CV, alors elle s’excusait — et ça se sentait dans chaque entretien.',
    bascule:
      'Elle a écrit trois réalisations chiffrées de son ancien poste. Trois. Ça lui a pris une heure et elle a pleuré au milieu, parce qu’elle avait oublié qu’elle avait fait ces choses-là. Ensuite elle a arrêté de présenter ses deux ans comme un trou.',
    apres:
      'Elle travaille à mi-temps pour deux clients, depuis chez elle, et elle a repris confiance plus vite que prévu. Le mi-temps n’était pas son plan A. Elle dit aujourd’hui que c’était le bon.',
    premiereAction: 'car-trois-realisations',
    reste:
      'Ses revenus sont à 60 % de ce qu’elle gagnait avant. Elle vise l’équivalent d’ici un an, sans certitude.',
  },
  {
    slug: 'nadia-couture-premiere-cliente',
    prenom: 'Nadia',
    age: 27,
    ville: 'Abidjan',
    accroche: 'Elle cousait depuis six ans. Elle n’avait jamais fait payer une inconnue.',
    dimension: 'projet',
    duree: 'trois mois',
    avant:
      'Nadia habillait ses cousines, ses collègues, les amies de ses collègues. Toujours gratuitement, ou « tu me donneras ce que tu veux ». Elle disait qu’elle n’était pas encore prête à vendre. Six ans que ce n’était pas encore.',
    bascule:
      'Elle a écrit dix prénoms de personnes qui pourraient payer. Elle en a appelé trois. Deux ont dit oui, avec un prix, avant même qu’elle ait fini d’expliquer. Le troisième non lui a appris qu’elle était trop chère pour les retouches et pas assez pour le sur-mesure.',
    apres:
      'Elle a un carnet de commandes, un prix affiché, et elle refuse maintenant les retouches. Ce n’est pas encore son métier principal. C’est déjà un revenu.',
    premiereAction: 'pro-dix-noms',
    reste: 'Elle travaille encore le soir après sa journée. Elle sait que ça ne tiendra pas comme ça.',
  },
  {
    slug: 'clarisse-apres-la-rupture',
    prenom: 'Clarisse',
    age: 38,
    ville: 'Abidjan',
    accroche: 'Après quinze ans de couple, elle a dû tout recompter seule.',
    dimension: 'soi',
    duree: 'huit mois',
    avant:
      'Clarisse n’avait jamais eu de compte à elle. Les décisions d’argent se prenaient à deux, et en pratique, sans elle. Quand la séparation est arrivée, elle ne savait pas ce que coûtait son propre loyer.',
    bascule:
      'Elle a commencé par la chose la plus petite possible : noter toutes ses dépenses pendant sept jours. Pas un budget, pas un plan. Sept jours. À la fin de la semaine, elle avait pour la première fois de sa vie une idée de ce que sa vie coûtait.',
    apres:
      'Un an après, elle gère son argent seule, elle a un coussin, et elle dit que le plus dur n’a pas été l’argent : c’était de s’autoriser à décider sans demander.',
    premiereAction: 'fin-carnet-7-jours',
    reste: 'Elle n’a pas repris de projet professionnel. Elle dit que ce n’est pas le moment. C’est une réponse valable.',
  },
  {
    slug: 'aisha-diaspora-retour',
    prenom: 'Aïsha',
    age: 31,
    ville: 'Paris, puis Dakar',
    accroche: 'Un bon poste en France, l’envie de rentrer, et personne à qui en parler.',
    dimension: 'entourage',
    duree: 'un an',
    avant:
      'Aïsha était consultante à Paris. Elle voulait rentrer à Dakar monter quelque chose, mais chaque fois qu’elle en parlait autour d’elle, on lui expliquait pourquoi c’était risqué. Elle a arrêté d’en parler, et l’idée est restée coincée deux ans.',
    bascule:
      'Elle a cherché deux femmes qui avaient fait exactement ce retour, et leur a écrit. Une n’a jamais répondu. L’autre l’a appelée trois jours plus tard et lui a parlé une heure — dont quarante minutes sur ce qui s’était mal passé.',
    apres:
      'Elle est rentrée avec un premier client déjà signé et une liste de choses à ne pas faire. Elle dit que cette liste valait plus que tous les conseils d’encouragement qu’on lui avait donnés.',
    premiereAction: 'ent-deux-femmes',
    reste: 'Sa famille en France ne comprend toujours pas sa décision. Elle a arrêté d’essayer de convaincre.',
  },
  {
    slug: 'mariam-cm-freelance',
    prenom: 'Mariam',
    age: 26,
    ville: 'Dakar',
    accroche: 'Community manager pour trois clients qui payaient tard, ou pas.',
    dimension: 'finances',
    duree: 'quatre mois',
    avant:
      'Mariam travaillait beaucoup et se retrouvait à découvert chaque fin de mois. Elle croyait que le problème était son tarif. Le problème était qu’elle n’osait pas relancer.',
    bascule:
      'Elle a écrit toutes les factures en attente sur une feuille. Il y en avait pour l’équivalent de deux mois de travail. Elle a envoyé un message court, sans excuses, aux trois clients. Deux ont payé dans la semaine.',
    apres:
      'Elle demande maintenant 50 % à la commande. Elle a perdu un client là-dessus, et elle dit que c’est le meilleur des trois qu’elle ait perdu.',
    premiereAction: 'fin-facture-relance',
    reste: 'Son revenu reste irrégulier. Elle constitue un coussin, lentement.',
  },
  {
    slug: 'kadia-coiffure-domicile',
    prenom: 'Kadia',
    age: 29,
    ville: 'Abidjan',
    accroche: 'Elle coiffait à domicile et travaillait à perte sans le savoir.',
    dimension: 'projet',
    duree: 'six mois',
    avant:
      'Kadia avait des clientes, du travail tous les samedis, et jamais d’argent. Elle mettait ça sur le compte du quartier, de la concurrence, de la période.',
    bascule:
      'Elle a calculé ce que lui coûtait une prestation : les produits, le transport, et ses heures. Sur trois de ses cinq prestations, elle perdait de l’argent. Elle a mis quinze jours à digérer ce calcul.',
    apres:
      'Elle a supprimé deux prestations et augmenté les autres. Elle a moins de clientes et gagne mieux sa vie. Elle dit que le plus dur a été d’annoncer les nouveaux prix aux anciennes.',
    premiereAction: 'pro-cout-unite',
    reste: 'Elle n’a toujours pas de local. Elle hésite, et elle a raison d’hésiter.',
  },
  {
    slug: 'sylvie-cadre-usee',
    prenom: 'Sylvie',
    age: 40,
    ville: 'Abidjan',
    accroche: 'Un poste que tout le monde lui enviait, et plus aucune envie.',
    dimension: 'carriere',
    duree: 'neuf mois',
    avant:
      'Sylvie dirigeait une équipe de douze personnes. Elle n’avait rien à reprocher à son travail — c’est précisément ce qui rendait la chose indéfendable en famille. « Tu veux quitter ça pour quoi ? »',
    bascule:
      'Elle n’a pas démissionné. Elle a relu son contrat, calculé son préavis, et posé une date au crayon dans son agenda : dans onze mois. Le simple fait d’avoir une date a rendu les mois suivants supportables.',
    apres:
      'Elle est partie au bout de treize mois, deux de plus que prévu, avec un poste de conseil à mi-temps et une activité de formation qui démarre. Ce n’est pas un grand saut. C’est une glissade contrôlée.',
    premiereAction: 'car-preavis-verifier',
    reste: 'Elle gagne un tiers de moins. Elle dit que ça vaut le coup ; elle le redira dans deux ans.',
  },
  {
    slug: 'aminata-idee-secrete',
    prenom: 'Aminata',
    age: 25,
    ville: 'Dakar',
    accroche: 'Une idée gardée pour elle pendant deux ans, par peur du ridicule.',
    dimension: 'soi',
    duree: 'quatre mois',
    avant:
      'Aminata voulait lancer un service de soutien scolaire à domicile. Elle n’en avait parlé à personne — ni à sa mère, ni à ses amies. Elle disait qu’elle attendait d’avoir tout prêt.',
    bascule:
      'Elle a envoyé un message vocal à une amie pour lui dire ce qu’elle préparait. Rien de plus. Son amie lui a répondu en lui demandant si elle prenait des élèves, parce que sa sœur cherchait.',
    apres:
      'Elle a eu sa première élève trois semaines après le vocal, avant même d’avoir un nom ou une page. Elle dit que les deux ans de préparation n’ont servi à rien, et que le vocal a tout déclenché.',
    premiereAction: 'ent-vocal-amie',
    reste: 'Elle n’a que quatre élèves. Elle apprend à dire son prix sans le baisser d’elle-même.',
  },
  {
    slug: 'grace-charge-mentale',
    prenom: 'Grâce',
    age: 36,
    ville: 'Abidjan',
    accroche: 'Trois enfants, un emploi, et le projet de tout le monde sauf le sien.',
    dimension: 'entourage',
    duree: 'six mois',
    avant:
      'Grâce était celle vers qui tout convergeait : les devoirs, la logistique familiale, les urgences des autres. Son projet de boutique en ligne existait dans un carnet, depuis quatre ans, sans avancer d’une page.',
    bascule:
      'Elle a écrit sur une feuille tout ce qu’elle portait à la maison. Il y avait trente-quatre lignes. Elle a montré la feuille — sans discours — et proposé d’en confier deux.',
    apres:
      'Elle a récupéré deux heures le mercredi soir. Sa boutique existe depuis, avec onze produits. Deux heures par semaine, ce n’est pas beaucoup ; c’est infiniment plus que zéro.',
    premiereAction: 'ent-repartir-taches',
    reste: 'Les deux tâches confiées sont revenues vers elle une fois sur trois. Elle recommence la conversation.',
  },
  {
    slug: 'binta-entre-deux-emplois',
    prenom: 'Binta',
    age: 30,
    ville: 'Dakar',
    accroche: 'Licenciée en janvier, sans projet, et pressée de toutes parts d’en avoir un.',
    dimension: 'projet',
    duree: 'cinq mois',
    avant:
      'Binta a perdu son poste en janvier. Autour d’elle, tout le monde avait une suggestion : ouvrir un commerce, partir à l’étranger, reprendre des études. Elle disait oui à tout le monde et ne faisait rien.',
    bascule:
      'Elle a arrêté de chercher un projet. Elle a repris trois choses : une heure de coucher, ses dépenses notées, et une personne à qui elle parlait chaque semaine. Pendant six semaines, elle n’a rien cherché d’autre.',
    apres:
      'Le projet est venu au deuxième mois, par une conversation, pas par une réflexion. Elle fait de la comptabilité pour de petites structures, ce qu’elle avait toujours fait, mais à son compte.',
    premiereAction: 'soi-sommeil-alarme',
    reste: 'Elle n’a que deux clients réguliers. Elle en cherche un troisième sans se presser.',
  },
]

const PAR_SLUG = new Map(RECITS.map((r) => [r.slug, r]))

export function recit(slug: string): Recit | undefined {
  return PAR_SLUG.get(slug)
}

export function recitsPourDimension(d: DimensionId): Recit[] {
  return RECITS.filter((r) => r.dimension === d)
}
