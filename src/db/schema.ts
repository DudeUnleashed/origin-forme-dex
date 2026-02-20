import Dexie, { Table } from 'dexie'
import { Specimen, UserSettings } from '../types/collection'
import { VersionGroup, GameTitle, Species, Forme, CollectibleVariant, GameAvailability } from '../types/catalogue'

class PokedexDatabase extends Dexie {
  specimens!: Table<Specimen>
  userSettings!: Table<UserSettings>
  versionGroups!: Table<VersionGroup>
  gameTitles!: Table<GameTitle>
  species!:  Table<Species>
  formes!: Table<Forme>
  collectibleVariants!: Table<CollectibleVariant>
  gameAvailability!: Table<GameAvailability>

  constructor() {
    super('PokedexDatabase')
    this.version(1).stores({
      specimens: 'localId, variantId, originGameId, isFavourite, *tags',
      userSettings: '&id',
      versionGroups: '&id, releaseOrder',
      gameTitles: 'id, versionGroupId',
      species: 'id, introducedGroupId',
      formes: 'id, speciesId, formeType, isHomeVisible',
      collectibleVariants: 'id, formeId, isShiny, isAlpha',
      gameAvailability: '[variantId+gameTitleId], variantId, gameTitleId, isVersionExclusive'
    })
  }
}

export const db = new PokedexDatabase()