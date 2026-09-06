import { NextResponse } from 'next/server'

/**
 * Stub de liste d'attente RenaiSens+.
 *
 * Volontairement sans dependance et sans variable d'environnement : le projet doit se deployer sur
 * Vercel sans aucune configuration, et c'est une propriete a ne pas casser.
 *
 * Pour brancher Resend ou Supabase plus tard, il n'y a qu'un endroit a changer : la fonction
 * `enregistrer` ci-dessous. Rien d'autre dans le produit ne connait ce chemin.
 */

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

async function enregistrer(email: string): Promise<void> {
  // Etape suivante : POST vers Resend (audiences) ou insert Supabase.
  // En attendant, on journalise. Aucune donnee du bilan ne transite ici : seulement l'adresse.
  console.info('[waitlist]', JSON.stringify({ email, le: new Date().toISOString() }))
}

export async function POST(requete: Request) {
  let corps: unknown
  try {
    corps = await requete.json()
  } catch {
    return NextResponse.json({ erreur: 'Corps illisible.' }, { status: 400 })
  }

  const email =
    typeof corps === 'object' && corps !== null && 'email' in corps
      ? String((corps as { email: unknown }).email).trim().toLowerCase()
      : ''

  if (!EMAIL.test(email) || email.length > 254) {
    return NextResponse.json({ erreur: 'Adresse invalide.' }, { status: 400 })
  }

  await enregistrer(email)
  return NextResponse.json({ ok: true })
}
