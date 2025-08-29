type Props = { lines: string[]; activeLine?: number }

export default function Pseudocode({ lines, activeLine }: Props) {
  return (
    <ol className="font-mono text-sm leading-6">
      {lines.map((line, i) => {
        const isActive = activeLine && activeLine - 1 === i
        return (
          <li key={i} className={`px-2 rounded ${isActive ? 'bg-yellow-100 ring-1 ring-yellow-300' : ''}`}>
            <span className="text-gray-400 select-none mr-2">{String(i+1).padStart(2,'0')}</span>
            <span>{line}</span>
          </li>
        )
      })}
    </ol>
  )
}
