/**
 * Le seul fichier à éditer pour changer de marché.
 *
 * Tout ce qui est local — devise, montants de référence, services de paiement, villes, guichets
 * administratifs, exemples de métiers — passe par ici. Les actions, les récits et les textes de
 * l'onboarding le lisent ; aucun d'eux ne code un franc CFA ou un « Wave » en dur.
 *
 * Segment pilote : femmes francophones de 25 à 40 ans, Afrique de l'Ouest urbaine
 * (Abidjan, Dakar) et diaspora francophone, en moment de bascule.
 */

export const MARCHE = {
  id: 'afrique-ouest-fr',
  libelle: "Afrique de l'Ouest francophone et diaspora",

  devise: {
    code: 'XOF',
    symbole: 'F',
    nom: 'franc CFA',
  },

  /**
   * Montants de référence. Choisis pour être crédibles sans être prescriptifs :
   * une somme qu'une salariée d'Abidjan ou de Dakar peut mettre de côté sans se priver.
   */
  montants: {
    microEpargneHebdo: 5000,
    coussinPremierPalier: 100000,
    coussinTroisMois: 450000,
    budgetTestOffre: 25000,
    prixPlancherPrestation: 30000,
  },

  paiement: {
    principal: 'Wave',
    autres: ['Orange Money', 'MTN MoMo', 'Moov Money'],
    /** Ce qui sera branché en v2. Documenté dans ROADMAP.md. */
    railV2: ['Wave', 'Orange Money', 'MTN MoMo'],
  },

  villes: ['Abidjan', 'Dakar'],

  administratif: {
    guichetEntreprise: 'CEPICI (Abidjan) ou APIX (Dakar)',
    statutSimple: 'entreprise individuelle',
    registreCommerce: 'RCCM',
  },

  reseaux: {
    conversation: 'WhatsApp',
    vitrine: 'Instagram',
    pro: 'LinkedIn',
  },

  /** Exemples d'activités, utilisés dans les récits et les libellés d'actions. */
  activites: [
    'pâtisserie sur commande',
    'coiffure à domicile',
    'community management',
    'couture sur mesure',
    'coaching scolaire',
    'comptabilité freelance',
  ],
} as const

/** « 5 000 F ». Formatage manuel : pas de dépendance à la locale du navigateur. */
export function montant(n: number): string {
  const s = Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  return `${s} ${MARCHE.devise.symbole}`
}
