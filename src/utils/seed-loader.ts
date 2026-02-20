import { db } from '../db'
import { VersionGroup, GameTitle, Species, Forme, CollectibleVariant, GameAvailability } from '../types/catalogue'

export async function seedDatabase(): Promise<void> {
  // check if already seeded
  const existingCount = await db.versionGroups.count()
  if (existingCount > 0) return

  try {
    // fetch and seed version groups
    const vgResponse = await fetch('/data/version-groups.json')
    const versionGroups: VersionGroup[] = await vgResponse.json()
    await db.versionGroups.bulkPut(versionGroups)

    const gtResponse = await fetch('/data/game-titles.json')
    const gameTitles: GameTitle[] = await gtResponse.json()
    await db.gameTitles.bulkPut(gameTitles)

    const speciesResponse = await fetch('/data/species.json')
    const species: Species[] = await speciesResponse.json()
    await db.species.bulkPut(species)

    const formeResponse = await fetch('/data/formes.json')
    const formes: Forme[] = await formeResponse.json()
    await db.formes.bulkPut(formes)

    const cvResponse = await fetch('/data/collectible-variants.json')
    const collectibleVariants: CollectibleVariant[] = await cvResponse.json()
    await db.collectibleVariants.bulkPut(collectibleVariants)

    const gaResponse = await fetch('/data/game-availability.json')
    const gameAvailability: GameAvailability[] = await gaResponse.json()
    await db.gameAvailability.bulkPut(gameAvailability)

  } catch (error) {
    console.error('Failed to seed database:', error)
    throw error
  }
}