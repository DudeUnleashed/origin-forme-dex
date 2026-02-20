export type GameType = 'main' | 'remake' | 'spinoff' | 'legends'
export type FormeType = 'base' | 'gender' | 'event' | 'regional' | 'cosmetic'
export type GenderRequirement = 'male' | 'female' | 'none'
export type AvailabilityMethod = 'wild' | 'gift' | 'evolution' | 'trade-npc' | 'trade-version-exclusive' | 'trade-external' | 'transfer-only' | 'event'

export interface VersionGroup {
  id: string
  name: string
  releaseOrder: number
  gameType: GameType
}

export interface GameTitle {
  id: string
  name: string
  versionGroupId: string
}

export interface Species {
  id: string
  name: string
  introducedGroupId: string
  prevolutionId?: string
}

export interface Forme {
  id: string
  speciesId: string
  displayName: string
  formeType: FormeType
  isHomeVisible: boolean
  genderRequirement: GenderRequirement
}

export interface CollectibleVariant {
  id: string
  formeId: string
  isShiny: boolean
  isAlpha: boolean
}

export interface GameAvailability {
  variantId: string
  gameTitleId: string
  availabilityMethod: AvailabilityMethod
  notes?: string
  isVersionExclusive: boolean
}