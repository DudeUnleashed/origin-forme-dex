import { Dex } from '@pkmn/dex'

const species = Dex.species.get('pikachu')
console.log(JSON.stringify(species, null, 2))

const forme = Dex.species.get('raichu-alola')
console.log(JSON.stringify(forme, null, 2))

const allSpecies = Dex.species.all()
console.log('total species count:', allSpecies.length)

// check a gender difference mon
const frillish = Dex.species.get('frillish')
console.log('frillish gender ratio:', frillish.genderRatio)

// check isNonstandard values
const mega = Dex.species.get('charizard-mega-x')
console.log('mega nonstandard:', mega.isNonstandard)

const gmax = Dex.species.get('charizard-gmax')
console.log('gmax nonstandard:', gmax.isNonstandard)

// check a mon with no formes
const bulbasaur = Dex.species.get('bulbasaur')
console.log('bulbasaur otherFormes:', bulbasaur.otherFormes)

// check what's being excluded
const allPkmn = Dex.species.all()
let excluded = 0
let excludedNames: string[] = []

for (const pkmn of allPkmn) {
  if (pkmn.baseSpecies === pkmn.name) { // base species only
    if (pkmn.isNonstandard) {
      excluded++
      excludedNames.push(`${pkmn.name} (${pkmn.isNonstandard})`)
    }
  }
}

console.log('excluded base species count:', excluded)
console.log('excluded sample:', excludedNames.slice(0, 20))
