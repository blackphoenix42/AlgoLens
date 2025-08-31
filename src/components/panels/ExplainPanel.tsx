import { useState } from 'react'

import type { AlgoMeta } from '@/algorithms/types'
import ExpandIcon from '@/components/ui/ExpandIcon'
import Modal from '@/components/ui/Modal'

export default function ExplainPanel({ meta, explain }: { meta: AlgoMeta; explain?: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="card relative">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium mb-2">Explanation</div>
        <button className="px-2 py-1 rounded border" onClick={() => setOpen(true)} title="Expand"><ExpandIcon/></button>
      </div>
      <p className="text-sm text-gray-800 min-h-[3rem]">{explain ?? 'Step through to see explanations for each action.'}</p>

      <Modal open={open} onClose={() => setOpen(false)} title={`${meta.title} — Explanation`}>
        <p className="text-sm text-gray-800">{explain ?? 'Step to see explanation.'}</p>
      </Modal>
    </div>
  )
}
