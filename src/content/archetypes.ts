import type { Archetype } from '@/types'

/**
 * Huit archétypes — mais des archétypes de *situation*, pas de personnalité.
 *
 * Un nom de personnalité (« La Bâtisseuse ») flatte et ne se vérifie pas. Une situation, elle peut
 * la reconnaître ou la rejeter. C'est exactement ce que demande la phrase de contrôle : « reconnaît
 * sa propre situation ». Rien ici n'est ésotérique, rien n'est un compliment déguisé.
 *
 * Sélection : `tension` compte double, `force` compte simple, départage par ordre du tableau.
 * Déterministe — deux fois le même profil donne deux fois le même archétype.
 */
export const ARCHETYPES: Archetype[] = [
  {
    id: 'sait-ou-va',
    titre: 'Tu sais où tu vas. Tu ne sais pas avec quel argent.',
    situation:
      'Ton projet est clair dans ta tête, tu pourrais l’expliquer à n’importe qui. Ce qui bloque n’est pas l’idée : c’est que tu n’as aucune idée du montant qu’il te faut, ni de combien de temps tu tiendrais si ça ne marchait pas tout de suite.',
    levier:
      'On commence par les chiffres, pas par l’idée. Trois semaines pour savoir exactement ce que tu peux te permettre — après, tu décideras vite.',
    tension: 'finances',
    force: 'projet',
  },
  {
    id: 'porte-tout-le-monde',
    titre: 'Tu portes tout le monde. Personne ne porte ton projet.',
    situation:
      'Ton entourage compte sur toi, et il a raison : tu réponds toujours. Le problème n’est pas là. Le problème, c’est que ton projet est la seule chose de ta liste qui n’a jamais d’échéance, parce que personne ne te la réclame.',
    levier:
      'On ne va pas te demander d’en faire plus. On va rendre ton temps visible, et en récupérer un morceau — un seul, mais fixe.',
    tension: 'soi',
    force: 'entourage',
  },
  {
    id: 'poste-fini',
    titre: 'Tu tiens financièrement. Tu ne tiens plus ton poste.',
    situation:
      'L’argent rentre, la maison tourne, et pourtant tu comptes les jours. Ce n’est pas une crise, c’est une usure — et c’est plus difficile à justifier autour de toi qu’un vrai problème.',
    levier:
      'Ta position financière est ton avantage : elle te permet de préparer une sortie propre au lieu de partir en claquant la porte.',
    tension: 'carriere',
    force: 'finances',
  },
  {
    id: 'idee-sans-cliente',
    titre: 'Tu as une idée. Il te manque la première cliente.',
    situation:
      'Tu y penses depuis des mois, tu as même le nom. Mais tu n’as encore vendu à personne, et tant que ce n’est pas arrivé, tout reste une hypothèse — y compris pour toi.',
    levier:
      'Tout le plan pointe vers un seul événement : que quelqu’un te paie une fois. Le reste peut attendre.',
    tension: 'projet',
    force: 'carriere',
  },
  {
    id: 'argent-invisible',
    titre: 'Tu gagnes ta vie, et tu ne sais pas où passe l’argent.',
    situation:
      'Tu travailles, tu es payée, et pourtant à la fin du mois il ne reste rien. Ce n’est pas un problème de revenu, c’est un problème de visibilité — et ça se règle plus vite qu’on ne le croit.',
    levier:
      'Trente jours suffisent à voir le motif. On regarde d’abord, on coupe ensuite. Jamais l’inverse.',
    tension: 'finances',
    force: 'carriere',
  },
  {
    id: 'seule-devant',
    titre: 'Tu avances. Mais tu avances seule.',
    situation:
      'Tu fais des choses, tu tiens tes engagements, tu n’attends pas qu’on te pousse. Ce qui te coûte, c’est qu’il n’y a personne autour à qui raconter ça sans avoir à tout expliquer depuis le début.',
    levier:
      'Trouver deux ou trois personnes qui font la même chose que toi changera plus ton année que n’importe quelle formation.',
    tension: 'entourage',
    force: 'projet',
  },
  {
    id: 'capable-pas-autorisee',
    titre: 'Tu es compétente. Tu ne t’es pas encore donné l’autorisation.',
    situation:
      'Sur le papier, tu es prête — on te le dit, d’ailleurs. Mais tu attends encore quelque chose : un diplôme de plus, un feu vert, un moment où tu te sentiras enfin légitime. Ce moment n’arrive pas tout seul.',
    levier:
      'On travaille par preuves, pas par discours : de petites actions publiques, répétées, jusqu’à ce que l’argument « je ne suis pas prête » ne tienne plus.',
    tension: 'soi',
    force: 'carriere',
  },
  {
    id: 'repart-de-zero',
    titre: 'Tu repars de zéro, et tu le sais déjà.',
    situation:
      'Quelque chose s’est terminé — un emploi, un couple, une ville, une période. Tu n’as pas encore de projet, et on te presse d’en avoir un. Tu n’as pas besoin d’un projet cette semaine. Tu as besoin d’un sol.',
    levier:
      'On commence par ce qui te tient debout : le rythme, les chiffres, une personne à qui parler. Le projet viendra quand il y aura de la place pour lui.',
    tension: 'projet',
    force: 'soi',
  },
]

const PAR_ID = new Map(ARCHETYPES.map((a) => [a.id, a]))

export function archetype(id: string): Archetype {
  const a = PAR_ID.get(id)
  if (!a) throw new Error(`Archétype inconnu : ${id}`)
  return a
}
