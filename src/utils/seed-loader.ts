import { db } from '../db'
import versionGroupsData from '../data/version-groups.json'
import gameTitlesData from '../data/game-titles.json'
import speciesData from '../data/species.json'
import formesData from '../data/formes.json'
import collectibleVariantsData from '../data/collectible-variants.json'
import gameAvailabilityData from '../data/game-availability.json'

import { VersionGroup, GameTitle, Species, Forme, CollectibleVariant, GameAvailability } from '../types/catalogue'

export async function seedDatabase(): Promise<void> {
  const existingCount = await db.versionGroups.count()
  if (existingCount > 0) return

  try {
    await db.versionGroups.bulkPut(versionGroupsData as VersionGroup[])
    await db.gameTitles.bulkPut(gameTitlesData as GameTitle[])
    await db.species.bulkPut(speciesData as Species[])
    await db.formes.bulkPut(formesData as Forme[])
    await db.collectibleVariants.bulkPut(collectibleVariantsData as CollectibleVariant[])
    await db.gameAvailability.bulkPut(gameAvailabilityData as GameAvailability[])

  } catch (error) {
    console.error('Failed to seed database:', error)
    throw error
  }
}