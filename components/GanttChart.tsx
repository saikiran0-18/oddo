'use client'

import React, { useMemo } from 'react'

export interface GanttTrip {
  id: string
  vehicleReg: string
  source: string
  destination: string
  status: string
  createdAt: Date
  plannedDistance: number
}

interface GanttChartProps {
  trips: GanttTrip[]
}

export const GanttChart: React.FC<GanttChartProps> = ({ trips }) => {
  // 1. Process trips into Gantt items
  const processedTrips = useMemo(() => {
    return trips.map(t => {
      const start = new Date(t.createdAt).getTime()
      // Assume 60 km/h average speed. (hours = distance / 60). Convert to ms.
      const durationMs = (t.plannedDistance / 60) * 60 * 60 * 1000
      const end = start + Math.max(durationMs, 4 * 60 * 60 * 1000) // minimum 4 hours for visual padding
      return {
        ...t,
        startMs: start,
        endMs: end
      }
    })
  }, [trips])

  // 2. Determine timeline bounds
  const bounds = useMemo(() => {
    if (processedTrips.length === 0) {
      const now = Date.now()
      return { min: now - 86400000, max: now + 86400000 * 3, range: 86400000 * 4 }
    }
    const minStart = Math.min(...processedTrips.map(t => t.startMs))
    const maxEnd = Math.max(...processedTrips.map(t => t.endMs))
    
    // Add 12 hours padding on both sides
    const padding = 12 * 60 * 60 * 1000
    const min = minStart - padding
    const max = maxEnd + padding
    return { min, max, range: max - min }
  }, [processedTrips])

  // 3. Group by Vehicle
  const vehicles = useMemo(() => {
    const vMap = new Map<string, typeof processedTrips>()
    processedTrips.forEach(t => {
      if (!vMap.has(t.vehicleReg)) vMap.set(t.vehicleReg, [])
      vMap.get(t.vehicleReg)!.push(t)
    })
    return Array.from(vMap.entries()).map(([reg, vTrips]) => ({
      reg,
      trips: vTrips
    }))
  }, [processedTrips])

  // Timeline markers (generate a marker every 24 hours from min)
  const markers = []
  for (let t = bounds.min; t <= bounds.max; t += 24 * 60 * 60 * 1000) {
    markers.push(t)
  }

  if (trips.length === 0) {
    return (
      <div className="glass-card flex justify-center items-center h-64">
        <p className="text-secondary">No trip data available for Gantt Chart.</p>
      </div>
    )
  }

  return (
    <div className="glass-card" style={{ padding: '1rem', overflowX: 'auto' }}>
      <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ 
          display: 'inline-block', 
          width: '12px', height: '12px', 
          borderRadius: '50%', 
          background: 'var(--accent-primary)' 
        }} />
        Fleet Schedule (Gantt)
      </h3>
      
      <div style={{ minWidth: '800px', position: 'relative' }}>
        {/* Header - Timeline */}
        <div style={{ 
          display: 'flex', 
          marginLeft: '150px', // width of the vehicle label column
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '0.5rem',
          position: 'relative',
          height: '30px'
        }}>
          {markers.map((ms, i) => {
            const leftPercent = ((ms - bounds.min) / bounds.range) * 100
            return (
              <div key={i} style={{ 
                position: 'absolute', 
                left: `${leftPercent}%`, 
                transform: 'translateX(-50%)',
                fontSize: '0.75rem',
                color: 'var(--text-secondary)'
              }}>
                {new Date(ms).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </div>
            )
          })}
        </div>

        {/* Rows - Vehicles */}
        <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {vehicles.map((v, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', minHeight: '40px' }}>
              
              {/* Vehicle Label */}
              <div style={{ 
                width: '150px', 
                flexShrink: 0, 
                fontWeight: 600, 
                fontSize: '0.875rem',
                color: 'var(--text-secondary)'
              }}>
                {v.reg}
              </div>

              {/* Gantt Area */}
              <div style={{ 
                flex: 1, 
                position: 'relative', 
                height: '40px',
                background: 'rgba(0,0,0,0.02)',
                borderRadius: '8px',
                border: '1px dashed var(--border-color)'
              }}>
                
                {v.trips.map(trip => {
                  const leftPercent = ((trip.startMs - bounds.min) / bounds.range) * 100
                  const widthPercent = ((trip.endMs - trip.startMs) / bounds.range) * 100

                  // Colors based on status
                  let bgColor = 'var(--accent-primary)'
                  if (trip.status === 'Completed') bgColor = 'var(--success)'
                  if (trip.status === 'Draft') bgColor = 'var(--text-tertiary)'
                  if (trip.status === 'Cancelled') bgColor = 'var(--danger)'

                  return (
                    <div 
                      key={trip.id}
                      style={{
                        position: 'absolute',
                        left: `${leftPercent}%`,
                        width: `${widthPercent}%`,
                        top: '4px',
                        bottom: '4px',
                        background: bgColor,
                        borderRadius: '6px',
                        boxShadow: 'var(--shadow-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0 8px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        transition: 'transform 0.2s'
                      }}
                      title={`${trip.source} → ${trip.destination} (${trip.status})`}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scaleY(1.1)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scaleY(1)'}
                    >
                      <span style={{ 
                        color: 'white', 
                        fontSize: '0.7rem', 
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        fontWeight: 500
                      }}>
                        {trip.source} → {trip.destination}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
