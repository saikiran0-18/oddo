'use client'

import { useState } from 'react'
import { matchSorter } from 'match-sorter'
import { VehicleActions } from './VehicleActions'

export function VehicleListClient({ initialVehicles }: { initialVehicles: any[] }) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sortField, setSortField] = useState('registrationNumber')
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
  let filtered = search ? matchSorter(initialVehicles, search, { keys: ['registrationNumber', 'name', 'type'] }) : initialVehicles

  // 2. Filter
  if (statusFilter) {
    filtered = filtered.filter(v => v.status === statusFilter)
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
          placeholder="Search vehicles..." 
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
          <option value="In Shop">In Shop</option>
          <option value="Retired">Retired</option>
        </select>
      </div>

      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
              <tr>
                <th onClick={() => handleSort('registrationNumber')} className="cursor-pointer" style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Reg. Number {sortField === 'registrationNumber' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('name')} className="cursor-pointer" style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Model {sortField === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('type')} className="cursor-pointer" style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Type {sortField === 'type' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('maxLoadCapacity')} className="cursor-pointer" style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Capacity (kg) {sortField === 'maxLoadCapacity' && (sortOrder === 'asc' ? '↑' : '↓')}
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
                  <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No vehicles found.
                  </td>
                </tr>
              ) : filtered.map(vehicle => (
                <tr key={vehicle.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem' }}>{vehicle.registrationNumber}</td>
                  <td style={{ padding: '1rem' }}>{vehicle.name}</td>
                  <td style={{ padding: '1rem' }}>{vehicle.type}</td>
                  <td style={{ padding: '1rem' }}>{vehicle.maxLoadCapacity}</td>
                  <td style={{ padding: '1rem' }}>
                    <span className={`badge ${
                      vehicle.status === 'Available' ? 'badge-success' :
                      vehicle.status === 'In Shop' ? 'badge-warning' :
                      vehicle.status === 'Retired' ? 'badge-neutral' : 'badge-danger'
                    }`}>
                      {vehicle.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <VehicleActions id={vehicle.id} status={vehicle.status} />
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
