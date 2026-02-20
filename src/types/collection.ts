export type CompletionMode = 'origin' | 'general'
export type ObtainmentMethod = 'self-caught' | 'traded' | 'event' | 'pkhexed'

export interface Specimen {
  localId: string
  variantId: string
  originGameId: string
  obtainmentMethod: ObtainmentMethod
  eventName?: string
  isFavourite: boolean
  isInHome: boolean
  currentGameId?: string
  nickname?: string
  tags: string[]
  notes?: string
  caughtDate?: string
  homeDate?: string
  createdAt: string
}

export interface UserSettings {
  trainerNames: string[]
  defaultCompletionMode: CompletionMode
  ownedGameIds: string[]
  isTrackingShinies: boolean
  isTrackingAlpha: boolean
}