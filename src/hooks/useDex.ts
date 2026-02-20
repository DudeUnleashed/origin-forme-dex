import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db'

export function useSpecies(search?: string) {
  return useLiveQuery(() => {
    if (search && search.length > 0) {
      return db.species
        .filter(s => s.name.toLowerCase().includes(search.toLowerCase()))
        .toArray()
        .then(results => results.sort((a, b) => a.dexNumber - b.dexNumber))
    }
    return db.species.orderBy('dexNumber').toArray()
  }, [search])
}

export function useFormesForSpecies(speciesId: string) {
  return useLiveQuery(
    () => db.formes.where('speciesId').equals(speciesId).toArray(),
    [speciesId]
  )
}

export function useAllSpeciesProgress() {
  return useLiveQuery(async () => {
    const [formes, variants, specimens] = await Promise.all([
      db.formes.toArray(),
      db.collectibleVariants.toArray(),
      db.specimens.toArray(),
    ])

    // group formes by species
    const formesBySpecies = new Map<string, string[]>()
    for (const forme of formes) {
      if (!formesBySpecies.has(forme.speciesId)) {
        formesBySpecies.set(forme.speciesId, [])
      }
      formesBySpecies.get(forme.speciesId)!.push(forme.id)
    }

    // group variants by forme
    const variantsByForme = new Map<string, string[]>()
    for (const variant of variants) {
      if (!variantsByForme.has(variant.formeId)) {
        variantsByForme.set(variant.formeId, [])
      }
      variantsByForme.get(variant.formeId)!.push(variant.id)
    }

    // get obtained variant ids from specimens
    const obtainedVariantIds = new Set(specimens.map(s => s.variantId))
    const variantMap = new Map(variants.map(v => [v.id, v]))

    // calculate progress per species
    const progress = new Map<string, { 
      totalFormes: number
      totalVariants: number
      obtainedVariants: number
      totalShinyVariants: number
      obtainedShinyVariants: number
    }>()

    for (const [speciesId, formeIds] of formesBySpecies) {
      const variantIds = formeIds.flatMap(fId => variantsByForme.get(fId) ?? [])
      
      progress.set(speciesId, {
        totalFormes: formeIds.length,
        totalVariants: variantIds.filter(vId => {
          const variant = variantMap.get(vId)
          return variant && !variant.isShiny
        }).length,
        obtainedVariants: variantIds.filter(vId =>
          obtainedVariantIds.has(vId) && !variantMap.get(vId)?.isShiny
        ).length,
        totalShinyVariants: variantIds.filter(vId => {
          const variant = variantMap.get(vId)
          return variant && variant.isShiny
        }).length,
        obtainedShinyVariants: variantIds.filter(vId =>
          obtainedVariantIds.has(vId) && variantMap.get(vId)?.isShiny
        ).length,
      })
    }

    return progress
  })
}