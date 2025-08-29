export default function ExpandIcon({ className='w-4 h-4' }:{className?:string}) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M4 10V4h6M14 4h6v6M20 14v6h-6M10 20H4v-6" stroke="currentColor" strokeWidth="2" fill="none"/>
    </svg>
  )
}
