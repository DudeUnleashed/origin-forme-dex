import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSpecies, useAllSpeciesProgress } from '../hooks/useDex'
import { Species } from '../types/catalogue'
import { getProgressColour } from '../utils/completion'

interface SpeciesProgress {
  totalFormes: number
  totalVariants: number
  obtainedVariants: number
  totalShinyVariants: number
  obtainedShinyVariants: number
}

function SpeciesCard({ species, progress }: { species: Species, progress?: SpeciesProgress }) {
  return (
    <Link to={`/species/${species.id}`} className="border rounded p-4 hover:bg-accent transition-colors block">
      <p className="font-bold">{species.dexNumber}. {species.name}</p>
      {progress ? (
        <>
          <div className="flex gap-2 mt-2">
            <span className={`text-xs font-mono px-2 py-1 rounded ${getProgressColour(progress.obtainedVariants, progress.totalVariants)}`}>
              {progress.obtainedVariants}
            </span>
            <span className={`text-xs font-mono px-2 py-1 rounded ${getProgressColour(progress.obtainedShinyVariants, progress.totalShinyVariants)}`}>
              ✨ {progress.obtainedShinyVariants}
            </span>
          </div>
        </>
      ) : (
        <p className="text-sm text-muted-foreground">Loading...</p>
      )}
    </Link>
  )
}

export default function DexPage() {
  const [search, setSearch] = useState('')
  const species = useSpecies(search)
  const allProgress = useAllSpeciesProgress()

  if (!species) return <div>Loading...</div>

  return (
    <div className="flex flex-col gap-4">
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search Pokemon..."
        className="border rounded p-2 w-64"
      />
      <div className="grid grid-cols-4 gap-4">
        {species.map(s => (
          <SpeciesCard
            key={s.id}
            species={s}
            progress={allProgress?.get(s.id)}
          />
        ))}
      </div>
    </div>
  )
}