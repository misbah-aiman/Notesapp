'use client'
import { useEffect, useState } from 'react'
import { Note } from '@/lib/types'
import { getBin, restoreNote, deleteNotePermanently } from '@/lib/supabase'

export default function BinPage() {
  const [bin, setBin] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBinNotes = async () => {
      try {
        setLoading(true)
        const binData = await getBin()
        setBin(binData)
      } catch (error) {
        console.error('Error fetching bin notes:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchBinNotes()
  }, [])

  const handleRestore = async (id: string) => {
    try {
      await restoreNote(id)
      
      const newBin = bin.filter(n => n.id !== id)
      setBin(newBin)
    } catch (error) {
      console.error('Error restoring note:', error)
    }
  }

  const handleDeletePermanently = async (id: string) => {
    try {
      await deleteNotePermanently(id)
      
      const newBin = bin.filter(n => n.id !== id)
      setBin(newBin)
    } catch (error) {
      console.error('Error deleting note permanently:', error)
    }
  }

  if (loading) {
    return (
      <div style={{ 
        padding: 20, 
        minHeight: '100vh',
        backgroundColor: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'black'
      }}>
        <p>Loading bin...</p>
      </div>
    )
  }

  return (
    <div style={{ 
      padding: 20, 
      minHeight: '100vh',
      backgroundColor: 'white'
    }}>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '15px',
        marginBottom: '30px',
        padding: '10px 20px',
        backgroundColor: '#e8f5e8',
        borderRadius: '12px'
      }}>
        <h1 style={{ margin: 0, color: '#2d5016' }}>Recycle Bin</h1>
      </div>

      {bin.length === 0 ? (
        <p style={{
          padding: '20px',
          backgroundColor: 'rgba(0, 0, 0, 0.05)',
          borderRadius: '8px',
          textAlign: 'center',
          color: 'black'
        }}>Bin is empty.</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
          {bin.map(note => (
            <div key={note.id} style={{
              backgroundColor: 'rgba(0, 0, 0, 0.05)',
              padding: 20,
              borderRadius: 12,
              width: 280,
              minHeight: 200,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{note.title}</h3>
                <p style={{ 
                  margin: '0 0 15px 0', 
                  color: '#666',
                  lineHeight: '1.4'
                }}>{note.content}</p>
              </div>
              
              <div>
                <div style={{
                  padding: '6px 12px',
                  backgroundColor: '#e8f5e8',
                  borderRadius: '8px',
                  marginBottom: '8px'
                }}>
                  <small style={{ color: '#2d5016', fontSize: '12px' }}>
                    Created: {new Date(note.createdAt).toLocaleString()}
                  </small>
                </div>


                <div style={{
                  padding: '6px 12px',
                  backgroundColor: 'rgba(232, 245, 232, 0.6)',
                  borderRadius: '8px',
                  marginBottom: '10px'
                }}>
                  <small style={{ color: '#2d5016', fontSize: '12px' }}>
                    Deleted: {new Date().toLocaleString()}
                  </small>
                </div>
                
                <div style={{ display: 'flex', gap: 10 }}>
                  <button 
                    onClick={() => handleRestore(note.id)}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Restore
                  </button>
                  <button 
                    onClick={() => handleDeletePermanently(note.id)}
                    style={{
                      padding: '8px 16px',
                      background: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}