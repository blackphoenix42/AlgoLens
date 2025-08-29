export const read = () => new URLSearchParams(location.search)

export const write = (partial: Record<string, string | number | undefined | null>) => {
  const q = new URLSearchParams(location.search)
  Object.entries(partial).forEach(([k, v]) => {
    if (v === undefined || v === null) q.delete(k)
    else q.set(k, String(v))
  })
  history.replaceState(null, '', `?${q.toString()}`)
}
