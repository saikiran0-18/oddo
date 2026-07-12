'use client'

import { useState } from 'react'
import { matchSorter } from 'match-sorter'
import { DriverActions } from './DriverActions'

export function DriverListClient({ initialDrivers }: { initialDrivers: any[] }) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sortField, setSortField] = useState('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  // 1. Search
  let filtered = search ? matchSorter(initialDrivers, search, { keys: ['name', 'licenseNumber', 'contactNumber'] }) : initialDrivers

  // 2. Filter
  if (statusFilter) {
    filtered = filtered.filter(d => d.status === statusFilter)
  }

  // 3. Sort
  filtered.sort((a, b) => {
    const aVal = a[sortField]
    const bVal = b[sortField]
    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1
    return 0
  })

  return (
    <>
      <div className="glass-card mb-6 flex gap-4 flex-wrap">
        <input 
          type="text" 
          placeholder="Search drivers..." 
          className="input-field" 
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: '300px' }}
        />
        <select 
          className="input-field" 
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          style={{ maxWidth: '200px' }}
        >
          <option value="">All Statuses</option>
          <option value="Available">Available</option>
          <option value="On Trip">On Trip</option>
          <option value="Off Duty">Off Duty</option>
          <option value="Suspended">Suspended</option>
        </select>
      </div>

      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
              <tr>
                <th onClick={() => handleSort('name')} className="cursor-pointer" style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Name {sortField === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('licenseNumber')} className="cursor-pointer" style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  License No. {sortField === 'licenseNumber' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('licenseCategory')} className="cursor-pointer" style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Category {sortField === 'licenseCategory' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('contactNumber')} className="cursor-pointer" style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Contact {sortField === 'contactNumber' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('safetyScore')} className="cursor-pointer" style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Safety Score {sortField === 'safetyScore' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('status')} className="cursor-pointer" style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Status {sortField === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No drivers found.
                  </td>
                </tr>
              ) : filtered.map(driver => (
                <tr key={driver.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem' }}>{driver.name}</td>
                  <td style={{ padding: '1rem' }}>{driver.licenseNumber}</td>
                  <td style={{ padding: '1rem' }}>{driver.licenseCategory}</td>
                  <td style={{ padding: '1rem' }}>{driver.contactNumber}</td>
                  <td style={{ padding: '1rem' }}>{driver.safetyScore}/100</td>
                  <td style={{ padding: '1rem' }}>
                    <span className={`badge ${
                      driver.status === 'Available' ? 'badge-success' :
                      driver.status === 'On Trip' ? 'badge-warning' :
                      driver.status === 'Off Duty' ? 'badge-neutral' : 'badge-danger'
                    }`}>
                      {driver.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <DriverActions id={driver.id} status={driver.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
