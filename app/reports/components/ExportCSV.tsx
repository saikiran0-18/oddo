'use client'

import { Download } from 'lucide-react'

interface VehicleReportRow {
  registrationNumber: string
  completedTrips: number
  totalDistance: number
  acquisitionCost: number
  status: string
}

export default function ExportCSV({ data }: { data: VehicleReportRow[] }) {
  const handleExport = () => {
    // CSV Header
    const headers = ['Vehicle Registration', 'Completed Trips', 'Total Distance (km)', 'Acquisition Cost (INR)', 'Status']
    
    // CSV Rows
    const rows = data.map(v => [
      v.registrationNumber,
      v.completedTrips,
      v.totalDistance,
      v.acquisitionCost.toFixed(2),
      v.status
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'transitops-report.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <button onClick={handleExport} className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>
      <Download size={18} />
      Export CSV
    </button>
  )
}
