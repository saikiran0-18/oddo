'use client'

import { useState } from 'react'
import { Upload, FileText, Trash2, Download } from 'lucide-react'

export function VehicleDocumentUpload({ vehicleId, existingDocuments = [] }: { vehicleId: string, existingDocuments?: any[] }) {
  const [documents, setDocuments] = useState(existingDocuments)
  const [isUploading, setIsUploading] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    
    const file = e.target.files[0]
    setIsUploading(true)
    
    const formData = new FormData()
    formData.append('file', file)
    
    try {
      const res = await fetch(`/api/vehicles/${vehicleId}/documents`, {
        method: 'POST',
        body: formData
      })
      const data = await res.json()
      if (data.success) {
        setDocuments([...documents, data.document])
      } else {
        alert(data.error || 'Upload failed')
      }
    } catch (e) {
      alert('Upload failed')
    }
    
    setIsUploading(false)
  }

  return (
    <div className="glass-card mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3>Vehicle Documents</h3>
        <label className="btn btn-primary cursor-pointer" style={{ padding: '0.5rem 1rem' }}>
          <Upload size={16} className="mr-2" />
          {isUploading ? 'Uploading...' : 'Upload Document'}
          <input type="file" className="hidden" onChange={handleUpload} disabled={isUploading} />
        </label>
      </div>
      
      {documents.length === 0 ? (
        <p className="text-secondary text-center py-4">No documents uploaded yet.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {documents.map((doc, idx) => (
            <div key={idx} className="flex justify-between items-center p-3" style={{ background: 'var(--bg-tertiary)', borderRadius: '8px' }}>
              <div className="flex items-center gap-3">
                <FileText size={20} className="text-secondary" />
                <div>
                  <p className="m-0 font-medium">{doc.name}</p>
                  <p className="m-0 text-secondary" style={{ fontSize: '0.75rem' }}>
                    Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <a href={doc.url} download className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem' }} title="Download">
                  <Download size={16} />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
