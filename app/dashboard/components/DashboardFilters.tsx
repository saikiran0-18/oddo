'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useState } from 'react'

export default function DashboardFilters({ initialType, initialStatus }: { initialType: string, initialStatus: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [type, setType] = useState(initialType)
  const [status, setStatus] = useState(initialStatus)

  const handleApply = () => {
    const params = new URLSearchParams(searchParams)
    if (type) params.set('type', type)
    else params.delete('type')

    if (status) params.set('status', status)
    else params.delete('status')

    router.push(`${pathname}?${params.toString()}`)
  }

  const handleClear = () => {
    setType('')
    setStatus('')
    router.push(pathname)
  }

  return (
    <div className="flex gap-4 items-end">
      <div className="input-group" style={{ marginBottom: 0, width: '200px' }}>
        <label className="input-label" style={{ fontSize: '0.8rem' }}>Vehicle Type</label>
        <select className="input-field" value={type} onChange={e => setType(e.target.value)}>
          <option value="">All Types</option>
          <option value="Van">Van</option>
          <option value="Light Truck">Light Truck</option>
          <option value="Heavy Truck">Heavy Truck</option>
          <option value="Refrigerated Truck">Refrigerated Truck</option>
        </select>
      </div>
      
      <div className="input-group" style={{ marginBottom: 0, width: '200px' }}>
        <label className="input-label" style={{ fontSize: '0.8rem' }}>Vehicle Status</label>
        <select className="input-field" value={status} onChange={e => setStatus(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="Available">Available</option>
          <option value="On Trip">On Trip</option>
          <option value="In Shop">In Shop</option>
          <option value="Retired">Retired</option>
        </select>
      </div>

      <button onClick={handleApply} className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>Filter</button>
      {(type || status) && (
        <button onClick={handleClear} className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>Clear</button>
      )}
    </div>
  )
}
