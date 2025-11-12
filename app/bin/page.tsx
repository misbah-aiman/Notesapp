'use client'
import { useEffect, useState } from 'react'

interface Note {
  _id: string
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
  in_bin?: boolean
}

export default function BinPage() {
  const [bin, setBin] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBinNotes()
  }, [])

  const fetchBinNotes = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/notes?bin=true')
      const result = await res.json()
      
      if (!res.ok) {
        throw new Error(result.error || 'Failed to fetch bin notes')
      }
      
      setBin(result.data)
    } catch (error) {
      console.error('Fetch bin error:', error)
      alert('Failed to load bin notes')
    } finally {
      setLoading(false)
    }
  }

  const handleRestore = async (id: string) => {
    try {
      const res = await fetch(`/api/notes/${id}`, { 
        method: 'POST'
      })
      const result = await res.json()
      
      if (!res.ok) {
        throw new Error(result.error || 'Failed to restore note')
      }
      
      setBin(prev => prev.filter(note => note._id !== id))
      alert('Note restored successfully!')
    } catch (error: any) {
      console.error('Restore error:', error)
      alert(error.message || 'Failed to restore note')
    }
  }

  const handleDeletePermanently = async (id: string) => {
    if (!confirm('Are you sure? This will permanently delete the note!')) return
    
    try {
      const res = await fetch(`/api/notes/${id}`, { 
        method: 'PATCH' 
      })
      const result = await res.json()
      
      if (!res.ok) {
        throw new Error(result.error || 'Failed to delete note permanently')
      }
      
      setBin(prev => prev.filter(note => note._id !== id))
      alert('Note permanently deleted!')
    } catch (error: any) {
      console.error('Permanent delete error:', error)
      alert(error.message || 'Failed to delete note permanently')
    }
  }

  if (loading) return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <p>Loading bin...</p>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', padding: '50px', backgroundColor: 'white' }}>
      <h1 style={{ color: 'black', marginBottom: '30px' }}>Bin</h1>

      {bin.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
          <p>Bin is empty. Notes you delete will appear here.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '20px', maxWidth: '800px' }}>
          {bin.map(note => (
            <div 
              key={note._id}
              style={{
                border: '1px solid #ffcccc',
                borderRadius: '8px',
                padding: '20px',
                backgroundColor: '#fff5f5'
              }}
            >
              <h3 style={{ margin: '0 0 10px 0', color: 'black' }}>{note.title}</h3>
              <p style={{ 
                margin: '0 0 15px 0', 
                color: '#333',
                whiteSpace: 'pre-wrap',
                lineHeight: '1.5'
              }}>
                {note.content}
              </p>
              <div style={{ 
                display: 'flex', 
                gap: '10px',
                fontSize: '12px',
                color: '#666',
                marginBottom: '15px'
              }}>
                <span>Deleted: {new Date(note.updatedAt).toLocaleDateString()}</span>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => handleRestore(note._id)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Restore
                </button>
                <button 
                  onClick={() => handleDeletePermanently(note._id)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Delete Permanently
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}