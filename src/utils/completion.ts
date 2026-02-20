export function getProgressColour(obtained: number, total: number): string {
  if (total === 0) return 'bg-muted text-muted-foreground'
  const pct = obtained / total
  if (pct === 0) return 'bg-muted text-muted-foreground'
  if (pct < 0.25) return 'bg-red-200 text-red-800'
  if (pct < 0.5) return 'bg-orange-200 text-orange-800'
  if (pct < 0.75) return 'bg-yellow-200 text-yellow-800'
  if (pct < 1) return 'bg-lime-200 text-lime-800'
  return 'bg-green-200 text-green-800'
}