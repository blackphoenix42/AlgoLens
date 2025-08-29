type Props = { topic: 'sorting' | 'graphs' | 'arrays'; className?: string }

export default function TopicIcon({ topic, className }: Props) {
  if (topic === 'sorting') {
    // bars ascending
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden>
        <rect x="3" y="12" width="4" height="9" rx="1"></rect>
        <rect x="10" y="6" width="4" height="15" rx="1"></rect>
        <rect x="17" y="3" width="4" height="18" rx="1"></rect>
      </svg>
    )
  }
  if (topic === 'arrays') {
    // bracketed grid
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden>
        <rect x="5" y="6" width="14" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="2"></rect>
        <line x1="9" y1="6" x2="9" y2="18" stroke="currentColor" strokeWidth="2"></line>
        <line x1="15" y1="6" x2="15" y2="18" stroke="currentColor" strokeWidth="2"></line>
      </svg>
    )
  }
  // graphs
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <circle cx="6" cy="6" r="3"></circle>
      <circle cx="18" cy="6" r="3"></circle>
      <circle cx="12" cy="18" r="3"></circle>
      <line x1="8.5" y1="8.5" x2="10.5" y2="15.5" stroke="currentColor" strokeWidth="2"></line>
      <line x1="15.5" y1="8.5" x2="13.5" y2="15.5" stroke="currentColor" strokeWidth="2"></line>
      <line x1="9" y1="6" x2="15" y2="6" stroke="currentColor" strokeWidth="2"></line>
    </svg>
  )
}
