type Props = { counters?: Record<string, number> }

export default function MetricsBar({ counters }: Props) {
  const entries = Object.entries(counters ?? {})
  if (entries.length === 0) return <div className="card text-sm text-gray-500">No metrics yet</div>
  return (
    <div className="card flex gap-4 text-sm">
      {entries.map(([k, v]) => (
        <div key={k}><span className="font-medium">{k}:</span> {v}</div>
      ))}
    </div>
  )
}
