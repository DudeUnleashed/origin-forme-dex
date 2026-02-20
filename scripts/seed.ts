import { Dex } from '@pkmn/dex'
import * as fs from 'fs'
import { fileURLToPath } from 'url'
import * as path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


// manual list of species with visible gender differences in Home
const GENDER_DIFFERENCE_SPECIES = [
  'Venusaur', 'Butterfree', 'Rattata', 'Raticate', 'Pikachu', 'Raichu',
  'Zubat', 'Golbat', 'Gloom', 'Vileplume', 'Kadabra', 'Alakazam',
  'Doduo', 'Dodrio', 'Hypno', 'Rhyhorn', 'Goldeen', 'Seaking',
  'Wobbuffet', 'Girafarig', 'Gligar', 'Steelix', 'Scizor', 'Heracross',
  'Sneasel', 'Teddiursa', 'Ursaring', 'Piloswine', 'Octillery', 'Houndoom',
  'Donphan', 'Torchic', 'Combusken', 'Blaziken', 'Beautifly', 'Dustox',
  'Ludicolo', 'Nuzleaf', 'Shiftry', 'Meditite', 'Medicham', 'Roselia',
  'Gulpin', 'Swalot', 'Numel', 'Camerupt', 'Cacturne', 'Milotic',
  'Relicanth', 'Combee', 'Pachirisu', 'Buizel', 'Floatzel', 'Ambipom',
  'Gible', 'Gabite', 'Garchomp', 'Hippopotas', 'Hippowdon', 'Croagunk',
  'Toxicroak', 'Finneon', 'Lumineon', 'Snover', 'Abomasnow', 'Unfezant',
  'Frillish', 'Jellicent', 'Pyroar', 'Meowstic', 'Indeedee', 'Basculegion',
  'Oinkologne'
]

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '')
}

function shouldExclude(species: any): boolean {
  // only exclude these specific nonstandard types
  if (species.isNonstandard === 'CAP') return true        // fan-made create-a-pokemon
  if (species.isNonstandard === 'LGPE') return true       // lets go only mechanics
  if (species.isNonstandard === 'Pokestar') return true   // pokestar studios
  if (species.isNonstandard === 'Unobtainable') return true

  if (species.num <= 0) return true // catches missingno and other glitch mon

  // exclude battle-only formes
  if (species.name.includes('-Mega')) return true
  if (species.name.includes('-Gmax') || species.name.includes('-GMax')) return true
  if (species.name.includes('-Primal')) return true
  if (species.name.includes('-Totem')) return true
  if (species.name.includes('-Busted')) return true       // Mimikyu
  if (species.name.includes('-Hangry')) return true       // Morpeko
  if (species.name.includes('-School')) return true       // Wishiwashi

  return false
}

function getFormeType(species: any): string {
  const forme = species.forme
  if (!forme) return 'base'
  if (['Alola', 'Galar', 'Hisui', 'Paldea'].some(r => forme.includes(r))) return 'regional'
  if (species.isCosmeticForme) return 'cosmetic'
  return 'event'
}

// --- VERSION GROUPS ---
const versionGroups = [
  { id: 'rby', name: 'Red, Blue & Yellow', releaseOrder: 1, gameType: 'main' },
  { id: 'gsc', name: 'Gold, Silver & Crystal', releaseOrder: 2, gameType: 'main' },
  { id: 'rse', name: 'Ruby, Sapphire & Emerald', releaseOrder: 3, gameType: 'main' },
  { id: 'frlg', name: 'FireRed & LeafGreen', releaseOrder: 4, gameType: 'remake' },
  { id: 'colosseum', name: 'Pokémon Colosseum', releaseOrder: 5, gameType: 'spinoff' },
  { id: 'xd', name: 'Pokémon XD: Gale of Darkness', releaseOrder: 6, gameType: 'spinoff' },
  { id: 'dpp', name: 'Diamond, Pearl & Platinum', releaseOrder: 7, gameType: 'main' },
  { id: 'hgss', name: 'HeartGold & SoulSilver', releaseOrder: 8, gameType: 'remake' },
  { id: 'bw', name: 'Black & White', releaseOrder: 9, gameType: 'main' },
  { id: 'bw2', name: 'Black 2 & White 2', releaseOrder: 10, gameType: 'main' },
  { id: 'xy', name: 'X & Y', releaseOrder: 11, gameType: 'main' },
  { id: 'oras', name: 'Omega Ruby & Alpha Sapphire', releaseOrder: 12, gameType: 'remake' },
  { id: 'sm', name: 'Sun & Moon', releaseOrder: 13, gameType: 'main' },
  { id: 'usum', name: 'Ultra Sun & Ultra Moon', releaseOrder: 14, gameType: 'main' },
  { id: 'lgpe', name: "Let's Go Pikachu & Eevee", releaseOrder: 15, gameType: 'remake' },
  { id: 'swsh', name: 'Sword & Shield', releaseOrder: 16, gameType: 'main' },
  { id: 'pla', name: 'Legends: Arceus', releaseOrder: 17, gameType: 'legends' },
  { id: 'bdsp', name: 'Brilliant Diamond & Shining Pearl', releaseOrder: 18, gameType: 'remake' },
  { id: 'sv', name: 'Scarlet & Violet', releaseOrder: 19, gameType: 'main' },
  { id: 'lza', name: 'Legends: Z-A', releaseOrder: 20, gameType: 'legends' },
]

// --- GAME TITLES ---
const gameTitles = [
  { id: 'red', name: 'Pokémon Red', versionGroupId: 'rby' },
  { id: 'blue', name: 'Pokémon Blue', versionGroupId: 'rby' },
  { id: 'yellow', name: 'Pokémon Yellow', versionGroupId: 'rby' },
  { id: 'gold', name: 'Pokémon Gold', versionGroupId: 'gsc' },
  { id: 'silver', name: 'Pokémon Silver', versionGroupId: 'gsc' },
  { id: 'crystal', name: 'Pokémon Crystal', versionGroupId: 'gsc' },
  { id: 'ruby', name: 'Pokémon Ruby', versionGroupId: 'rse' },
  { id: 'sapphire', name: 'Pokémon Sapphire', versionGroupId: 'rse' },
  { id: 'emerald', name: 'Pokémon Emerald', versionGroupId: 'rse' },
  { id: 'firered', name: 'Pokémon FireRed', versionGroupId: 'frlg' },
  { id: 'leafgreen', name: 'Pokémon LeafGreen', versionGroupId: 'frlg' },
  { id: 'colosseum', name: 'Pokémon Colosseum', versionGroupId: 'colosseum' },
  { id: 'xd', name: 'Pokémon XD: Gale of Darkness', versionGroupId: 'xd' },
  { id: 'diamond', name: 'Pokémon Diamond', versionGroupId: 'dpp' },
  { id: 'pearl', name: 'Pokémon Pearl', versionGroupId: 'dpp' },
  { id: 'platinum', name: 'Pokémon Platinum', versionGroupId: 'dpp' },
  { id: 'heartgold', name: 'Pokémon HeartGold', versionGroupId: 'hgss' },
  { id: 'soulsilver', name: 'Pokémon SoulSilver', versionGroupId: 'hgss' },
  { id: 'black', name: 'Pokémon Black', versionGroupId: 'bw' },
  { id: 'white', name: 'Pokémon White', versionGroupId: 'bw' },
  { id: 'black2', name: 'Pokémon Black 2', versionGroupId: 'bw2' },
  { id: 'white2', name: 'Pokémon White 2', versionGroupId: 'bw2' },
  { id: 'x', name: 'Pokémon X', versionGroupId: 'xy' },
  { id: 'y', name: 'Pokémon Y', versionGroupId: 'xy' },
  { id: 'omegaruby', name: 'Pokémon Omega Ruby', versionGroupId: 'oras' },
  { id: 'alphasapphire', name: 'Pokémon Alpha Sapphire', versionGroupId: 'oras' },
  { id: 'sun', name: 'Pokémon Sun', versionGroupId: 'sm' },
  { id: 'moon', name: 'Pokémon Moon', versionGroupId: 'sm' },
  { id: 'ultrasun', name: 'Pokémon Ultra Sun', versionGroupId: 'usum' },
  { id: 'ultramoon', name: 'Pokémon Ultra Moon', versionGroupId: 'usum' },
  { id: 'letsgopikachu', name: "Pokémon Let's Go Pikachu", versionGroupId: 'lgpe' },
  { id: 'letsgoeevee', name: "Pokémon Let's Go Eevee", versionGroupId: 'lgpe' },
  { id: 'sword', name: 'Pokémon Sword', versionGroupId: 'swsh' },
  { id: 'shield', name: 'Pokémon Shield', versionGroupId: 'swsh' },
  { id: 'legendsarceus', name: 'Pokémon Legends: Arceus', versionGroupId: 'pla' },
  { id: 'brilliantdiamond', name: 'Pokémon Brilliant Diamond', versionGroupId: 'bdsp' },
  { id: 'shiningpearl', name: 'Pokémon Shining Pearl', versionGroupId: 'bdsp' },
  { id: 'scarlet', name: 'Pokémon Scarlet', versionGroupId: 'sv' },
  { id: 'violet', name: 'Pokémon Violet', versionGroupId: 'sv' },
  { id: 'legendsza', name: 'Pokémon Legends: Z-A', versionGroupId: 'lza' },
]

// --- SPECIES, FORMES, COLLECTIBLE VARIANTS ---
const allPkmn = Dex.species.all()

const speciesMap = new Map<string, any>()
const formes: any[] = []
const collectibleVariants: any[] = []

for (const pkmn of allPkmn) {
  if (shouldExclude(pkmn)) continue

  const isBase = pkmn.baseSpecies === pkmn.name
  const speciesName = pkmn.baseSpecies
  const speciesId = slugify(speciesName)

  // build species entry once per base species
  if (isBase && !speciesMap.has(speciesId)) {
    speciesMap.set(speciesId, {
      id: speciesId,
      name: speciesName,
      dexNumber: pkmn.num,
      introducedGroupId: genToVersionGroup(pkmn.gen),
      prevolutionId: pkmn.prevo ? slugify(pkmn.prevo) : undefined,
    })
  }

  // build forme entry
  const formeId = slugify(pkmn.name)
  const hasGenderDiff = GENDER_DIFFERENCE_SPECIES.includes(speciesName)
  const formeType = getFormeType(pkmn)

  if (hasGenderDiff) {
    // create male and female formes separately
    formes.push({
      id: `${formeId}-m`,
      speciesId,
      displayName: `${pkmn.name} (Male)`,
      formeType: formeType === 'base' ? 'gender' : formeType,
      isHomeVisible: true,
      genderRequirement: 'male',
    })
    formes.push({
      id: `${formeId}-f`,
      speciesId,
      displayName: `${pkmn.name} (Female)`,
      formeType: formeType === 'base' ? 'gender' : formeType,
      isHomeVisible: true,
      genderRequirement: 'female',
    })
    // variants for both genders
    for (const gender of ['m', 'f']) {
      for (const shiny of [false, true]) {
        collectibleVariants.push({
          id: `${formeId}-${gender}-${shiny ? 'shiny' : 'normal'}`,
          formeId: `${formeId}-${gender}`,
          isShiny: shiny,
          isAlpha: false,
        })
      }
    }
  } else {
    formes.push({
      id: formeId,
      speciesId,
      displayName: pkmn.name,
      formeType,
      isHomeVisible: true,
      genderRequirement: 'none',
    })
    for (const shiny of [false, true]) {
      collectibleVariants.push({
        id: `${formeId}-${shiny ? 'shiny' : 'normal'}`,
        formeId,
        isShiny: shiny,
        isAlpha: false,
      })
    }
  }
}

const species = Array.from(speciesMap.values())

// --- HELPER: map gen number to version group id ---
function genToVersionGroup(gen: number): string {
  const map: Record<number, string> = {
    1: 'rby', 2: 'gsc', 3: 'rse', 4: 'dpp',
    5: 'bw', 6: 'xy', 7: 'sm', 8: 'swsh', 9: 'sv'
  }
  return map[gen] ?? 'rby'
}

// --- WRITE FILES ---
const dataDir = path.resolve(__dirname, '../src/data')

fs.writeFileSync(path.join(dataDir, 'version-groups.json'), JSON.stringify(versionGroups, null, 2))
fs.writeFileSync(path.join(dataDir, 'game-titles.json'), JSON.stringify(gameTitles, null, 2))
fs.writeFileSync(path.join(dataDir, 'species.json'), JSON.stringify(species, null, 2))
fs.writeFileSync(path.join(dataDir, 'formes.json'), JSON.stringify(formes, null, 2))
fs.writeFileSync(path.join(dataDir, 'collectible-variants.json'), JSON.stringify(collectibleVariants, null, 2))
fs.writeFileSync(path.join(dataDir, 'game-availability.json'), JSON.stringify([], null, 2))

console.log(`Species: ${species.length}`)
console.log(`Formes: ${formes.length}`)
console.log(`Collectible Variants: ${collectibleVariants.length}`)
console.log('Done!')